/**
 * Copia allure-report/history → allure-results/history para Trend y Graphs.
 * Origen: target/site/allure-maven-plugin/history (Maven) o allure-report/history (showcase).
 * Destino: target/allure-results/history (Maven) o allure-results/history (showcase).
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const reportHistory = path.join(projectRoot, 'allure-report', 'history');
const resultsHistory = path.join(projectRoot, 'allure-results', 'history');

if (!fs.existsSync(reportHistory)) {
  console.log('copy-allure-history: no previous report history found, skipping');
  process.exit(0);
}

if (!fs.existsSync(path.join(projectRoot, 'allure-results'))) {
  fs.mkdirSync(path.join(projectRoot, 'allure-results'), { recursive: true });
}
if (!fs.existsSync(resultsHistory)) {
  fs.mkdirSync(resultsHistory, { recursive: true });
}
const files = fs.readdirSync(reportHistory);
for (const file of files) {
  fs.copyFileSync(path.join(reportHistory, file), path.join(resultsHistory, file));
}
console.log('copy-allure-history: copied', files.length, 'history file(s)');
