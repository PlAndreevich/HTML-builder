const fs = require('fs').promises;
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');

// Создаем папку project-dist, если её нет
fs.mkdir(distPath, { recursive: true })
  .then(() => {
    // Читаем содержимое папки styles
    return fs.readdir(stylesPath);
  })
  .then((files) => {
    const styles = [];

    // Обходим все файлы папки styles
    return Promise.all(
      files.map((file) => {
        // Проверяем, что это файл с расширением .css
        if (path.extname(file) === '.css') {
          // Читаем файл стилей и добавляем его содержимое в массив styles
          return fs.readFile(path.join(stylesPath, file), 'utf-8')
            .then((styleContent) => {
              styles.push(styleContent);
            });
        }
      })
    ).then(() => {
      // Записываем все стили в единый файл bundle.css в папку project-dist
      return fs.writeFile(path.join(distPath, 'bundle.css'), styles.join('\n'), 'utf-8');
    });
  })
  