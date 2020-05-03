var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var util = require('util');

var con = require('./connection');

const query = util.promisify(con.query).bind(con);

/* GET CHAPTER. */
router.get('/:ar_ID-:chap_ID', async function(req, res, next) {
  let sess = req.session;
  let ar_ID = parseInt(req.params.ar_ID);
  let chap_ID = parseInt(req.params.chap_ID);
  // console.log(ar_ID);
  if(!ar_ID || !chap_ID){
    res.render('error', {message: '404'});
  }else {
    try{
      const cur_count = (await query("SELECT ar_view FROM article WHERE ar_ID = " + ar_ID))[0].ar_view;
      await query(`UPDATE article SET ar_view = ${cur_count + 1} WHERE ar_ID = ${ar_ID}`);
      await query(`INSERT INTO count_view (ar_ID, time) value (${ar_ID}, utc_date())`);
      

      let index;
      for(let i = 0; i < sess.articles.length; i++){
        if(sess.articles[i].ar_ID === ar_ID){
          index = i;
          break;
        }
      }
      const chapter = await query(`SELECT * FROM chapter where chapter.chap_ID = ${chap_ID} and chapter.ar_ID = ${ar_ID}`);
      sess.articles = await query('SELECT * FROM article ORDER BY article.ar_ID DESC');

      return res.render('chapter', {title: `Đọc ${sess.articles[index].ar_name} - ${chapter[0].chap_name}`, css: 'chapter', page: 'chapter', sess, index, chapter, chap_ID});
    }catch (err){
      console.log(err);
      res.render('error', {message: 404});
    }
  }
});


module.exports = router;
