import AdmZip from "adm-zip";

import {
  MAX_PHOTOS_PER_UPLOAD,
  MAX_ZIP_SIZE_BYTES,
  saveGalleryPhotoBuffer,
} from "./uploads";

export async function extractPhotosFromZip(albumId: string, zipFile: File) {
  if (zipFile.size <= 0 || zipFile.size > MAX_ZIP_SIZE_BYTES) {
    throw new Error("ZIP excede o limite de 100MB.");
  }

  const buffer = Buffer.from(await zipFile.arrayBuffer());
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries().filter((entry) => !entry.isDirectory);

  const imageEntries = entries.filter((entry) => {
    const name = entry.entryName.toLowerCase();
    return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp");
  });

  if (imageEntries.length === 0) {
    throw new Error("Nenhuma imagem valida encontrada no ZIP.");
  }

  if (imageEntries.length > MAX_PHOTOS_PER_UPLOAD) {
    throw new Error(`O ZIP contem mais de ${MAX_PHOTOS_PER_UPLOAD} imagens.`);
  }

  const saved: string[] = [];

  for (const entry of imageEntries) {
    if (entry.entryName.includes("..")) continue;

    const fileName = entry.entryName.split("/").pop() ?? entry.entryName;
    const src = await saveGalleryPhotoBuffer(albumId, entry.getData(), fileName);
    saved.push(src);
  }

  if (saved.length === 0) {
    throw new Error("Nao foi possivel extrair imagens do ZIP.");
  }

  return saved;
}
