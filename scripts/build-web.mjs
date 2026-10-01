import { mkdir, copyFile } from 'node:fs/promises';

await mkdir('www', { recursive: true });
await Promise.all([
  copyFile('index.html', 'www/index.html'),
  copyFile('privacy.html', 'www/privacy.html')
]);
console.log('Prepared the Winter Arc web app for Android.');
