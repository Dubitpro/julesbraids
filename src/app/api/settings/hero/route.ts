import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Save untouched original directly to public/hero-desktop.jpg and public/mmm.jpg
    const publicDir = path.join(process.cwd(), "public");
    const heroDesktopPath = path.join(publicDir, "hero-desktop.jpg");
    const mmmPath = path.join(publicDir, "mmm.jpg");

    fs.writeFileSync(heroDesktopPath, buffer);
    fs.writeFileSync(mmmPath, buffer);

    return NextResponse.json({
      success: true,
      message: "Original image uploaded with 100% fidelity (no AI modification).",
      url: `/hero-desktop.jpg?t=${Date.now()}`,
    });
  } catch (error: any) {
    console.error("Hero upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
