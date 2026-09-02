const { chromium } = require('playwright');

// ============================================================
// HEADER SETTINGS
// ============================================================
const HEADER = {
  enabled: true,

  // First row
  line1: 'BUS STOP Abzweig n. Niedergrunstedt',

  // Second row
  line2HTML: `
    Linie <span class="english">Line</span>
    &nbsp;&nbsp;
    Richtung <span class="english">Direction</span>
    &nbsp;&nbsp;
    Minuten <span class="english">Minutes</span>
    &nbsp;&nbsp;
    Info <span class="english">Info</span>
  `,

  // Header appearance
  height: 140,             // Header height in pixels
  background: '#FFFFFF',   // Header background color
  textColor: '#000000',    // Text color

  // Font sizes
  line1FontSize: 35,       // First row
  line2FontSize: 15        // Second row
};


// ============================================================
// CAPTURE
// ============================================================
(async () => {

  const browser = await chromium.launch();

  const page = await browser.newPage({
    viewport: {
      width: 1600,
      height: 960
    }
  });

  // ==========================================================
  // OPEN HAFAS
  // ==========================================================
  await page.goto(
    'https://vmt.hafas.cloud/mct/views/monitor/index.html?cfgFile=Bb01FAozvVHK2oWN7hjA_1612186328552',
    {
      waitUntil: 'networkidle'
    }
  );

  // Wait for live bus rows to render
  await page.waitForTimeout(5000);


  // ==========================================================
  // ADD HEADER
  // ==========================================================
  if (HEADER.enabled) {

    await page.evaluate((header) => {

      // ------------------------------------------------------
      // Header element
      // ------------------------------------------------------
      const bar = document.createElement('div');

      bar.id = 'github-capture-header';


      // ------------------------------------------------------
      // Header content
      // ------------------------------------------------------
      bar.innerHTML = `
        <div class="header-content">

          <div class="header-line1">
            ${header.line1}
          </div>

          <div class="header-line2">
            ${header.line2HTML}
          </div>

        </div>
      `;


      // ------------------------------------------------------
      // Header styling
      // ------------------------------------------------------
      Object.assign(bar.style, {

        position: 'fixed',

        top: '0',
        left: '0',

        width: '100%',
        height: `${header.height}px`,

        background: header.background,
        color: header.textColor,

        fontFamily: 'Arial, Helvetica, sans-serif',

        display: 'flex',
        alignItems: 'center',

        boxSizing: 'border-box',

        paddingLeft: '20px',

        zIndex: '999999',

        overflow: 'hidden'

      });


      // ------------------------------------------------------
      // Add CSS for header text
      // ------------------------------------------------------
      const style = document.createElement('style');

      style.textContent = `

        #github-capture-header .header-content {

          display: flex;

          flex-direction: column;

          justify-content: center;

          width: 100%;

          height: 100%;

        }


        #github-capture-header .header-line1 {

          font-size: ${header.line1FontSize}px;

          font-weight: bold;

          line-height: 1.1;

        }


        #github-capture-header .header-line2 {

          font-size: ${header.line2FontSize}px;

          font-weight: bold;

          line-height: 1.1;

        }


        #github-capture-header .english {

          font-style: italic;

          font-weight: normal;

        }

      `;


      document.head.appendChild(style);

      document.body.appendChild(bar);


      // ------------------------------------------------------
      // Make room for the header
      // ------------------------------------------------------
      document.body.style.paddingTop =
        `${header.height}px`;

      document.body.style.boxSizing = 'border-box';

    }, HEADER);

  }


  // ==========================================================
  // WAIT FOR HEADER TO RENDER
  // ==========================================================
  await page.waitForTimeout(500);


  // ==========================================================
  // SAVE SCREENSHOT
  // ==========================================================
  await page.screenshot({
    path: 'latest.png',
    type: 'png'
  });


  // ==========================================================
  // CLOSE BROWSER
  // ==========================================================
  await browser.close();

})();
