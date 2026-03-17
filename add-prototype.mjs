#!/usr/bin/env node
/**
 * Intelligence Lab — Add Prototype
 * Usage: node add-prototype.mjs <path-to-html-file> "Prototype Title" [status]
 * Status options: exploring | push | shipped | archived (default: exploring)
 *
 * Example:
 *   node add-prototype.mjs ~/Downloads/rank-scout-prototype.html "Scout Rankings Radar" exploring
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Args ──────────────────────────────────────────────────────────────────────
const [,, srcFile, title, status = 'exploring'] = process.argv;

if (!srcFile || !title) {
  console.error('\n❌  Usage: node add-prototype.mjs <path-to-html-file> "Title" [status]\n');
  process.exit(1);
}

if (!['exploring', 'push', 'shipped', 'archived'].includes(status)) {
  console.error(`\n❌  Status must be one of: exploring | push | shipped | archived\n`);
  process.exit(1);
}

// ── Derive ID from filename ───────────────────────────────────────────────────
const filename = path.basename(srcFile);
const id = filename.replace(/\.html$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

// ── Paths ─────────────────────────────────────────────────────────────────────
const destDir = path.join(__dirname, 'public', 'prototypes');
const destFile = path.join(destDir, filename);
const galleryPath = path.join(__dirname, 'src', 'Gallery.jsx');

// ── Copy HTML file ────────────────────────────────────────────────────────────
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

if (!fs.existsSync(srcFile)) {
  console.error(`\n❌  File not found: ${srcFile}\n`);
  process.exit(1);
}

fs.copyFileSync(srcFile, destFile);
console.log(`✅  Copied → public/prototypes/${filename}`);

// ── Build the registry entry ──────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];

const entry = `  {
    id: '${id}',
    title: '${title.replace(/'/g, "\\'")}',
    description: '',
    status: '${status}',
    date: '${today}',
    tags: [],
    dataEndpoints: [],
    keyInsight: '',
    href: './prototypes/${filename}'
  },`;

// ── Update Gallery.jsx ────────────────────────────────────────────────────────
if (!fs.existsSync(galleryPath)) {
  console.error(`\n❌  Could not find src/Gallery.jsx — are you running this from your intelligence-lab folder?\n`);
  process.exit(1);
}

let gallery = fs.readFileSync(galleryPath, 'utf8');

// Check if already exists
if (gallery.includes(`id: '${id}'`)) {
  console.log(`⚠️   Prototype '${id}' already exists in Gallery.jsx — skipping registry update.`);
} else {
  const marker = '// END_PROTOTYPES';
  if (gallery.includes(marker)) {
    gallery = gallery.replace(marker, `${entry}\n  ${marker}`);
  } else {
    const arrayEnd = gallery.lastIndexOf('\n];');
    if (arrayEnd === -1) {
      console.error('\n❌  Could not find the end of the PROTOTYPES array in Gallery.jsx.');
      console.error('    Add this comment on its own line just before the closing ]; of your PROTOTYPES array:');
      console.error('    // END_PROTOTYPES\n');
      process.exit(1);
    }
    gallery = gallery.slice(0, arrayEnd) + '\n' + entry + gallery.slice(arrayEnd);
  }

  fs.writeFileSync(galleryPath, gallery);
  console.log(`✅  Added '${title}' to Gallery.jsx`);
}

// ── Git commit & push ─────────────────────────────────────────────────────────
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "Add prototype: ${title}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log(`\n🚀  Pushed! Your prototype will be live in ~1 minute at:`);
  console.log(`    https://benq-hudl.github.io/intelligence-lab/\n`);
} catch (err) {
  console.error('\n⚠️   Git push failed — your files are updated locally, just push manually:\n');
  console.error('    git add . && git commit -m "Add prototype" && git push\n');
}
