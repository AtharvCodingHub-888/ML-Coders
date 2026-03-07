const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'temp_clone', 'src', 'components', 'ui');
const destDir = path.join(__dirname, 'src', 'components', 'ui');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
});

fs.copyFileSync(
    path.join(__dirname, 'temp_clone', 'src', 'components', 'app_sidebar.tsx'),
    path.join(__dirname, 'src', 'components', 'app_sidebar.tsx')
);
fs.copyFileSync(
    path.join(__dirname, 'temp_clone', 'src', 'components', 'mode-toggle.tsx'),
    path.join(__dirname, 'src', 'components', 'mode-toggle.tsx')
);
console.log('Copy complete');
