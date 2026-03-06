const { spawnSync } = require('child_process');

try {
    console.log('Installing dependencies via spawnSync...');
    const result = spawnSync(
        'npm.cmd',
        ['install', '@floating-ui/react', 'next-themes', '@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-separator', '@radix-ui/react-tooltip', '@radix-ui/react-avatar', 'lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
        { encoding: 'utf8' }
    );
    if (result.error) {
        throw result.error;
    }
    console.log('Successfully installed dependencies.');
    console.log(result.stdout);
    console.log(result.stderr);
} catch (error) {
    console.error('Failed to install dependencies:', error.message);
    process.exit(1);
}
