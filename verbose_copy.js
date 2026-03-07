const fs = require('fs');
const path = require('path');

const src = 'd:/MY _PROJECTS/hackathon/final elearn ml/temp_clone/src';
const dest = 'd:/MY _PROJECTS/hackathon/final elearn ml/src';

function copyRecursive(s, d) {
    if (fs.statSync(s).isDirectory()) {
        if (!fs.existsSync(d)) {
            fs.mkdirSync(d, { recursive: true });
        }
        fs.readdirSync(s).forEach(file => {
            copyRecursive(path.join(s, file), path.join(d, file));
        });
    } else {
        fs.copyFileSync(s, d);
        console.log(`Copied: ${d.replace(dest, '')}`);
    }
}

['components', 'hooks', 'lib'].forEach(dir => {
    const s = path.join(src, dir);
    const d = path.join(dest, dir);
    if (fs.existsSync(s)) {
        console.log(`Starting copy for ${dir}...`);
        copyRecursive(s, d);
    }
});
console.log('Done!');
