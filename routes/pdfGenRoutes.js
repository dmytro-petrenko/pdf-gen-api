const express = require('express');
const pdfGenController = require('../controllers/pdfGenController');

const router = express.Router();

router
  .route('/')
  // .get(pdfGenController.pdfGeneration)
  .post(pdfGenController.pdfGeneration);

module.exports = router;
