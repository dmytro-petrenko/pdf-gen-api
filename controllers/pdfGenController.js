const genPdfFunc = require('../utils/genPdfFun');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

exports.pdfGeneration = async (req, res) => {
  try {
    const imagePath = path.join(
      __dirname,
      '..',
      'public',
      'images',
      'the gardens logo.png'
    );

    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return new Buffer(bitmap).toString('base64');
    }
    const imageBase64 = 'data:image/png;base64,' + base64_encode(imagePath);

    // img.src = 'data:image/png;base64,' + base64_encode(imagePath);
    // console.log('imageBase64: ', imageBase64);

    const additServDetailsArray = req.body.addit_serv_details.split('\n');
    const priceReducDetailsArray = req.body.price_reduc_details.split('\n');

    let isActiveAddServDet;
    if (
      additServDetailsArray.length === 1 &&
      additServDetailsArray[0].length < 1
    ) {
      isActiveAddServDet = false;
    } else {
      isActiveAddServDet = true;
    }

    let isActivePriceReducDet;
    if (
      priceReducDetailsArray.length === 1 &&
      priceReducDetailsArray[0].length < 1
    ) {
      isActivePriceReducDet = false;
    } else {
      isActivePriceReducDet = true;
    }
    let calcTotalPrice, calcPriceReduction, calcPriceAdditServices;
    calcPriceReduction = isActivePriceReducDet ? req.body.price_reduction : 0;
    calcPriceAdditServices = isActiveAddServDet
      ? req.body.price_addit_services
      : 0;
    calcTotalPrice =
      req.body.wedding_base_price + calcPriceAdditServices - calcPriceReduction;

    const pageDir = path.join(__dirname, '..', 'views', 'gardens-quote.hbs');
    const file = fs.readFileSync(pageDir, 'utf-8');
    const fileCompiled = handlebars.compile(file);
    const fileHTML = fileCompiled({
      imgSource: imageBase64,
      couple_name: req.body.couple_name,
      wedding_date: req.body.wedding_date,
      wedding_base_price: req.body.wedding_base_price,
      price_reduction: calcPriceReduction,
      price_addit_services: calcPriceAdditServices,
      total_price: calcTotalPrice,
      price_reduc_details: {
        firstSentence: priceReducDetailsArray[0],
        otherSentnce: priceReducDetailsArray.slice(1),
      },
      addit_serv_details: {
        firstSentence: additServDetailsArray[0],
        otherSentnce: additServDetailsArray.slice(1),
      },
      quotation_reference: req.body.quotation_reference,
      quote_date: req.body.quote_date,
      quotation_valid_to: req.body.quotation_valid_to,
      day_guests: req.body.day_guests,
      evening_guests: req.body.evening_guests,
      isActAddServDet: isActiveAddServDet,
      isActPriceReducDet: isActivePriceReducDet,
    });

    const tempHtml =
      '<html><body><h1 style="color:blue;font-size:46px;">Test</h1></body></html>';

    const pdfBuffer = await genPdfFunc(fileHTML);

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
