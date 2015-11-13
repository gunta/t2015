var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var config = require('./config')

var routes = require('./routes/index')
var users = require('./routes/users')

var r = require('rethinkdb')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(createConnection)

app.use('/', routes)
app.use('/users', users)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


function createConnection(req, res, next) {
  r.connect(config.rethinkdb).then(function(conn) {
    req._rdbConn = conn
    next()
  }).error(handleError(res))
}

/*
 * Close the RethinkDB connection
 */
function closeConnection(req, res, next) {
  req._rdbConn.close()
}

r.connect(config.rethinkdb, function(err, conn) {
  if (err) {
    console.log("Could not open a connection to initialize the database")
    console.log(err.message)
    process.exit(1)
  }
})

app.use(closeConnection)


module.exports = app
