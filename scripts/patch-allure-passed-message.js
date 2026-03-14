/**
 * Asigna mensaje por defecto a tests passed con mensaje vacío para evitar "<Empty>" en Categories.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const resultsDir = path.join(projectRoot, 'allure-results');
if (!fs.existsSync(resultsDir)) {
  console.log('patch-allure-passed-message: no allure-results, skipping');
  process.exit(0);
}

const defaultMessage = 'Expected successful result';
const files = fs.readdirSync(resultsDir).filter((f) => f.endsWith('-result.json'));
let patched = 0;
for (const file of files) {
  const filePath = path.join(resultsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (data.status !== 'passed') continue;
  const msg = (data.statusDetails && data.statusDetails.message) || '';
  if (msg.trim() === '') {
    if (!data.statusDetails) data.statusDetails = {};
    data.statusDetails.message = defaultMessage;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 0), 'utf8');
    patched++;
  }
}
console.log('patch-allure-passed-message: patched', patched, 'file(s)');
