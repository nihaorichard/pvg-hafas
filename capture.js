const HEADER = {
  enabled: true,
  text: 'WEIMAR – ABZWEIG NACH NIEDERGUNSTEDT',
  height: 60,          // px
  background: '#000000',
  textColor: '#FFFFFF',
  fontSize: 28         // px
};

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set double resolution (1600x960)
  await page.setViewportSize({ width: 1600, height: 960 });

  // Navigate to Hafas
  await page.goto('https://vmt.hafas.cloud/mct/views/monitor/index.html?cfgFile=Bb01FAozvVHK2oWN7hjA_1612186328552', { 
    waitUntil: 'networkidle' 
  });

  // Wait 5 seconds for live bus rows to render
  await page.waitForTimeout(5000);

  // Save screenshot
  await page.screenshot({ path: 'latest.png' });
  await browser.close();
})();
