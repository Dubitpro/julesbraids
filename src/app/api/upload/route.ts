import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (allFiles.length === 0) {
      return NextResponse.json({ success: false, error: "No files uploaded" }, { status: 400 });
    }

    const urls: string[] = [];

    // Optional Cloudinary upload check
    const hasCloudinary =
      process.env.CLOUDINARY_API_SECRET &&
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY &&
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (hasCloudinary) {
      try {
        const cloudinary = await import("cloudinary");
        cloudinary.v2.config({
          cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        for (const file of allFiles) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64 = buffer.toString("base64");
          const dataUri = `data:${file.type};base64,${base64}`;

          const result = await cloudinary.v2.uploader.upload(dataUri, {
            folder: "julesbraids/products",
          });
          urls.push(result.secure_url);
        }

        return NextResponse.json({ success: true, urls, url: urls[0] });
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to local storage:", cloudErr);
      }
    }

    // Local file storage / Base64 fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const file of allFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";
      const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadsDir, cleanName);

      try {
        fs.writeFileSync(filePath, buffer);
        urls.push(`/uploads/${cleanName}`);
      } catch {
        // In case filesystem write fails, use base64 data URI
        const base64 = buffer.toString("base64");
        urls.push(`data:${file.type || "image/jpeg"};base64,${base64}`);
      }
    }

    return NextResponse.json({ success: true, urls, url: urls[0] });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
