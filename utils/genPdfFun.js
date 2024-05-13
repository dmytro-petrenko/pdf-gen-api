const puppeteer = require('puppeteer');
require('dotenv').config();

module.exports = async function genPdfFunc(html) {
  try {
    const browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        // '--single-process',
        '--no-zygote',
      ],
      executablePath:
        process.env.NODE_ENV === 'production'
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    await page.setContent(
      // '<html><body><h1 style="color:blue;font-size:46px;">Test</h1></body></html>',
      html,
      {
        waitUntil: 'domcontentloaded',
      }
    );
    await page.addStyleTag({ path: './public/styles/fonts.css' });
    await page.addStyleTag({ path: './public/styles/gardens_quote.css' });

    await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '50px', right: '0px', bottom: '50px', left: '0px' },
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error('Error: ', error);
  }
};
