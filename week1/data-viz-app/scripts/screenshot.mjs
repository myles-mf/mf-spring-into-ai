/**
 * Captures a screenshot of the app. Run after "npm run preview" (or with defaultUrl).
 * Usage: npm run screenshot   (assumes preview at http://localhost:4173)
 *    or: node scripts/screenshot.mjs http://localhost:5173
 */
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultUrl = 'http://localhost:4173';
const url = process.argv[2] || defaultUrl;
const outDir = path.join(__dirname, '..', 'screenshots');
const outPath = path.join(outDir, 'app.png');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath });
await browser.close();

console.log('Screenshot saved to', outPath);
