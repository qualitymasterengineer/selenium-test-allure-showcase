#!/usr/bin/env node
/**
 * Clears Allure execution history so the next report starts from zero.
 * Removes allure-results and allure-report (including trend/history data).
 */

const fs = require("fs");
const path = require("path");

const dirs = ["allure-results", "allure-report"];

for (const dir of dirs) {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`Removed: ${dir}`);
  } else {
    console.log(`Skipped (not found): ${dir}`);
  }
}

console.log("Allure history cleared. Next run will start a fresh report.");
