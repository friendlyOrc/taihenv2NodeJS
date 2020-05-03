var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');

var con = require('./connection');

const query = util.promisify(con.query).bind(con);

/* GET ARTICLE LIST. */

router.get('/:search',  function(req, res, next) {
  (async () => {
    let sess = req.session;

    const search = req.params.search;
    const searchStr = search.split(" ").join("%");
    console.log(searchStr);

    const ar_query = `SELECT * FROM article WHERE article.ar_name LIKE '${"%" + searchStr + "%"}'`;
    let articles;
    let cate = [];
    let chapters = [];
    const numRows = (await query(ar_query)).length;
    const page = parseInt(req.query.page) || 0;
    const numPerPage = 1;
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

    for(let i = 0; i < articles.length; i++){
      let query2 = "SELECT * FROM ar_cat INNER JOIN category ON category.cat_ID = ar_cat.cat_ID WHERE ar_cat.ar_ID = ? ";
      cate[i] = await query(query2, articles[i].ar_ID);
      let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC LIMIT 1";
      chapters[i] = await query(query3, articles[i].ar_ID);
    }


    res.render('search', {title: `Kết quả tìm kiếm`, css: 'article_list', page: 'list', sess, search, articles, cate, chapters, pagination});
  })();
});
router.post('/',  function(req, res, next) {
  (async () => {

    let sess = req.session;  

    const search = req.body.search;
    const searchStr = search.split(" ").join("%");
    console.log(searchStr);

    const ar_query = `SELECT * FROM article WHERE article.ar_name LIKE '${"%" + searchStr + "%"}'`;
    let articles;
    let cate = [];
    let chapters = [];
    const numRows = (await query(ar_query)).length;
    const page = parseInt(req.query.page) || 0;
    const numPerPage = 1;
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

    //TOP ARTICLES
    const top_articles = await query("SELECT count_view.ar_ID, article.ar_name, article.ar_pic, COUNT(count_view.ar_ID) as num FROM count_view INNER JOIN article ON count_view.ar_ID = article.ar_ID WHERE MONTH(count_view.`time`) = MONTH(curdate()) GROUP BY count_view.ar_ID ORDER BY num DESC LIMIT 8;");
    let top_chapter = [];
    for(let i = 0; i < top_articles.length; i++){
      let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC LIMIT 1";
      top_chapter[i] = await query(query3, top_articles[i].ar_ID);
    }
    cur_tag = [{cat_name: "Tất cả truyện", cat_ID: 0}];
    res.render('search', {title: `Kết quả tìm kiếm`, css: 'article_list', page: 'list', sess, search, articles, cate, chapters, pagination});
  })();
});

module.exports = router;
