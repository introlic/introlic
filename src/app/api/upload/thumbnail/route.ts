import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getAdminSession } from "@/lib/auth";

// Support up to 20MB source image uploads (sharp will compress it down to <200KB)
const MAX_SOURCE_SIZE = 20 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/tiff",
]);

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    // Accept "thumbnail", "file", or "image" field names
    const file = (formData.get("thumbnail") || formData.get("file") || formData.get("image")) as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate maximum upload size
    if (file.size > MAX_SOURCE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum upload size is 20MB, received ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 413 }
      );
    }

    // Basic MIME or extension validation
    const mimeType = file.type?.toLowerCase() || "";
    const isAllowedMime = ALLOWED_MIME_TYPES.has(mimeType);
    const hasImageExt = /\.(jpg|jpeg|png|webp|gif|svg|avif|bmp|tiff)$/i.test(file.name);

    if (!isAllowedMime && !hasImageExt) {
      return NextResponse.json(
        { error: `Unsupported image format (${file.type || "unknown"}). Supported: PNG, JPG, WebP, GIF, SVG, AVIF, BMP, TIFF.` },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Target upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);

    // If SVG format: preserve vector format
    if (mimeType === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      const filename = `svg_${timestamp}_${random}.svg`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, inputBuffer);

      const publicUrl = `/uploads/thumbnails/${filename}`;
      return NextResponse.json({
        url: publicUrl,
        filename,
        originalSize: file.size,
        optimizedSize: inputBuffer.length,
        savingsPercent: 0,
        format: "svg",
      }, { status: 201 });
    }

    // Raster Image Processing & Optimization via Sharp
    // 1. Auto-rotate based on EXIF orientation (fixes mobile upload rotation)
    // 2. Cap dimensions at max 2048px (maintains high-res sharpness, removes waste)
    // 3. Compress to WebP with smart chroma subsampling & quality 85
    // 4. Strip EXIF/metadata for privacy and size reduction
    const imagePipeline = sharp(inputBuffer)
      .rotate() // Auto-orient
      .resize({
        width: 2048,
        height: 2048,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
        effort: 6, // High compression effort
        smartSubsample: true,
      });

    const optimizedBuffer = await imagePipeline.toBuffer();
    const metadata = await sharp(optimizedBuffer).metadata();

    const filename = `thumb_${timestamp}_${random}.webp`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, optimizedBuffer);

    const originalSize = file.size;
    const optimizedSize = optimizedBuffer.length;
    const savingsPercent = originalSize > 0 
      ? Math.max(0, parseFloat((((originalSize - optimizedSize) / originalSize) * 100).toFixed(1)))
      : 0;

    const publicUrl = `/uploads/thumbnails/${filename}`;

    return NextResponse.json({
      url: publicUrl,
      filename,
      originalSize,
      optimizedSize,
      savingsPercent,
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: "webp",
    }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/upload/thumbnail]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process and optimize image" },
      { status: 500 }
    );
  }
}
