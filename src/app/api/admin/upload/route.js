import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary belum dikonfigurasi di file environment (.env). Silakan gunakan input URL gambar langsung.",
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan dalam permintaan." },
        { status: 400 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "gamen-store/products";

    // Generate SHA-1 signature
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("api_key", apiKey);
    uploadData.append("timestamp", timestamp.toString());
    uploadData.append("signature", signature);
    uploadData.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await uploadRes.json();

    if (!uploadRes.ok) {
      return NextResponse.json(
        { success: false, error: result.error?.message || "Gagal mengunggah ke Cloudinary." },
        { status: uploadRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url || result.url,
        publicId: result.public_id,
        format: result.format,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
