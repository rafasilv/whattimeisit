import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { exec } from "child_process";

const inputDir = ".";             // Pasta de origem
const outputDir = "./otimizados"; // Pasta de saída

async function optimizePNG(filePath, outPath) {
  try {
    await sharp(filePath)
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outPath);
    console.log(`✅ PNG otimizado: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`❌ Erro otimizando ${filePath}:`, err);
  }
}

function optimizeMP4(filePath, outPath) {
  return new Promise((resolve, reject) => {
    // Compressão extrema tipo GIF (sem som)
    const command = `
      ffmpeg -i "${filePath}" \
      -an \
      -vf "scale=iw/2:ih/2,fps=15" \
      -vcodec libx264 -crf 35 -preset veryfast \
      -movflags +faststart \
      "${outPath}" -y
    `;

    exec(command, (err) => {
      if (err) {
        console.error(`❌ Erro otimizando ${filePath}:`, err);
        reject(err);
      } else {
        console.log(`🎬 MP4 otimizado (leve): ${path.basename(filePath)}`);
        resolve();
      }
    });
  });
}

async function optimizeFolder(dir = inputDir) {
  await fs.ensureDir(outputDir);
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const outPath = path.join(outputDir, file);
    const ext = path.extname(file).toLowerCase();

    if (ext === ".png") {
      await optimizePNG(filePath, outPath);
    } else if (ext === ".mp4") {
      await optimizeMP4(filePath, outPath);
    }
  }

  console.log("🚀 Otimização concluída!");
}

optimizeFolder();
