const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const assetsDirectory = path.resolve(__dirname, '..', 'assets');

async function optimizePng(fileName) {
  const inputPath = path.join(assetsDirectory, fileName);
  const temporaryPath = `${inputPath}.optimized.png`;
  const before = await fs.stat(inputPath);
  const originalMetadata = await sharp(inputPath).metadata();

  await sharp(inputPath)
    .png({
      compressionLevel: 9,
      effort: 10,
      palette: true,
      colours: 256,
      dither: 0.35,
    })
    .toFile(temporaryPath);

  const optimizedMetadata = await sharp(temporaryPath).metadata();
  const after = await fs.stat(temporaryPath);
  const dimensionsMatch = originalMetadata.width === optimizedMetadata.width
    && originalMetadata.height === optimizedMetadata.height;

  if (dimensionsMatch && after.size < before.size) {
    await fs.copyFile(temporaryPath, inputPath);
    await fs.unlink(temporaryPath);
    return { fileName, before: before.size, after: after.size };
  }

  await fs.unlink(temporaryPath);
  return { fileName, before: before.size, after: before.size };
}

async function main() {
  const files = (await fs.readdir(assetsDirectory)).filter((file) => file.endsWith('.png'));
  const results = [];
  for (const file of files) results.push(await optimizePng(file));

  const before = results.reduce((sum, result) => sum + result.before, 0);
  const after = results.reduce((sum, result) => sum + result.after, 0);
  results.forEach((result) => {
    const saved = result.before - result.after;
    console.log(`${result.fileName}: ${result.before} → ${result.after} bytes (${saved} saved)`);
  });
  console.log(`Total: ${before} → ${after} bytes (${before - after} saved)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
