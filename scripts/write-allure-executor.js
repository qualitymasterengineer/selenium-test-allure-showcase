/**
 * Escribe allure-results/executor.json (sección Executors del reporte).
 * GitHub Actions: name, buildUrl, etc. Local: nombre y timestamp.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const resultsDir = path.join(projectRoot, 'allure-results');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

const isGh = process.env.GITHUB_ACTIONS === 'true';
const now = new Date();
const reportName = `Run #${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toTimeString().slice(0, 8)}`;

let executor;
if (isGh) {
  const runNumber = process.env.GITHUB_RUN_NUMBER || '0';
  const runId = process.env.GITHUB_RUN_ID || '';
  const repo = process.env.GITHUB_REPOSITORY || '';
  const server = process.env.GITHUB_SERVER_URL || 'https://github.com';
  const buildUrl = `${server}/${repo}/actions/runs/${runId}`;
  const workflow = process.env.GITHUB_WORKFLOW || 'Selenium E2E';
  executor = {
    name: 'GitHub Actions',
    type: 'github',
    buildName: workflow,
    buildOrder: parseInt(runNumber, 10) || 0,
    buildUrl,
    reportName: `Run #${runNumber}`,
  };
} else {
  const buildName = `Local ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toTimeString().slice(0, 8)}`;
  executor = {
    name: 'Selenium Local',
    type: 'local',
    buildName,
    buildOrder: now.getTime(),
    reportName,
  };
}

fs.writeFileSync(path.join(resultsDir, 'executor.json'), JSON.stringify(executor, null, 2), 'utf8');
console.log('write-allure-executor: executor.json written');
