const fs = require('fs');
const path = require('path');

const srcBase = 'd:\\MY _PROJECTS\\hackathon\\final elearn ml\\temp_clone\\src\\components';
const destBase = 'd:\\MY _PROJECTS\\hackathon\\final elearn ml\\src\\components';

function copyFiles(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
        console.log(`Created directory: ${dest}`);
    }

    const items = fs.readdirSync(src);
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);

        if (fs.statSync(srcPath).isDirectory()) {
            copyFiles(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${item}`);
        }
    });
}

try {
    // Copy the entire ui directory
    copyFiles(path.join(srcBase, 'ui'), path.join(destBase, 'ui'));

    // Copy specific files if they are not in ui but in components
    const filesToCopy = ['app_sidebar.tsx', 'mode-toggle.tsx'];
    filesToCopy.forEach(file => {
        const srcFile = path.join(srcBase, file);
        const destFile = path.join(destBase, file);
        if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, destFile);
            console.log(`Copied: ${file}`);
        } else {
            console.warn(`Source file not found: ${srcFile}`);
        }
    });
    console.log('Finished copying components.');
} catch (err) {
    console.error('Error during copy:', err);
    process.exit(1);
}
