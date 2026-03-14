/**
 * Convierte status "broken" a "failed" en *-result.json cuando el mensaje NO contiene "Known failure".
 * Así, en Allure solo los fallos conocidos quedan como broken (categoría Known failures);
 * el resto de fallos se muestran siempre como Failed (Product defects).
 * Debe ejecutarse después de patch-allure-known-failures.js.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const resultsDir = path.join(projectRoot, 'allure-results');
if (!fs.existsSync(resultsDir)) {
  console.log('patch-allure-broken-to-failed: no allure-results, skipping');
  process.exit(0);
}

const KNOWN_FAILURE_MARKER = 'Known failure';
const files = fs.readdirSync(resultsDir).filter((f) => f.endsWith('-result.json'));
let patched = 0;

for (const file of files) {
  const filePath = path.join(resultsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (data.status !== 'broken') continue;
  const msg = (data.statusDetails && data.statusDetails.message) || '';
  if (msg.includes(KNOWN_FAILURE_MARKER)) continue;
  data.status = 'failed';
  if (!data.statusDetails) data.statusDetails = {};
  if (!data.statusDetails.message) data.statusDetails.message = 'Test failed (mapped from broken).';
  fs.writeFileSync(filePath, JSON.stringify(data, null, 0), 'utf8');
  patched++;
}

console.log('patch-allure-broken-to-failed: patched', patched, 'file(s)');
