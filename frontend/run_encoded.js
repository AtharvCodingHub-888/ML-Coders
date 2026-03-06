const { execSync } = require('child_process');
const cmd = 'npm install @floating-ui/react';
const buffer = Buffer.from(cmd, 'utf16le');
const base64 = buffer.toString('base64');
console.log('Running encoded command...');
try {
    const output = execSync(`powershell -EncodedCommand ${base64}`, { encoding: 'utf8' });
    console.log(output);
} catch (error) {
    console.error('Error:', error.message);
    if (error.stdout) console.log('stdout:', error.stdout);
    if (error.stderr) console.log('stderr:', error.stderr);
}
