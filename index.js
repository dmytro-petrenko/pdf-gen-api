const handlebars = require('express-handlebars');
// const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const path = require('path');
const pdfGenRoutes = require('./routes/pdfGenRoutes');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = express();

const whitelist = ['https://www.glowevents.co.uk/', 'http://localhost:3000'];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

const hbs = handlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.render('gardens-quote');
// });

app.use('/pdf-generation', pdfGenRoutes);

const port = process.env.PORT || 7070;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
