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

/**
 * Otimiza MP4 mantendo resolução e FPS originais, removendo áudio
 * e usando CRF baixo para preservar qualidade.
 * - CRF 23 é um ótimo ponto de partida (quanto menor, mais qualidade).
 * - preset "slow" melhora compressão sem piorar a imagem (mais lento).
 * - yuv420p e +faststart para compatibilidade e web.
 * 
 * Defina USE_HEVC=1 para usar HEVC (libx265) — menor tamanho, compatibilidade menor.
 */
function optimizeMP4(filePath, outPath) {
  return new Promise((resolve, reject) => {
    const useHevc = process.env.USE_HEVC === "1";
    const vcodec = useHevc ? "libx265" : "libx264";
    const extra = useHevc ? "-x265-params log-level=error" : "-tune film";

    const command = `
      ffmpeg -hide_banner -loglevel error -y \
      -i "${filePath}" \
      -an -sn -map_metadata -1 \
      -c:v ${vcodec} -crf 23 -preset slow ${extra} \
      -pix_fmt yuv420p -movflags +faststart \
      "${outPath}"
    `;

    exec(command, (err) => {
      if (err) {
        console.error(`❌ Erro otimizando ${filePath}:`, err);
        reject(err);
      } else {
        console.log(`🎬 MP4 otimizado (sem áudio, alta qualidade): ${path.basename(filePath)}`);
        resolve();
      }
    });
  });
}

async function optimizeFolder(dir = inputDir) {
  await fs.ensureDir(outputDir);
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const file = entry.name;
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
