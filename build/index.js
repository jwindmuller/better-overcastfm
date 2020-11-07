const fs = require('fs');
const archive = require('node-zip')();
const files = [
    'icon16.png',
    'icon48.png',
    'icon128.png',
    'icon1024.png',
    'index.js',
    'styles.css',
    'manifest.json'
];

files.forEach(fileName => {
    archive.file(fileName, fs.readFileSync(fileName));
});

fs.writeFileSync(
    '../better-overcast.zip', 
    archive.generate({ base64: false, compression: 'DEFLATE' }), 
    'binary'
);