var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');

var con = require('./connection');

const query = util.promisify(con.query).bind(con);

/* GET ARTICLE. */
router.get('/:id', async function(req, res, next) {
  
  try{
    let sess = req.session;
    
    const ID = parseInt(req.params.id);

    let index;
    for(let i = 0; i < sess.articles.length; i++){
      if(sess.articles[i].ar_ID === ID){
        index = i;
        break;
      }
    }
    console.log(sess.chapters[index]);
    
    let cate_list = "";
    for(let i = 0; i < sess.cate[index].length; i++){
      cate_list += await sess.cate[index][i].cat_ID;
      if(i != sess.cate[index].length - 1)cate_list += ", ";
    }
    // console.log(cate_list);
    // let same_cate = [];
    // let same_chapter = [];
    // if(cate_list){
    //   same_cate = await query("SELECT * FROM article, ar_cat WHERE ar_cat.ar_ID = article.ar_ID AND ar_cat.cat_ID IN (" + cate_list + ") AND article.ar_ID <> " +sess.articles[index].ar_ID +" GROUP BY article.ar_ID");
    //   same_chapter = [];
    //   for(let i = 0; i < same_cate.length; i++){
    //     let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC LIMIT 1";
    //     same_chapter[i] = await query(query3, same_cate[i].ar_ID);
    //   }
    // }

  
    const page = parseInt(req.query.page) || 0;
    const numPerPage = 10;
    const last = Math.ceil(sess.chapters[index].length/numPerPage);
    const start = page * numPerPage;
    
    let chapPerPage = [];
    let count = 0;
    for(let i = start; i < ((start + numPerPage) > sess.chapters[index].length ? sess.chapters[index].length:start + numPerPage); i++){
      chapPerPage[count] = sess.chapters[index][i];
      count++;
    }
    const pagination = {
      current: page,
      lastPage: last,
      previous: page > 0 ? page - 1 : 0,
      next: page < (((last - 1) >= 0)?last - 1: 0) ? page + 1 : (((last - 1) >= 0)?last - 1: 0),
      lastItem: (((page + 4 )< last)?page + 4:last)
    }; 
    res.render('article', {title: 'Truyện: ' + sess.articles[index].ar_name, css: 'article', page: 'article', sess, index, chapPerPage, pagination});
    
  }catch (err){
    console.log(err);
    res.render('error', {message: 404});
  }
  
  
});

module.exports = router;
