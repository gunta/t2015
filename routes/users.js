var express = require('express')
var router = express.Router()

var r = require('rethinkdb')

/* GET users listing. */
router.get('/', function (req, res, next) {

  r.table('users').run(req._rdbConn).then(function () {

  }).then(function (result) {
    res.send(JSON.stringify(result))
  }).error(handleError(res))
    .finally(next)

  res.send('respond with a resource 2')


})

function get(req, res, next) {
  r.table('todos').orderBy({index: "createdAt"}).run(req._rdbConn).then(function (cursor) {
    return cursor.toArray();
  }).then(function (result) {
    res.send(JSON.stringify(result));
  }).error(handleError(res))
    .finally(next);
}

module.exports = router
