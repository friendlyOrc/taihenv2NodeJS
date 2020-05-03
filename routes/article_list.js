var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');

var con = require('./connection');

const query = util.promisify(con.query).bind(con);

/* GET ARTICLE LIST. */
router.get('/:tag',  function(req, res, next) {
  (async () => {
    let sess = req.session;
    let tag = req.params.tag;
    
    let cur_tag = [], ar_query, articles;
    let cate = [];
    let chapters = [];

    if(tag === 'hot' || tag === 'complete'){
      if(tag === 'hot'){
        cur_tag = [{cat_name: "HOT", cat_ID: 'hot'}];
        ar_query = 'SELECT * FROM article ORDER BY article.ar_view DESC';
      }else {
        cur_tag = [{cat_name: "HOÀN TẤT", cat_ID: 'complete'}];
        ar_query = 'SELECT * FROM article WHERE ar_stt = 1';
      }
    }else {
      try{
        tag = parseInt(req.params.tag);
        if(tag === 0){
          cur_tag = [{cat_name: "Tất cả truyện", cat_ID: 0}];
          ar_query = "SELECT * FROM article";
        }else {
          cur_tag = await query("SELECT * FROM category where category.cat_ID = " + tag);
          ar_query = "SELECT * FROM article, ar_cat where article.ar_ID = ar_cat.ar_ID and ar_cat.cat_ID = " + tag;
        }
      }catch (err){
        console.log(err);
        res.render('error', {message: 404});
      }
    }
    

    const numRows = (await query(ar_query)).length;
    const page = parseInt(req.query.page) || 0;
    const numPerPage = 20;
    const last = Math.ceil(numRows/numPerPage);
    const start = page * numPerPage;
    
    articles = await query(ar_query + ` LIMIT ${start}, ${numPerPage}`);

    const pagination = {
      current: page,
      lastPage: last,
      previous: page > 0 ? page - 1 : 0,
      next: page < (((last - 1) >= 0)?last - 1: 0) ? page + 1 : (((last - 1) >= 0)?last - 1: 0),
      lastItem: (((page + 4 )< last)?page + 4:last)
    };
    console.log(pagination);
    for(let i = 0; i < articles.length; i++){
      let query2 = "SELECT * FROM ar_cat INNER JOIN category ON category.cat_ID = ar_cat.cat_ID WHERE ar_cat.ar_ID = ? ";
      cate[i] = await query(query2, articles[i].ar_ID);
      let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC LIMIT 1";
      chapters[i] = await query(query3, articles[i].ar_ID);
    }
    
    res.render('article_list', {title: `Danh sách ${cur_tag[0].cat_name}- Taihen`, css: 'article_list', page: 'list', cur_tag, articles, cate, chapters, sess, pagination});
  })();
});

module.exports = router;
