const { chromium } = require('playwright');
const QRCode = require('qrcode');

// ==============================
// HEADER SETTINGS
// ==============================
const HEADER = {
  enabled: true,

  text: 'BUS STOP „Abzweig n. Niedergrunstedt“',

  height: 140,              // Header height in px
  background: '#FFFFFF',    // Header background
  textColor: '#000000',     // Header text color
  fontSize: 80              // Header text size in px
};


// ==============================
// QR CODE SETTINGS
// ==============================
const QR = {
  enabled: true,

  // Website encoded in the QR code
  contentUrl: 'https://CONTENTURL.NET',

  // QR code size in px
  // Width and height are ALWAYS the same
  size: 200,

  // QR code color
  color: '#000000',

  // QR code background color
  background: '#FFFFFF',

  // Position from screen edges
  right: 30,
  bottom: 30
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


  // ==============================
  // OPEN HAFAS
  // ==============================
  await page.goto(
    'https://vmt.hafas.cloud/mct/views/monitor/index.html?cfgFile=Bb01FAozvVHK2oWN7hjA_1612186328552',
    {
      waitUntil: 'networkidle'
    }
  );


  // ==============================
  // WAIT FOR LIVE BUS DATA
  // ==============================
  await page.waitForTimeout(5000);


  // ==============================
  // ADD HEADER
  // ==============================
  if (HEADER.enabled) {

    await page.evaluate((header) => {

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


      // Push HAFAS content down
      document.body.style.paddingTop = `${header.height}px`;

      document.body.style.boxSizing = 'border-box';

    }, HEADER);
  }


  // ==============================
  // CREATE QR CODE
  // ==============================
  if (QR.enabled) {

    const qrDataUrl = await QRCode.toDataURL(
      QR.contentUrl,
      {
        width: QR.size,

        margin: 0,

        color: {
          dark: QR.color,
          light: QR.background
        },

        errorCorrectionLevel: 'M'
      }
    );


    // Add QR to page
    await page.evaluate((qr) => {

      const qrImage = document.createElement('img');

      qrImage.id = 'github-capture-qr';

      qrImage.src = qr.dataUrl;


      // QR styling
      Object.assign(qrImage.style, {

        position: 'fixed',

        width: `${qr.size}px`,

        height: `${qr.size}px`,

        right: `${qr.right}px`,

        bottom: `${qr.bottom}px`,

        display: 'block',

        margin: '0',

        padding: '0',

        zIndex: '999999'
      });


      document.body.appendChild(qrImage);

    }, {

      dataUrl: qrDataUrl,

      size: QR.size,

      right: QR.right,

      bottom: QR.bottom

    });
  }


  // ==============================
  // WAIT FOR QR TO RENDER
  // ==============================
  await page.waitForTimeout(500);


  // ==============================
  // SAVE SCREENSHOT
  // ==============================
  await page.screenshot({
    path: 'latest.png',
    type: 'png'
  });


  // ==============================
  // CLOSE BROWSER
  // ==============================
  await browser.close();

})();