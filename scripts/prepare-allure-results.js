#!/usr/bin/env node
/**
 * Copia categories.json, executor.json y environment.properties desde
 * .github/allure-config/ a allure-results/ si no existen.
 * Ejecutar antes de "report:generate" si tu carpeta allure-results no los trae (p. ej. solo copiaste *-result.json).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const configDir = path.join(root, '.github', 'allure-config');
const resultsDir = path.join(root, 'allure-results');

const files = ['categories.json', 'executor.json', 'environment.properties'];

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
  console.log('Created allure-results/');
}

for (const file of files) {
  const src = path.join(configDir, file);
  const dest = path.join(resultsDir, file);
  if (!fs.existsSync(src)) continue;
  if (fs.existsSync(dest)) {
    console.log(`Skipped (already present): ${file}`);
  } else {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file}`);
  }
}

console.log('allure-results ready for report:generate.');
