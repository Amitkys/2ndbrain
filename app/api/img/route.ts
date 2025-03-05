import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG and WebP are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "2ndbrain", // Updated folder name
            allowed_formats: ["jpg", "png", "webp"],
            transformation: {
              width: 1000,
              height: 1000,
              crop: "limit",
              quality: "auto",
            },
          },
          (error, result) => {
            if (error) {
              reject(error);

              return;
            }
            resolve(result);
          },
        )
        .end(buffer);
    });

    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in image upload:", error);

    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 },
    );
  }
}

// Optional: Set the maximum file size
export const config = {
  api: {
    bodyParser: false,
  },
};