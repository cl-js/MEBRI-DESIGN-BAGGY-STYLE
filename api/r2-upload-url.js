import Busboy from "@fastify/busboy";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export const config = {
  api: { bodyParser: false, sizeLimit: "16mb" },
};

function json(response, status, body) {
  response.status(status).json(body);
}

function readMultipartBody(request) {
  return new Promise((resolve, reject) => {
    if (typeof request.pipe !== "function") {
      reject(new Error("The upload request stream is unavailable."));
      return;
    }

    const parser = Busboy({ headers: request.headers, limits: { fileSize: MAX_UPLOAD_BYTES } });
    const fields = {};
    let file;
    let fileInfo;
    let fileTooLarge = false;

    parser.on("field", (name, value) => { fields[name] = value; });
    parser.on("file", (name, stream, info) => {
      fileInfo = info;
      const chunks = [];
      stream.on("limit", () => { fileTooLarge = true; });
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => { file = Buffer.concat(chunks); });
    });
    parser.on("error", reject);
    parser.on("finish", () => resolve({ fields, file, fileInfo, fileTooLarge }));
    request.pipe(parser);
  });
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

  if (!accessToken || !supabaseUrl || !supabaseKey || !ADMIN_EMAIL) {
    return json(response, 401, { error: "Admin authentication is required." });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
  if (userError || userData.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return json(response, 403, { error: "You are not authorized to upload images." });
  }

  let multipart;
  try {
    multipart = await readMultipartBody(request);
  } catch (error) {
    console.error("Failed to parse image upload:", error);
    return json(response, 400, { error: "The image upload could not be read. Please try again." });
  }

  const { fields, file, fileInfo, fileTooLarge } = multipart;
  const filename = fileInfo?.filename || fields.filename;
  const contentType = fileInfo?.mimeType || fields.contentType;
  const uploadSize = file?.length || 0;

  if (fileTooLarge || !filename || !contentType?.startsWith("image/") || uploadSize <= 0 || uploadSize > MAX_UPLOAD_BYTES) {
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
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: file,
    ContentLength: uploadSize,
    ContentType: contentType,
  });
  try {
    await client.send(command);
  } catch (error) {
    console.error("Failed to upload image to R2:", error);
    return json(response, 502, { error: "Cloudflare R2 could not store the image. Please try again." });
  }

  return json(response, 200, { publicUrl: `${publicUrl}/${objectKey}` });
}
