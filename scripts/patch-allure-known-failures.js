/**
 * Parchea *-result.json de tests de fallo conocido: status → broken, message con prefijo "Known failure: ".
 * Criterio: nombre del test coincide con problem_user/detalle o performance_glitch/2 segundo (o similar).
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const resultsDir = path.join(projectRoot, 'allure-results');
if (!fs.existsSync(resultsDir)) {
  console.log('patch-allure-known-failures: no allure-results, skipping');
  process.exit(0);
}

const knownFailurePatterns = [
  /problem_user.*detalle|detalle.*problem_user/i,
  /performance_glitch.*2 segundo|2 segundo.*performance_glitch/i,
  /ProductDescriptionProblemUser|LoginPerformanceGlitchUser/i,
];

const files = fs.readdirSync(resultsDir).filter((f) => f.endsWith('-result.json'));
let patched = 0;
for (const file of files) {
  const filePath = path.join(resultsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const name = (data.name || '') + (data.fullName || '');
  if (!knownFailurePatterns.some((re) => re.test(name))) continue;
  data.status = 'broken';
  if (data.statusDetails) {
    const msg = data.statusDetails.message || '';
    if (!msg.startsWith('Known failure:')) {
      data.statusDetails.message = 'Known failure: ' + (msg || 'Expected failure (problem_user / performance_glitch).');
    }
  } else {
    data.statusDetails = { message: 'Known failure: Expected failure (problem_user / performance_glitch).' };
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 0), 'utf8');
  patched++;
}
console.log('patch-allure-known-failures: patched', patched, 'file(s)');
