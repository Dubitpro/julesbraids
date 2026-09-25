import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No video file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Save untouched original video directly to public/hero-video.mp4
    const publicDir = path.join(process.cwd(), "public");
    const videoPath = path.join(publicDir, "hero-video.mp4");

    fs.writeFileSync(videoPath, buffer);

    return NextResponse.json({
      success: true,
      message: "Hero video uploaded successfully and set to autoplay.",
      url: `/hero-video.mp4?v=${Date.now()}`,
    });
  } catch (error: any) {
    console.error("Hero video upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload video" },
      { status: 500 }
    );
  }
}
