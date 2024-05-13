const genPdfFunc = require('../utils/genPdfFun');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

exports.pdfGeneration = async (req, res) => {
  try {
    // const pageDir = resolve(__dirname, '..', 'views', 'gardens-quote.hbs');

    const pageDir = path.join(__dirname, '..', 'views', 'gardens-quote.hbs');
    const file = fs.readFileSync(pageDir, 'utf-8');
    const fileCompiled = handlebars.compile(file);
    const fileHTML = fileCompiled({});

    const tempHtml =
      '<html><body><h1 style="color:blue;font-size:46px;">Test</h1></body></html>';
    const pdfBuffer = await genPdfFunc(fileHTML);

    console.log('pdfBuffer: ', pdfBuffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=quote.pdf',
    });
    res.status(200);
    res.send(pdfBuffer);
  } catch (error) {
    res.json(500).json({
      status: 'fail',
      message: error,
    });
  }
};
