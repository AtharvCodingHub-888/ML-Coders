const fs = require('fs');
const path = require('path');

const srcBase = 'd:/MY _PROJECTS/hackathon/final elearn ml/temp_clone/src';
const destBase = 'd:/MY _PROJECTS/hackathon/final elearn ml/src';

function deepCopy(s, d) {
    const stats = fs.statSync(s);
    if (stats.isDirectory()) {
        if (!fs.existsSync(d)) {
            fs.mkdirSync(d, { recursive: true });
        }
        fs.readdirSync(s).forEach(file => {
            deepCopy(path.join(s, file), path.join(d, file));
        });
    } else {
        const content = fs.readFileSync(s);
        fs.writeFileSync(d, content);
    }
}

try {
    ['components/animate-ui', 'hooks', 'lib'].forEach(folder => {
        const fullSrc = path.join(srcBase, folder);
        const fullDest = path.join(destBase, folder);
        if (fs.existsSync(fullSrc)) {
            console.log(`Copying ${folder}...`);
            deepCopy(fullSrc, fullDest);
        }
    });
    console.log('Success!');
} catch (e) {
    console.error(e);
}
