/**
 * Updates README with your live app URL. Run once after deploy.
 * Usage: node scripts/set-live-url.mjs https://your-app.vercel.app
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readmePath = path.join(__dirname, '..', 'README.md');
const url = process.argv[2];

if (!url || !url.startsWith('http')) {
  console.error('Usage: node scripts/set-live-url.mjs https://your-app.vercel.app');
  process.exit(1);
}

let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(
  /## Live app\n\n[\s\S]*?(?=\n## Screenshot)/,
  `## Live app\n\n**Live app:** ${url}\n\n`
);
fs.writeFileSync(readmePath, readme);
console.log('README updated with live URL:', url);
