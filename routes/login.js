var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');


var con = require('./connection');

const query = util.promisify(con.query).bind(con);

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('login', {title: 'Đăng nhập', css: 'admin', page: 'login', message: ''});
});
router.post('/', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    let acc = req.body.mail;
    let pass = req.body.pass;
    console.log(acc + " " + pass);
    if(acc && pass){
      const rs = await query(`SELECT * FROM account WHERE email = '${acc}' AND password = '${pass}'`);
      if(rs.length){
        sess.userID = rs[0].accID;
        sess.user = rs[0].email;
        // console.log(sess);
        res.redirect('/admin');
      }else{
        mess = 'wrong';
        res.render('login', {title: 'Đăng nhập', css: 'admin', page: 'login', message: mess})
      }
    }else{
      mess = 'empty';
      res.render('login', {title: 'Đăng nhập', css: 'admin', page: 'login', message: mess})
    }
  })();
});


module.exports = router;
