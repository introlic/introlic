import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/auth";

const WEBP_MAGIC = Buffer.from([0x52, 0x49, 0x46, 0x46]); // "RIFF"
const WEBP_MARKER = Buffer.from([0x57, 0x45, 0x42, 0x50]); // "WEBP"
const MAX_SIZE = 3 * 1024 * 1024; // 3 MB

function isWebP(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  // RIFF at bytes 0-3, WEBP at bytes 8-11
  return (
    buffer.subarray(0, 4).equals(WEBP_MAGIC) &&
    buffer.subarray(8, 12).equals(WEBP_MARKER)
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 3MB, received ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 413 }
      );
    }

    // Validate MIME type header
    if (file.type !== "image/webp") {
      return NextResponse.json(
        { error: "Only WebP images are accepted. Convert your image to WebP format first." },
        { status: 415 }
      );
    }

    // Read buffer and validate magic bytes (prevent spoofed MIME types)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!isWebP(buffer)) {
      return NextResponse.json(
        { error: "File is not a valid WebP image (magic bytes check failed)." },
        { status: 415 }
      );
    }

    // Generate unique filename with timestamp + random suffix
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `thumb_${timestamp}_${random}.webp`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/thumbnails/${filename}`;
    return NextResponse.json({ url: publicUrl, filename }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/upload/thumbnail]", err);
    return NextResponse.json({ error: "Failed to upload thumbnail" }, { status: 500 });
  }
}
