const fs = require('fs');
const path = require('path');

const src = path.resolve('landing front page', '.vercel', 'output');
const dest = path.resolve('.vercel', 'output');

if (fs.existsSync(src)) {
  fs.cpSync(src, dest, { recursive: true });
  console.log('Successfully copied ' + src + ' to ' + dest);
} else {
  console.error('Source directory not found: ' + src);
}

