const puppeteer = require('puppeteer');

module.exports = async function genPdfFunc() {
  try {
    // const browser = await puppeteer.launch({
    //   args: ['--no-sandbox'],
    //   headless: true,
    // });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(
      '<html><body><h1 style="color:blue;font-size:46px;">Test</h1></body></html>',
      {
        waitUntil: 'domcontentloaded',
      }
    );

    // await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error('Error: ', error);
  }
};
