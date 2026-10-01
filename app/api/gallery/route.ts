import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Folders under /public/images that represent gallery albums.
// Add or remove folder names here as albums are added/retired —
// this list controls which folders the gallery looks for and in
// what order they're returned.
const ALBUM_FOLDERS = [
  "bmi",
  "emergency-preparedness",
  "meeting",
  "school-inspection",
  "senior-citizen-opening",
  "sayaw-kabataan-2026",
];

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export async function GET() {
  const imagesRoot = path.join(process.cwd(), "public", "images");

  const albums = ALBUM_FOLDERS.map((folder) => {
    const folderPath = path.join(imagesRoot, folder);

    let files: string[] = [];
    try {
      files = fs
        .readdirSync(folderPath)
        .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
        // Numeric-aware sort so 1,2,10 order correctly instead of 1,10,2
        .sort((a, b) => {
          const numA = parseInt(a, 10);
          const numB = parseInt(b, 10);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return a.localeCompare(b);
        });
    } catch {
      // Folder doesn't exist yet or isn't readable — treat as empty
      files = [];
    }

    return {
      folder,
      images: files.map((f) => `/images/${folder}/${f}`),
    };
  }).filter((album) => album.images.length > 0); // drop empty albums

  return NextResponse.json({ success: true, albums });
}