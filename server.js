const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');

const app = express();

const hbs = handlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('gardens-quote');
});

app.listen(3300, () => {
  console.log('Server is running on port 3300...');
});
