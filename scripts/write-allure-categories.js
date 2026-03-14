/**
 * Escribe allure-results/categories.json (sección Categories).
 * Tras patch-allure-broken-to-failed.js, solo los known failures quedan "broken"; el resto son "failed".
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const resultsDir = path.join(projectRoot, 'allure-results');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

const categories = [
  { name: 'Known failures', matchedStatuses: ['broken'], messageRegex: '.*Known failure.*' },
  { name: 'Product defects', matchedStatuses: ['failed'] },
  { name: 'Passed', matchedStatuses: ['passed'] },
  { name: 'Skipped', matchedStatuses: ['skipped'] },
  { name: 'Unknown', matchedStatuses: ['unknown'] },
];

fs.writeFileSync(path.join(resultsDir, 'categories.json'), JSON.stringify(categories, null, 2), 'utf8');
console.log('write-allure-categories: categories.json written');
