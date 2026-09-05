const { chromium } = require('playwright');
const QRCode = require('qrcode');

// ==============================
// HEADER SETTINGS
// ==============================
const HEADER = {
  enabled: true,

  text: 'BUS STOP „Abzweig n. Niedergrunstedt“',

  height: 140,
  background: '#FFFFFF',
  textColor: '#000000',
  fontSize: 80
};


// ==============================
// QR CODE SETTINGS
// ==============================
const QR = {
  enabled: true,

  contentUrl: 'https://vmt.hafas.cloud/mct/views/monitor/index.html?cfgFile=Bb01FAozvVHK2oWN7hjA_1612186328552',

  // TOTAL QR SQUARE SIZE in px
  size: 200,

  color: '#000000',
  background: '#FFFFFF',

  // Actual border around QR in px
  border: 10,

  // QR position
  right: 30,
  bottom: 30
};


// ==============================
// LIVE SCAN BOX SETTINGS
// ==============================
const LIVE_SCAN_BOX = {
  enabled: true,

  // Square size in px
  size: 200,

  // Box colors
  background: '#000000',
  textColor: '#FFFFFF',

  // Text size
  fontSize: 30,

  // Position from right and bottom
  right: 260,
  bottom: 30,

  // Text
  line1: 'FÜR LIVE',
  line2: 'QR SCANNEN'
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

      document.body.style.paddingTop = `${header.height}px`;
      document.body.style.boxSizing = 'border-box';

    }, HEADER);
  }


  // ==============================
  // CREATE QR CODE
  // ==============================
  if (QR.enabled) {

    const qrSize = QR.size - (QR.border * 2);

    const qrDataUrl = await QRCode.toDataURL(
      QR.contentUrl,
      {
        width: qrSize,
        margin: 0,

        color: {
          dark: QR.color,
          light: QR.background
        },

        errorCorrectionLevel: 'M'
      }
    );


    // ==============================
    // ADD QR TO PAGE
    // ==============================
    await page.evaluate((qr) => {

      const qrContainer = document.createElement('div');

      qrContainer.id = 'github-capture-qr';

      Object.assign(qrContainer.style, {
        position: 'fixed',

        width: `${qr.size}px`,
        height: `${qr.size}px`,

        right: `${qr.right}px`,
        bottom: `${qr.bottom}px`,

        background: qr.background,

        padding: `${qr.border}px`,

        boxSizing: 'border-box',

        zIndex: '999999',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      });


      const qrImage = document.createElement('img');

      qrImage.src = qr.dataUrl;

      Object.assign(qrImage.style, {
        width: `${qr.qrSize}px`,
        height: `${qr.qrSize}px`,
        display: 'block',
        margin: '0',
        padding: '0'
      });


      qrContainer.appendChild(qrImage);

      document.body.appendChild(qrContainer);

    }, {
      size: QR.size,
      qrSize: qrSize,
      border: QR.border,
      background: QR.background,
      dataUrl: qrDataUrl,
      right: QR.right,
      bottom: QR.bottom
    });
  }


  // ==============================
  // ADD "FOR LIVE / SCAN QR" BOX
  // ==============================
  if (LIVE_SCAN_BOX.enabled) {

    await page.evaluate((box) => {

      const scanBox = document.createElement('div');

      scanBox.id = 'github-live-scan-box';

      Object.assign(scanBox.style, {

        position: 'fixed',

        width: `${box.size}px`,
        height: `${box.size}px`,

        right: `${box.right}px`,
        bottom: `${box.bottom}px`,

        background: box.background,

        color: box.textColor,

        fontSize: `${box.fontSize}px`,

        fontFamily: 'Arial, Helvetica, sans-serif',

        fontWeight: 'bold',

        display: 'flex',

        flexDirection: 'column',

        alignItems: 'center',

        justifyContent: 'center',

        textAlign: 'center',

        lineHeight: '1.15',

        boxSizing: 'border-box',

        zIndex: '999998',

        overflow: 'hidden'
      });


      // First line
      const line1 = document.createElement('div');

      line1.innerText = box.line1;


      // Second line
      const line2 = document.createElement('div');

      line2.innerText = box.line2;


      scanBox.appendChild(line1);
      scanBox.appendChild(line2);

      document.body.appendChild(scanBox);

    }, LIVE_SCAN_BOX);
  }


  // ==============================
  // WAIT FOR ELEMENTS TO RENDER
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