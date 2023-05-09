const fs = require('fs/promises');
const path = require('path');

async function main() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const stat = await fs.stat(filePath);
        const fileSizeInBytes = stat.size;
        const fileSizeInKB = fileSizeInBytes / 1024;
        const fileSizeFormatted = `${fileSizeInKB.toFixed(3)}kb`;
        const fileExtension = path.extname(filePath).substring(1);
        const fileName = path.basename(filePath, path.extname(filePath));
        console.log(`${fileName} - ${fileExtension} - ${fileSizeFormatted}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

main();
