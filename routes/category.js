var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');

var con = require('./connection');

const query = util.promisify(con.query).bind(con);

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

/* GET CATEGORY. */
router.get('/', function(req, res, next) {
  (async () => {

    let sess = req.session;
    
    res.render('category', {title: 'Thể loại - Taihen', css: 'category', page: 'category', sess});
  })();
});

module.exports = router;
