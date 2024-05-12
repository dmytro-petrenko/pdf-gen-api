const genPdfFunc = require('../utils/genPdfFun');

exports.pdfGeneration = async (req, res) => {
  try {
    const pdfBuffer = await genPdfFunc();

    // console.log('pdfBuffer: ', pdfBuffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=quote.pdf',
    });
    res.status(200);
    res.send(pdfBuffer);
    // res.send(pdfBlob);
    // res.send('Hello world!!!');
  } catch (error) {
    res.json(500).json({
      status: 'fail',
      message: error,
    });
  }
};
