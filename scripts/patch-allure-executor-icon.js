/**
 * Parche post-generación del reporte Allure: reemplaza el icono del casco
 * por el logo de Selenium en la fila "Selenium Framework" de Executors.
 * Solo modifica la celda del icono (oculta el icono nativo y muestra ::before con el logo).
 */
const fs = require('fs');
const path = require('path');

const reportDir = path.join(__dirname, '..', 'allure-report');
const resultsDir = path.join(__dirname, '..', 'allure-results');
const executorSource = path.join(resultsDir, 'executor.json');
const widgetExecutors = path.join(reportDir, 'widgets', 'executors.json');
const indexPath = path.join(reportDir, 'index.html');
const logoPath = path.join(__dirname, '..', 'assets', 'selenium-logo.svg');

if (!fs.existsSync(reportDir) || !fs.existsSync(indexPath)) {
  console.log('Allure report not found; skipping executor icon patch.');
  process.exit(0);
}

// Asegurar que el widget tenga los ejecutores (array). executor.json puede ser objeto o array.
if (fs.existsSync(executorSource) && fs.existsSync(path.join(reportDir, 'widgets'))) {
  try {
    const data = JSON.parse(fs.readFileSync(executorSource, 'utf8'));
    let list = Array.isArray(data) ? data : [data];
    // Si solo hay uno y es GitHub, añadir fila Selenium para las dos líneas en la UI
    const packagePath = path.join(__dirname, '..', 'package.json');
    let seleniumVersion = '4.x';
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const ver = pkg.devDependencies && (pkg.devDependencies['selenium-webdriver'] || pkg.devDependencies['selenium']);
      if (ver) seleniumVersion = ver.replace(/^\^/, '');
    } catch (_) {}
    const seleniumRow = {
      name: 'Selenium Framework',
      type: 'selenium-custom',
      buildName: `v${seleniumVersion}`,
      reportUrl: 'https://www.selenium.dev',
    };
    const hasSelenium = list.some((e) => e && e.name === 'Selenium Framework');
    if (list.length === 1 && list[0].type === 'github' && !hasSelenium) {
      list = [list[0], seleniumRow];
    }
    if (list.length > 0) {
      fs.writeFileSync(widgetExecutors, JSON.stringify(list), 'utf8');
    }
  } catch (_) {}
}

// Logo SVG compacto (Selenium verde) para mostrar en 20x20
const fallbackSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#43B02A"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-6 1.5 2.5L14 11l-3 6zm4 0h-2v-6l2-3 1.5 2.5L17 13l-2 4z"/></svg>';

let svgForBase64 = fallbackSvg;
if (fs.existsSync(logoPath)) {
  try {
    svgForBase64 = fs
      .readFileSync(logoPath, 'utf8')
      .replace(/<\?xml[^>]*\?>/gi, '')
      .trim();
  } catch (_) {}
}

const base64Logo = Buffer.from(svgForBase64).toString('base64');

const css = `
.custom-selenium-logo::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  background-image: url('data:image/svg+xml;base64,${base64Logo}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 6px;
  vertical-align: middle;
}
.custom-selenium-logo .executor-icon,
.custom-selenium-logo [class*="executor-icon"] {
  display: none !important;
}
`;

/**
 * Busca la fila que contiene "Selenium Framework", localiza la celda del icono,
 * oculta el icono nativo y añade la clase para mostrar el logo en ::before.
 */
const script =
  '<script id="custom-selenium-executor-patch">\n' +
  '(function() {\n' +
  '  var targetText = "Selenium Framework";\n' +
  '  var className = "custom-selenium-logo";\n' +
  '  function findIconCellForSeleniumRow() {\n' +
  '    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);\n' +
  '    var node;\n' +
  '    while ((node = walker.nextNode())) {\n' +
  '      var text = (node.textContent || "").trim();\n' +
  '      if (text.indexOf(targetText) === -1) continue;\n' +
  '      var el = node.parentElement;\n' +
  '      while (el && el !== document.body) {\n' +
  '        var icon = el.querySelector("[class*=\\"executor-icon\\"], [class*=\\"icon\\"]");\n' +
  '        if (icon) {\n' +
  '          var iconParent = icon.parentElement;\n' +
  '          if (iconParent && !iconParent.classList.contains(className)) {\n' +
  '            icon.style.setProperty("display", "none", "important");\n' +
  '            iconParent.classList.add(className);\n' +
  '            return true;\n' +
  '          }\n' +
  '          return false;\n' +
  '        }\n' +
  '        var prev = el.previousElementSibling;\n' +
  '        if (prev) {\n' +
  '          var iconInPrev = prev.querySelector("[class*=\\"icon\\"]");\n' +
  '          if (iconInPrev && !prev.classList.contains(className)) {\n' +
  '            iconInPrev.style.setProperty("display", "none", "important");\n' +
  '            prev.classList.add(className);\n' +
  '            return true;\n' +
  '          }\n' +
  '        }\n' +
  '        el = el.parentElement;\n' +
  '      }\n' +
  '    }\n' +
  '    return false;\n' +
  '  }\n' +
  '  function run() {\n' +
  '    findIconCellForSeleniumRow();\n' +
  '    var attempts = 0;\n' +
  '    var id = setInterval(function() {\n' +
  '      attempts++;\n' +
  '      if (findIconCellForSeleniumRow() || attempts >= 30) clearInterval(id);\n' +
  '    }, 200);\n' +
  '  }\n' +
  '  var debounceTimer;\n' +
  '  function reapplyOnDomChange() {\n' +
  '    clearTimeout(debounceTimer);\n' +
  '    debounceTimer = setTimeout(findIconCellForSeleniumRow, 150);\n' +
  '  }\n' +
  '  if (document.readyState === "loading") {\n' +
  '    document.addEventListener("DOMContentLoaded", function() {\n' +
  '      run();\n' +
  '      if (typeof MutationObserver !== "undefined") {\n' +
  '        var obs = new MutationObserver(reapplyOnDomChange);\n' +
  '        obs.observe(document.body, { childList: true, subtree: true });\n' +
  '      }\n' +
  '    });\n' +
  '  } else {\n' +
  '    setTimeout(function() {\n' +
  '      run();\n' +
  '      if (typeof MutationObserver !== "undefined") {\n' +
  '        var obs = new MutationObserver(reapplyOnDomChange);\n' +
  '        obs.observe(document.body, { childList: true, subtree: true });\n' +
  '      }\n' +
  '    }, 100);\n' +
  '  }\n' +
  '})();\n' +
  '</script>';

const styleBlock = '<style id="custom-selenium-executor-style">\n' + css.trim() + '\n</style>';

let html = fs.readFileSync(indexPath, 'utf8');

if (html.includes('id="custom-playwright-executor-style"') || html.includes('id="custom-selenium-executor-style"')) {
  html = html.replace(
    /<style id="custom-playwright-executor-style">[\s\S]*?<\/style>/,
    styleBlock
  );
  html = html.replace(
    /<style id="custom-selenium-executor-style">[\s\S]*?<\/style>/,
    styleBlock
  );
} else {
  html = html.replace('</head>', styleBlock + '\n</head>');
}

if (html.includes('id="custom-playwright-executor-patch"') || html.includes('id="custom-selenium-executor-patch"')) {
  html = html.replace(
    /<script id="custom-playwright-executor-patch">[\s\S]*?<\/script>/,
    script
  );
  html = html.replace(
    /<script id="custom-selenium-executor-patch">[\s\S]*?<\/script>/,
    script
  );
} else {
  html = html.replace('</body>', script + '\n</body>');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Allure: executor icon patch applied (Selenium logo replaces helmet).');
