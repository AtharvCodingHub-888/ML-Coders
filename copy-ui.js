const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

try {
    console.log('Copying UI components...');
    copyRecursiveSync(path.join(__dirname, 'temp_clone', 'src', 'components', 'ui'), path.join(__dirname, 'src', 'components', 'ui'));
    console.log('Copying AppSidebar...');
    fs.copyFileSync(path.join(__dirname, 'temp_clone', 'src', 'components', 'app_sidebar.tsx'), path.join(__dirname, 'src', 'components', 'app_sidebar.tsx'));
    console.log('Copying mode toggle...');
    fs.copyFileSync(path.join(__dirname, 'temp_clone', 'src', 'components', 'mode-toggle.tsx'), path.join(__dirname, 'src', 'components', 'mode-toggle.tsx'));
    console.log('Copy successful.');
} catch (e) {
    console.error('Error copying:', e);
}
