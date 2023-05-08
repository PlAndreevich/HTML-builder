const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Введите ваш текст:');

const writeStream = fs.createWriteStream('./02-write-file/text.txt', { flags: 'a' });

rl.on('line', (input) => {
  if (input === 'exit' || input === 'CTRL+C') {
    console.log('До новых встреч!');
    process.exit();
  } else {
    writeStream.write(input + '\n');
  }
});

if (process.platform === 'win32') {
    rl.on('SIGINT', () => {
      process.emit('SIGINT');
    });
}

process.on('SIGINT', () => {
    console.log('До новых встреч!');
    process.exit();
});
