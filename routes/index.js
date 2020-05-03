var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');


var con = require('./connection');

const query = util.promisify(con.query).bind(con);

/* GET home page. */

router.get('/', function(req, res, next) {
  (async () => {
    try{
      let sess = req.session;
    
      res.render('index', {title: 'Trang chủ - Taihen', css: 'style', page: 'index', sess});
    }catch(err){
      console.log(err);
      render('error', {message: 404});
    }
  })();
});


module.exports = router;
