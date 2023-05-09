const fs = require('fs');
const path = require('path');

// путь до папки с проектом
const projectPath = path.join(__dirname, 'project-dist');

// создание папки project-dist, если она не существует
if (!fs.existsSync(projectPath)) {
  fs.mkdirSync(projectPath);
}

// чтение файла-шаблона
const templatePath = path.join(__dirname, 'template.html');
fs.promises.readFile(templatePath, 'utf-8')
  .then((template) => {
    // поиск всех шаблонных тегов в файле шаблона
    const tagRegex = /{{(.+?)}}/g;
    const tags = template.match(tagRegex);

    // замена шаблонных тегов на содержимое файлов-компонентов
    let indexHtml = template;
    const componentPromises = tags.map((tag) => {
      const componentName = tag.replace(/({{|}})/g, '');
      const componentPath = path.join(__dirname, 'components', componentName + '.html');
      return fs.promises.readFile(componentPath, 'utf-8')
        .then((component) => {
          indexHtml = indexHtml.replace(tag, component);
        })
        .catch((err) => {
          throw new Error(`Component "${componentName}" not found`);
        });
    });
    Promise.all(componentPromises)
      .then(() => {
        // запись изменённого шаблона в файл index.html в папке project-dist
        const indexPath = path.join(projectPath, 'index.html');
        return fs.promises.writeFile(indexPath, indexHtml);
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });

// создание файла style.css при помощи скрипта из задания 05-merge-styles
const fs2 = require('fs').promises;

const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');

// Проверяем, существует ли папка project-dist
fs2.access(distPath)
  .catch(() => {
    // Если папки project-dist не существует, создаем ее
    return fs2.mkdir(distPath);
  })
  .then(() => {
    // Читаем содержимое папки styles
    return fs2.readdir(stylesPath);
  })
  .then((files) => {
    const styles = [];

    // Обходим все файлы папки styles
    return Promise.all(
      files.map((file) => {
        // Проверяем, что это файл с расширением .css
        if (path.extname(file) === '.css') {
          // Читаем файл стилей и добавляем его содержимое в массив styles
          return fs2.readFile(path.join(stylesPath, file), 'utf-8')
            .then((styleContent) => {
              styles.push(styleContent);
            });
        }
      })
    ).then(() => {
      // Записываем все стили в единый файл bundle.css в папку project-dist
      return fs2.writeFile(path.join(distPath, 'style.css'), styles.join('\n'), 'utf-8');
    });
  })
  .catch((err) => {
    console.error(err);
  });

// копирование папки assets в папку project-dist при помощи скрипта из задания 04-copy-directory
async function copyDir(srcDir, destDir) {
  try {
    await fs2.mkdir(destDir);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
    // если папка files-copy уже существует, удаляем её содержимое    
    const files = await fs2.readdir(destDir);
    for (const file of files) {
      const filePath = path.join(destDir, file);
      const stats = await fs2.stat(filePath);
      if (stats.isDirectory()) {
        await fs2.rmdir(filePath, { recursive: true });
      } else {
        await fs2.unlink(filePath);
      }
    }
  }
  
  const files = await fs2.readdir(srcDir);
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    const stats = await fs2.stat(srcPath);
    if (stats.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs2.copyFile(srcPath, destPath);
    }
  }
}

const srcDir = path.join(__dirname, 'assets');
const destDir = path.join(projectPath, 'assets');
copyDir(srcDir, destDir);
