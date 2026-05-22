import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_ZIP_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_PHOTOS_PER_UPLOAD = 50;

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function getExtensionByMime(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export function getExtensionByFileName(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "jpg";
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".webp")) return "webp";
  return null;
}

export function sanitizeFileName(fileName: string) {
  const base = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "-");
  return base.replace(/^\.+/, "") || "foto";
}

export function isAllowedImageFile(file: File) {
  const extension = getExtensionByMime(file.type) ?? getExtensionByFileName(file.name);
  if (!extension) return false;
  if (!file.type) return true;
  return ALLOWED_MIME_TYPES.has(file.type);
}

export async function saveGalleryCover(file: File) {
  const extension = getExtensionByMime(file.type);
  if (!extension) {
    throw new Error("Formato invalido. Use JPG, PNG ou WEBP.");
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Arquivo excede o limite de 5MB.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery", "covers");
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/gallery/covers/${fileName}`;
}

export async function saveGalleryPhotoBuffer(
  albumId: string,
  buffer: Buffer,
  originalName: string,
  mimeType?: string,
) {
  const extension =
    (mimeType ? getExtensionByMime(mimeType) : null) ?? getExtensionByFileName(originalName);
  if (!extension) {
    throw new Error(`Arquivo ignorado: ${originalName}`);
  }
  if (buffer.byteLength <= 0 || buffer.byteLength > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`Arquivo excede 5MB: ${originalName}`);
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery", albumId);
  await mkdir(uploadDir, { recursive: true });

  const safeName = sanitizeFileName(originalName).replace(/\.[^.]+$/, "");
  const fileName = `${Date.now()}-${randomUUID()}-${safeName}.${extension}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/gallery/${albumId}/${fileName}`;
}

export async function saveGalleryPhotoFile(albumId: string, file: File) {
  if (!isAllowedImageFile(file)) {
    throw new Error(`Formato invalido: ${file.name}`);
  }
  return saveGalleryPhotoBuffer(albumId, Buffer.from(await file.arrayBuffer()), file.name, file.type);
}
