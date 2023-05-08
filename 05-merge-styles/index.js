const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');

// Создаем папку project-dist, если её нет
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

// Читаем содержимое папки styles
fs.readdir(stylesPath, (err, files) => {
  if (err) throw err;

  const styles = [];

  // Обходим все файлы папки styles
  files.forEach((file) => {
    // Проверяем, что это файл с расширением .css
    if (path.extname(file) === '.css') {
      // Читаем файл стилей и добавляем его содержимое в массив styles
      const styleContent = fs.readFileSync(path.join(stylesPath, file), 'utf-8');
      styles.push(styleContent);
    }
  });

  // Записываем все стили в единый файл bundle.css в папку project-dist
  fs.writeFileSync(path.join(distPath, 'bundle.css'), styles.join('\n'), 'utf-8');
});
