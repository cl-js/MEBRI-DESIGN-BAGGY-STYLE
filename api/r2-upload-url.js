import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "englishpractice265@gmail.com";
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

function json(response, status, body) {
  response.status(status).json(body);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: "Method not allowed." });
  }

  const authorization = request.headers.authorization || "";
  const accessToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!accessToken || !supabaseUrl || !supabaseKey) {
    return json(response, 401, { error: "Admin authentication is required." });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
  if (userError || userData.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return json(response, 403, { error: "You are not authorized to upload images." });
  }

  const { filename, contentType, size } = request.body || {};
  if (!filename || !contentType?.startsWith("image/") || !Number.isFinite(size) || size <= 0 || size > MAX_UPLOAD_BYTES) {
    return json(response, 400, { error: "Upload an image smaller than 15 MB." });
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    return json(response, 500, { error: "R2 upload is not configured on the server." });
  }

  const extension = filename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const objectKey = `projects/${crypto.randomUUID()}.${extension}`;
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  const command = new PutObjectCommand({ Bucket: bucketName, Key: objectKey, ContentType: contentType });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

  return json(response, 200, { uploadUrl, publicUrl: `${publicUrl}/${objectKey}` });
}
