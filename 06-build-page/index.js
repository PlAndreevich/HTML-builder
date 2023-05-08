const fs = require('fs');
const path = require('path');
const { mergeStyles } = require('../05-merge-styles');
const { copyDirectory } = require('../04-copy-directory');

// путь до папки с проектом
const projectPath = path.join(__dirname, 'project-dist');

// создание папки project-dist, если она не существует
if (!fs.existsSync(projectPath)) {
  fs.mkdirSync(projectPath);
}

// чтение файла-шаблона
const templatePath = path.join(__dirname, 'template.html');
const template = fs.readFileSync(templatePath, 'utf-8');

// поиск всех шаблонных тегов в файле шаблона
const tagRegex = /{{(.+?)}}/g;
const tags = template.match(tagRegex);

// замена шаблонных тегов на содержимое файлов-компонентов
let indexHtml = template;
tags.forEach((tag) => {
  const componentName = tag.replace(/({{|}})/g, '');
  const componentPath = path.join(__dirname, 'components', componentName + '.html');
  if (fs.existsSync(componentPath)) {
    const component = fs.readFileSync(componentPath, 'utf-8');
    indexHtml = indexHtml.replace(tag, component);
  } else {
    throw new Error(`Component "${componentName}" not found`);
  }
});

// запись изменённого шаблона в файл index.html в папке project-dist
const indexPath = path.join(projectPath, 'index.html');
fs.writeFileSync(indexPath, indexHtml);

// создание файла style.css при помощи скрипта из задания 05-merge-styles
const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

fs.readdir(stylesPath, (err, files) => {
  if (err) throw err;

  const styles = [];

  files.forEach((file) => {
    if (path.extname(file) === '.css') {
      const styleContent = fs.readFileSync(path.join(stylesPath, file), 'utf-8');
      styles.push(styleContent);
    }
  });

  fs.writeFileSync(path.join(distPath, 'style.css'), styles.join('\n'), 'utf-8');
});

// копирование папки assets в папку project-dist при помощи скрипта из задания 04-copy-directory
function copyDir(srcDir, destDir) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir);
    } else {
      const files = fs.readdirSync(destDir);
      files.forEach(file => {
        const filePath = path.join(destDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          fs.rmdirSync(filePath, { recursive: true });
        } else {
          fs.unlinkSync(filePath);
        }
      });
    }    
    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      const stats = fs.statSync(srcPath);
      if (stats.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
}
const srcDir = path.join(__dirname, 'assets');
const destDir = path.join(projectPath, 'assets');
copyDir(srcDir, destDir);
