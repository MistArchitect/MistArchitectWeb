import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const targets = [
  {
    dir: "public/images/home",
    match: /\.(jpe?g)$/i,
    width: 1800,
    quality: 82
  },
  {
    dir: "public/images/about",
    files: ["about-1.jpeg", "about-2.jpeg", "about-3.jpeg"],
    width: 2400,
    quality: 82
  },
  {
    dir: "public/images/about",
    files: ["founders.jpeg"],
    width: 1800,
    quality: 84
  },
  {
    dir: "public/images/LOGO",
    files: ["logo.png"],
    width: 1800,
    png: true
  }
];

async function listTargetFiles(target) {
  const dir = path.join(root, target.dir);
  const entries = await fs.readdir(dir);

  return entries
    .filter((entry) => {
      if (target.files) {
        return target.files.includes(entry);
      }

      return target.match?.test(entry);
    })
    .map((entry) => path.join(dir, entry));
}

async function formatBytes(bytes) {
  if (bytes > 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  return `${Math.round(bytes / 1024)} KB`;
}

async function optimizeImage(file, target) {
  const original = await fs.stat(file);
  const source = sharp(file, { limitInputPixels: false }).rotate();
  const metadata = await source.metadata();
  const resizeWidth = metadata.width && metadata.width > target.width ? target.width : metadata.width;

  let pipeline = source.resize({
    width: resizeWidth,
    withoutEnlargement: true
  });

  if (target.png) {
    pipeline = pipeline.png({
      adaptiveFiltering: true,
      compressionLevel: 9,
      effort: 10,
      palette: true
    });
  } else {
    pipeline = pipeline.jpeg({
      mozjpeg: true,
      progressive: true,
      quality: target.quality
    });
  }

  const tempFile = `${file}.optimized`;
  await pipeline.toFile(tempFile);
  await fs.rename(tempFile, file);

  const optimized = await fs.stat(file);
  const saved = original.size - optimized.size;

  return {
    file: path.relative(root, file),
    before: original.size,
    after: optimized.size,
    saved
  };
}

const results = [];

for (const target of targets) {
  const files = await listTargetFiles(target);
  for (const file of files) {
    results.push(await optimizeImage(file, target));
  }
}

let beforeTotal = 0;
let afterTotal = 0;

for (const result of results) {
  beforeTotal += result.before;
  afterTotal += result.after;
  console.log(
    `${result.file}: ${await formatBytes(result.before)} -> ${await formatBytes(result.after)}`
  );
}

console.log(`Total: ${await formatBytes(beforeTotal)} -> ${await formatBytes(afterTotal)}`);
