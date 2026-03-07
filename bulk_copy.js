const fs = require('fs');
const path = require('path');

const projectRoot = 'd:/MY _PROJECTS/hackathon/final elearn ml';
const tempCloneRoot = path.join(projectRoot, 'temp_clone/src');

const dirsToCopy = ['components', 'hooks', 'lib'];

dirsToCopy.forEach(dir => {
    const src = path.join(tempCloneRoot, dir);
    const dest = path.join(projectRoot, 'src', dir);

    if (fs.existsSync(src)) {
        console.log(`Copying ${dir}...`);
        fs.cpSync(src, dest, { recursive: true });
    } else {
        console.error(`Source directory not found: ${src}`);
    }
});

console.log('Copy complete');
