/**
 * Prepara allure-results antes de generar el reporte:
 * 1) copy history, 2) env, 3) executor, 4) categories, 5) patch known failures,
 * 6) patch broken→failed (no known failure), 7) patch passed message.
 * Luego se debe ejecutar: mvn allure:report (Maven) o allure generate (showcase).
 */
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const scripts = [
  'copy-allure-history.js',
  'write-allure-env.js',
  'write-allure-executor.js',
  'write-allure-categories.js',
  'patch-allure-known-failures.js',
  'patch-allure-broken-to-failed.js',
  'patch-allure-passed-message.js',
];

for (const script of scripts) {
  require(path.join(projectRoot, 'scripts', script));
}
