const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); // Load environment variables
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth'); // Import auth routes
const animeRouter = require('./routes/anime'); // Import anime routes
const recommendationRouter = require('./routes/recommendation'); // Import anime routes

const app = express();
const port = process.env.PORT || 3001; // Use PORT environment variable or default to 3001
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter); // Use auth routes
app.use('/anime', animeRouter); // Use anime routes
app.use('/api/recommendation', recommendationRouter); // Use anime routes
// Serve images from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
