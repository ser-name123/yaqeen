import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create safe filename
    const ext = path.extname(file.name || ".png") || ".png";
    const baseName = path.basename(file.name || "image", ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueName = `${baseName}_${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "landing");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/landing/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to upload file" }, { status: 500 });
  }
}
