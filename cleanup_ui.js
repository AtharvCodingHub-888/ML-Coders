const fs = require('fs');
const path = require('path');

const base = 'd:\\MY _PROJECTS\\hackathon\\final elearn ml\\src\\components';

const targets = [
    path.join(base, 'animate-ui'),
    path.join(base, 'app_sidebar.tsx'),
    path.join(base, 'mode-toggle.tsx'),
    path.join(base, 'theme-provider.tsx')
];

targets.forEach(target => {
    try {
        if (fs.existsSync(target)) {
            const stats = fs.statSync(target);
            if (stats.isDirectory()) {
                fs.rmSync(target, { recursive: true, force: true });
                console.log(`Deleted directory: ${target}`);
            } else {
                fs.unlinkSync(target);
                console.log(`Deleted file: ${target}`);
            }
        } else {
            console.log(`Target does not exist: ${target}`);
        }
    } catch (error) {
        console.error(`Error deleting ${target}:`, error.message);
    }
});
