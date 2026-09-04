const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();

export const ADMIN_EMAIL = configuredAdminEmail || "";

export function isAdminEmail(email) {
  return Boolean(email) && Boolean(ADMIN_EMAIL) && email.toLowerCase() === ADMIN_EMAIL;
}