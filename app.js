var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const routes = require('./routes/index');
const book = require('./routes/book');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', book);


const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'library.db'
});
  
  // async IIFE
(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Page not found!")
  next(createError(404));
  err.status = 404;
  res.render('page-not-found', { err })
  
});

// error Global handler
app.use(function(err, req, res, next) {
  // Checking if err is 404
  if(err.status === 404 ) {
    err.message = err.message || "Page not Found!"
    res.render('page-not-found', { err })
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('errors');
  }
  
});

module.exports = app;
