const fs = require('fs');
const path = require('path');

const srcDir = 'd:/MY _PROJECTS/hackathon/final elearn ml/temp_clone/src/components/ui';
const destDir = 'd:/MY _PROJECTS/hackathon/final elearn ml/src/components/ui';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied ${file}`);
    }
});
