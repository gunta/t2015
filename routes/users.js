var express = require('express')
var router = express.Router()

var _ = require('lodash')

var r = require('rethinkdb')

function found(res, result) {
  var data
  if (result) {
    data = _.isArray(result) ? result : [result]
  } else {
    data = []
  }

  return res.json({
    "result": true,
    "data": data
  })
}

/* GET users listing. */
//router.get('/', function (req, res, next) {
//
//  r.table('users').run(req._rdbConn).then(function (cursor) {
//    console.log(cursor.toArray())
//    return cursor.toArray()
//  }).then(function (result) {
//    console.log(result)
//    res.send(JSON.stringify(result))
//  }).error(handleError(res))
//    .finally(next)
//  //res.send('respond with a resource 2')
//
//})

router.get('/', function (req, res, next) {
  console.log(req.query)
   if (req.query.findByUserId) {
     var userId = req.query.findByUserId

     r.table('users').get(userId).run(req._rdbConn).then(function (result) {
       found(res, result)
     }).error(handleError(res)).finally(next)

   } else {
     res.send('nothing')
   }
})

function handleError(res) {
  return function(error) {
    res.send(500, {error: error.message})
  }
}

function get(req, res, next) {
  r.table('todos').orderBy({index: "createdAt"}).run(req._rdbConn).then(function (cursor) {
    return cursor.toArray()
  }).then(function (result) {
    res.send(JSON.stringify(result))
  }).error(handleError(res))
    .finally(next)
}

module.exports = router
