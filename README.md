<div align="center">
  <img src="https://raw.githubusercontent.com/qualitymasterengineer/portfolio/main/assets/img/logo-gold.png" alt="Quality Master Engineer Logo" width="120" />

  # 🏆 Quality Master Engineer
  ### **Selenium Automation Framework & Allure Showcase**

  [![Selenium Tests](https://img.shields.io/badge/Framework-Selenium-D4AF37?style=for-the-badge&logo=selenium&logoColor=white)](https://www.selenium.dev/)
  [![Language-Java](https://img.shields.io/badge/Language-Java-D4AF37?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
  [![Allure-Report](https://img.shields.io/badge/Report-Allure-D4AF37?style=for-the-badge&logo=allure&logoColor=white)](https://allurereport.org/)
  [![CI/CD-GitHub_Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-D4AF37?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)

  ---
  
  **"Transformando la Calidad en una Ventaja Competitiva mediante Ingeniería de Software y Observabilidad Estratégica."**

  [🌐 Ver Portafolio Principal](https://qualitymasterengineer.github.io/portfolio) • [📊 Ver Reporte en Vivo](https://qualitymasterengineer.github.io/selenium-test-allure-showcase/)
</div>

---

## 🛠️ Arquitectura del Ecosistema
Este proyecto no es solo una suite de pruebas; es un **Showcase de Ingeniería de Calidad** diseñado para demostrar escalabilidad, mantenibilidad y visibilidad técnica avanzada.

## Propósito

Este proyecto **solo muestra** los resultados de ejecución que genera el proyecto **selenium-test**. Ese proyecto es quien ejecuta las pruebas con Selenium y actualiza este repositorio con la carpeta `allure-results` para que aquí se genere y se visualice el reporte Allure.

**Histórico:** En cada ejecución del workflow (al recibir un push a `main` con nuevos `allure-results`), se copia la carpeta `history` del reporte ya desplegado en `gh-pages` a `allure-results` antes de generar el nuevo reporte. Así se mantiene el histórico y las gráficas (Trend, Duration, Retries, Categories) se rellenan correctamente en cada despliegue.

## Uso

1. Asegúrate de que la carpeta `allure-results` esté actualizada (el proyecto **selenium-test** la copia o sube aquí).
2. Instala dependencias y genera/abre el reporte:

```bash
npm install
npm run report:generate
npm run report:open
```

- **`report:generate`**: genera el reporte HTML en `allure-report` a partir de `allure-results`.
- **`report:open`**: abre el reporte en el navegador.
- **`report:prepare`** / **`report:allure:prepare`**: ejecuta `scripts/prepare-allure.js` (history, env, executor, categories, parches de known failures / broken→failed / passed message).
- **`report:allure:generate`**: prepare + allure generate + parche del logo Selenium (`patch-allure-selenium-logo.js`). Se ejecuta automáticamente en CI.
- **`report:clean-history`**: borra `allure-results` y `allure-report` para iniciar el histórico desde cero.

Para que el reporte se vea igual que en **selenium-test** (logo de Selenium en Executors), usa `npm run report:allure:generate` y luego `npm run report:allure:open`. En CI el workflow ya aplica el parche antes de desplegar a GitHub Pages.

**Script de parche Executors** (`scripts/patch-allure-selenium-logo.js`): añade el segundo ejecutor "Selenium Framework" y muestra el logo desde `assets/selenium-logo.svg`. Se ejecuta tras generar el reporte.

### Dos filas en Executors (GitHub Actions + Selenium Framework)

El script **patch-allure-selenium-logo.js** (tras `allure generate`): añade un segundo ejecutor en `allure-report/widgets/executors.json` (Selenium Framework, type selenium-custom) e inyecta CSS/JS en `index.html` para mostrar el logo de Selenium en esa fila y ocultar el icono por defecto. El primer ejecutor (del `executor.json` en allure-results o del workflow) no se modifica.

## Reiniciar el histórico de ejecuciones

Para limpiar el historial y que el siguiente reporte empiece desde cero (sin tendencias ni ejecuciones anteriores):

```bash
npm run report:clean-history
```

Luego haz commit y push de los cambios si `allure-results` está versionado, o deja que el proyecto **selenium-test** vuelva a subir resultados; la próxima generación y despliegue mostrará solo esa ejecución.

## Estructura esperada

```
allure-results/   ← actualizado por el proyecto selenium-test
allure-report/   ← generado localmente (ignorado por git)
```

## Requisitos

- Node.js >= 18
- Allure CLI (incluido vía `allure-commandline` como dependencia)
