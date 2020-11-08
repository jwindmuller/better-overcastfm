const fs = require('fs');
const { argv } = require('process');
const archive = require('node-zip')();
const semver = require('semver');
const simpleGit = require('simple-git');
const files = [
    'icon16.png',
    'icon48.png',
    'icon128.png',
    'icon1024.png',
    'index.js',
    'styles.css',
    'manifest.json'
];

let manifest = JSON.parse(fs.readFileSync('manifest.json'));
let version = semver.parse(manifest.version);
version = version.inc(argv[2] || 'patch').format();
manifest.version = version;
fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 4) + '\n');

let package = JSON.parse(fs.readFileSync('package.json'));
package.version = version;
fs.writeFileSync('package.json', JSON.stringify(package, null, 4));

files.forEach(fileName => {
    archive.file(fileName, fs.readFileSync(fileName) + '\n');
});

const zipFilePath = '../better-overcast.zip';
fs.writeFileSync(
    zipFilePath,
    archive.generate({ base64: false, compression: 'DEFLATE' }),
    'binary'
);
console.log(`Generated ${process.cwd()}${zipFilePath}`);

const doGit = async (version) => {
    const git = simpleGit();

    version = `v${version}`
    await git.add('.');
    await git.commit(version);
    await git.addTag(version);
    await git.push();
    await git.pushTags();
};
doGit(version);
