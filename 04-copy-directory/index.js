const fs = require('fs').promises;
const path = require('path');

async function copyDir(srcDir, destDir) {
  try {
    await fs.mkdir(destDir);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
    // если папка files-copy уже существует, удаляем её содержимое    
    const files = await fs.readdir(destDir);
    for (const file of files) {
      const filePath = path.join(destDir, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        await fs.rmdir(filePath, { recursive: true });
      } else {
        await fs.unlink(filePath);
      }
    }
  }
  
  const files = await fs.readdir(srcDir);
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    const stats = await fs.stat(srcPath);
    if (stats.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

copyDir(srcDir, destDir);
