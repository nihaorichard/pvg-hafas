const { chromium } = require('playwright');

// ==============================
// HEADER SETTINGS
// ==============================
const HEADER = {
  enabled: true,

  text: 'BUS STOP „Abzweig n. Niedergrunstedt“',

  height: 140,              // Header height in px
  background: '#FFFFFF',   // Header background
  textColor: '#000000',    // Text color
  fontSize: 80             // Text size in px
};


// ==============================
// CAPTURE
// ==============================
(async () => {
  const browser = await chromium.launch();

  const page = await browser.newPage({
    viewport: {
      width: 1600,
      height: 960
    }
  });

  // Navigate to HAFAS
  await page.goto(
    'https://vmt.hafas.cloud/mct/views/monitor/index.html?cfgFile=Bb01FAozvVHK2oWN7hjA_1612186328552',
    {
      waitUntil: 'networkidle'
    }
  );

  // Wait for live bus rows to render
  await page.waitForTimeout(5000);


  // ==============================
  // ADD HEADER
  // ==============================
  if (HEADER.enabled) {

    await page.evaluate((header) => {

      // Create header
      const bar = document.createElement('div');

      bar.id = 'github-capture-header';

      bar.innerText = header.text;

      // Header styling
      Object.assign(bar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: `${header.height}px`,
        background: header.background,
        color: header.textColor,
        fontSize: `${header.fontSize}px`,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '20px',
        boxSizing: 'border-box',
        zIndex: '999999',
        lineHeight: '1',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      });

      document.body.appendChild(bar);


      // Push the HAFAS page down
      document.body.style.paddingTop = `${header.height}px`;
      document.body.style.boxSizing = 'border-box';

    }, HEADER);
  }


  // Small delay so browser renders injected header
  await page.waitForTimeout(500);


  // ==============================
  // SAVE SCREENSHOT
  // ==============================
  await page.screenshot({
    path: 'latest.png',
    type: 'png'
  });


  await browser.close();
})();
