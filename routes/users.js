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
//})

router.get('/', function (req, res, next) {
  var limit = req.query.limit ? parseInt(req.query.limit) : 100

  if (req.query.findByUserId) {
    var userId = req.query.findByUserId
    r.table('users').get(userId).run(req._rdbConn).then(function (result) {
      found(res, result)
    }).error(handleError(res)).finally(next)
  }

  if (req.query.findByUserPublicScoreGTE) {
    console.log("GTE", parseInt(req.query.findByUserPublicScoreGTE))
    var userPublicScoreGTE = req.query.findByUserPublicScoreGTE
    r.table('users').orderBy(r.desc('userNo')).filter(r.row('userPublicScore').gt(userPublicScoreGTE)).limit(limit)
      .run(req._rdbConn).then(function (cursor) {
        return cursor.toArray()
      })
      .then(function (result) {
        found(res, result)
      }).error(handleError(res)).finally(next)
  }

  if (req.query.findByUserPublicScoreLTE) {
    console.log("LTE")
    var userPublicScoreLTE = parseInt(req.query.findByUserPublicScoreLTE)
    r.table('users').orderBy(r.desc('userNo')).filter(r.row('userPublicScore').lt(userPublicScoreLTE)).limit(limit)
      .run(req._rdbConn).then(function (cursor) {
        return cursor.toArray()
      })
      .then(function (result) {
        found(res, result)
      }).finally(next)
  }

  if (req.query.findByUserFriendsNumber) {
    var userFriendsNumber = req.query.userFriendsNumber
    r.table('users').orderBy(r.desc('userNo')).filter(r.row('userFriendsNumber').lt(userFriendsNumber)).limit(limit)
      .run(req._rdbConn).then(function (cursor) {
        return cursor.toArray()
      })
      .then(function (result) {
        found(res, result)
      }).finally(next)
  }

})

function handleError(res) {
  return function (error) {
    res.send(500, {error: error.message})
  }
}

module.exports = router
