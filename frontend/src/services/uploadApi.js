import { ApiRequestError, getToken } from "./api.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // keep in sync with backend/src/routes/uploadRoutes.js
const MAX_DIMENSION = 1600; // px — plenty for a product page, keeps files small
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Shrinks big phone photos in the browser before upload (max 1600px, WebP).
// Animated GIFs and anything that doesn't get smaller are sent untouched.
async function shrinkImage(file) {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    return blob && blob.type === "image/webp" && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/** Uploads one photo (admin only) and resolves to its public URL. */
export async function uploadProductImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ApiRequestError(415, `"${file.name}" isn't a JPEG, PNG, WebP or GIF image.`);
  }
  const body = await shrinkImage(file);
  if (body.size > MAX_UPLOAD_BYTES) {
    throw new ApiRequestError(413, `"${file.name}" is too large (max 4 MB).`);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}/uploads`, {
      method: "POST",
      headers: { "Content-Type": body.type, Authorization: `Bearer ${getToken() || ""}` },
      body,
    });
  } catch {
    throw new ApiRequestError(0, "Couldn't reach the server. Check your connection and try again.");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // fall through with payload = null
  }
  if (!response.ok) {
    throw new ApiRequestError(response.status, payload?.message || "Upload failed.");
  }
  return payload.data.url;
}
