/**
 * Escribe allure-results/environment.properties (sección Environment del reporte).
 * Rutas showcase: allure-results/ en la raíz.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const resultsDir = path.join(projectRoot, 'allure-results');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

let javaVersion = 'unknown';
try {
  const out = execSync('java -version 2>&1', { encoding: 'utf8', maxBuffer: 1024 });
  const m = out.match(/version\s+"([^"]+)"/);
  if (m) javaVersion = m[1];
} catch (_) {}

const os = process.platform;   // win32, linux, darwin
const arch = process.arch;     // x64, arm64
const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';

const lines = [
  `Java.Version=${javaVersion}`,
  `OS=${os}`,
  `OS.Arch=${arch}`,
  `Base.URL=${baseUrl}`,
].join('\n');

fs.writeFileSync(path.join(resultsDir, 'environment.properties'), lines, 'utf8');
console.log('write-allure-env: environment.properties written');
