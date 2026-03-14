/**
 * Parche para la sección Executors en el reporte Allure (proyecto showcase).
 * Versión adaptada para ejecutarse tras "allure generate": usa REPORT_DIR y no depende de pom.xml.
 *
 * Uso: REPORT_DIR=allure-report node patch-allure-selenium-logo.js
 * O:   node patch-allure-selenium-logo.js [ruta/al/reporte]
 */
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const reportDir = path.resolve(
  projectRoot,
  process.env.REPORT_DIR || process.argv[2] || 'allure-report'
);
const indexPath = path.join(reportDir, 'index.html');
const executorsPath = path.join(reportDir, 'widgets', 'executors.json');
const scriptDir = __dirname;
const logoSource = path.join(scriptDir, 'assets', 'selenium-logo.svg');
const logoDest = path.join(reportDir, 'selenium-logo.svg');

if (!fs.existsSync(reportDir)) {
  console.log('patch-allure-selenium-logo: no report dir at', reportDir, ', skipping');
  process.exit(0);
}
if (!fs.existsSync(indexPath)) {
  console.log('patch-allure-selenium-logo: index.html not found, skipping');
  process.exit(0);
}
if (!fs.existsSync(logoSource)) {
  console.log('patch-allure-selenium-logo: selenium-logo.svg not found at', logoSource, ', skipping');
  process.exit(0);
}

const seleniumVersion = process.env.SELENIUM_VERSION || '4.x';
const seleniumBuildName = `Selenium ${seleniumVersion}`;

fs.copyFileSync(logoSource, logoDest);

if (fs.existsSync(executorsPath)) {
  let executors = JSON.parse(fs.readFileSync(executorsPath, 'utf8'));
  if (!Array.isArray(executors)) executors = [executors];
  const hasSelenium = executors.some(e => (e.type === 'selenium-custom') || (e.name && e.name.includes('Selenium Framework')));
  if (!hasSelenium) {
    executors.push({
      name: 'Selenium Framework',
      type: 'selenium-custom',
      buildName: seleniumBuildName,
      reportUrl: 'https://www.selenium.dev'
    });
    fs.writeFileSync(executorsPath, JSON.stringify(executors), 'utf8');
  }
}

const customStyle = `
<style id="allure-custom-selenium-style">
.custom-selenium-logo::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url('selenium-logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 5px;
  vertical-align: middle;
}
</style>
`;

const injectScript = `
<script>
(function(){
  function patchSeleniumExecutor() {
    var items = document.querySelectorAll('.executor__item, [class*="executor"] a, #content [class*="executor"]');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var text = (item.innerText || item.textContent || '').trim();
      if ((text.indexOf('selenium-custom') >= 0 || text.indexOf('Selenium Framework') >= 0) && !item.classList.contains('custom-selenium-logo')) {
        item.classList.add('custom-selenium-logo');
        var nativeIcon = item.querySelector('.executor-icon, [class*="executor-icon"]');
        if (nativeIcon) nativeIcon.style.display = 'none';
        if (item.innerHTML && item.innerHTML.indexOf('selenium-custom') >= 0) {
          item.innerHTML = item.innerHTML.replace(/selenium-custom/g, 'Selenium Automation');
        }
      }
    }
  }
  function runPatch() {
    patchSeleniumExecutor();
  }
  var patchTimer = null;
  function schedulePatch() {
    if (patchTimer) clearTimeout(patchTimer);
    patchTimer = setTimeout(runPatch, 150);
  }
  [500, 1200, 2500, 4000].forEach(function(ms) { setTimeout(runPatch, ms); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      [300, 1000, 2000].forEach(function(ms) { setTimeout(runPatch, ms); });
      var body = document.body;
      if (body) {
        var obs = new MutationObserver(function() { schedulePatch(); });
        obs.observe(body, { childList: true, subtree: true });
      }
    });
  } else {
    var body = document.body;
    if (body) {
      var obs = new MutationObserver(function() { schedulePatch(); });
      obs.observe(body, { childList: true, subtree: true });
    }
  }
})();
</script>
`;

let html = fs.readFileSync(indexPath, 'utf8');
if (html.indexOf('custom-selenium-logo') >= 0) {
  console.log('patch-allure-selenium-logo: already patched');
} else {
  html = html.replace('</head>', customStyle + '\n</head>');
  html = html.replace('</body>', injectScript + '\n</body>');
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('patch-allure-selenium-logo: executors + logo patched');
}
process.exit(0);
