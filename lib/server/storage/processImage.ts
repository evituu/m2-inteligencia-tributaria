import sharp from "sharp";

export async function processImage(
  buffer: Buffer,
): Promise<{ buffer: Buffer; mimeType: "image/webp" }> {
  const converted = await sharp(buffer).webp({ quality: 85 }).toBuffer();
  return { buffer: converted, mimeType: "image/webp" };
}
