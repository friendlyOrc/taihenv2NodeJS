var express = require('express');
var fs = require('fs');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');
var busboy = require('connect-busboy');
var path = require('path');
const multer = require("multer");
var mkdirp = require('mkdirp');
var rimraf = require("rimraf");
// var aws = require('aws-sdk');

const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

var con = require('./connection');

const query = util.promisify(con.query).bind(con);

// aws.config.region = 'ap-southeast-1';

// var credentials = new aws.SharedIniFileCredentials();
// aws.config.credentials = credentials;

/* GET SUB ADMIN. */

router.use('/', function(req, res, next){
  let sess = req.session;
  let user =  sess.user,
  userID = sess.userID;
  
  if(userID == null){
    res.redirect('/login');
    return;
  }
  next();
})

router.get('/', function(req, res, next) {
  (async () => {
    let sess = req.session;
    if(!sess.account){
      sess.articles = await query('SELECT * FROM article ORDER BY article.ar_ID DESC');
      sess.cate = [];
      sess.chapters = [];
      for(let i = 0; i < sess.articles.length; i++){
        let query2 = "SELECT * FROM ar_cat INNER JOIN category ON category.cat_ID = ar_cat.cat_ID WHERE ar_cat.ar_ID = ? ";
        sess.cate[i] = await query(query2, sess.articles[i].ar_ID);
        let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC";
        sess.chapters[i] = await query(query3, sess.articles[i].ar_ID) || [];
      }
      sess.category = await query("SELECT * FROM category");
      sess.account = await query("SELECT * FROM account");
      sess.view = await query("SELECT * FROM count_view");
    }

    res.render('admin', {title: 'Admin', css: 'admin', page: 'sub_admin', sess});
    res.redirect('/admin/user');
  })();
});

// USER
router.get('/user', function(req, res, next){
  let sess = req.session;
  res.render('admin', {title: 'User', css: 'admin', page: 'user', sess});
});

//ADD USER 
router.get('/add_user', function(req, res, next){
  let sess = req.session;
  res.render('admin', {title: 'Add user', css: 'admin', page: 'add_user', sess, message: ''});
});

// POST ADD USER
router.post('/add_user', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    let acc = req.body.mail;
    let pass = req.body.pass;
    let repass = req.body.repass;
    if(acc && pass && repass){
      let rs = await query(`SELECT * FROM account WHERE email = '${acc}'`);
      if(rs.length){
        mess = 'wrong';
        res.render('admin', {title: 'Thêm User', css: 'admin', page: 'add_user',sess, message: mess});
      }else{
        if(pass !== repass){
          mess = 'pass';
          res.render('admin', {title: 'Thêm User', css: 'admin', page: 'add_user', sess, message: mess});
        }else{
          const ID = parseInt(sess.account[sess.account.length - 1].accID) + 1;
          await query(`INSERT INTO account (accID, email, password) VALUES (${ID}, '${acc}', '${pass}')`);
          mess = 'accept';
          sess.account = await query('SELECT * FROM account');
          res.render('admin', {title: 'Thêm User', css: 'admin', page: 'add_user', sess, message: mess});
        }
        
      }
    }else{
      mess = 'empty';
      res.render('admin', {title: 'Thêm User', css: 'admin', page: 'add_user', sess, message: mess});
    }
  })();
});

//DELETE USER
router.get('/delete_user', function(req, res, next){
  (async () => {
    let sess = req.session;

    const ID = req.query.id;

    await query("DELETE FROM account WHERE accID = " + ID);
    sess.account = await query('SELECT * FROM account');
    
    res.redirect('/admin/user');
  })();
});

//EDIT USER
router.get('/edit_user/:id', function(req, res, next){
  (async () => {
    let sess = req.session;
    const mess = req.query.mess || '';
    const user_ID = req.params.id;
    const cur_user = await query("SELECT * FROM account WHERE accID = " + user_ID);
    res.render('admin', {title: 'Edit user', css: 'admin', page: 'edit_user', sess, message: mess, cur_user, user_ID});
    
  })();
});

// POST EDIT USER
router.post('/edit_user/:id', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    let acc = req.body.mail;
    let pass = req.body.pass;
    let repass = req.body.repass;
    let user_ID = req.params.id;

    const cur_user = await query("SELECT * FROM account WHERE accID = " + user_ID);

    if(acc && pass && repass){
      let rs = await query(`SELECT * FROM account WHERE email = '${acc}'`);
      if(rs.length && acc !== cur_user[0].email){
        res.redirect(`/admin/edit_user/${user_ID}?mess=wrong`);
      }else{
        if(pass !== repass){
          res.redirect(`/admin/edit_user/${user_ID}?mess=pass`);
        }else{
          await query(`UPDATE account SET email = '${acc}', password = '${pass}' WHERE accID = ${user_ID}`);

          sess.account = await query('SELECT * FROM account');
          res.redirect(`/admin/edit_user/${user_ID}?mess=accept`);
        }
        
      }
    }else{
      res.redirect(`/admin/edit_user/${user_ID}?mess=empty`);
    }
  })();
});

// CATEGORY 
router.get('/category', function(req, res, next){
  let sess = req.session;
  
  const numRows = sess.category.length;
  const page = parseInt(req.query.page) || 0;
  const numPerPage = 10;
  const last = Math.ceil(numRows/numPerPage);
  const start = page * numPerPage;
  
  const pagination = {
    start: start,
    end: (start + numPerPage) < numRows ? start + numPerPage : numRows,
    current: page,
    lastPage: last,
    previous: page > 0 ? page - 1 : 0,
    next: page < (((last - 1) >= 0)?last - 1: 0) ? page + 1 : (((last - 1) >= 0)?last - 1: 0),
    lastItem: (((page + 4 )< last)?page + 4:last)
  };
  res.render('admin', {title: 'Category', css: 'admin', page: 'category', sess, pagination});
});

// ADD CATEGORY 
router.get('/add_category', function(req, res, next){
  let sess = req.session;
  res.render('admin', {title: 'Thêm Category', css: 'admin', page: 'add_category', sess, message: ''});
});

// POST ADD CATE
router.post('/add_category', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    let name = req.body.cat_name;
    let des = req.body.cat_des;
    if(name && des){
      let rs = await query(`SELECT * FROM category WHERE cat_name = '${name}'`);
      if(rs.length){
        mess = 'wrong';
        res.render('admin', {title: 'Thêm Category', css: 'admin', page: 'add_category',sess, message: mess});
      }else{
        const ID = parseInt(sess.category[sess.category.length - 1].cat_ID) + 1;
        await query(`INSERT INTO category (cat_ID, cat_name, cat_des) VALUES (${ID}, '${name}', '${des}')`);
        mess = 'accept';
        sess.category = await query('SELECT * FROM category');
        res.render('admin', {title: 'Thêm Category', css: 'admin', page: 'add_category', sess, message: mess});
      }
    }else{
      mess = 'empty';
      res.render('admin', {title: 'Thêm Category', css: 'admin', page: 'add_category', sess, message: mess});
    }
  })();
});

//DELETE CATEGORY
router.get('/delete_category', function(req, res, next){
  (async () => {
    let sess = req.session;
    const ID = req.query.id;

    await query("DELETE FROM category WHERE cat_ID = " + ID);
    sess.category = await query('SELECT * FROM category');
    
    res.redirect('/admin/category');
  })();
});

//EDIT CATEGORY
router.get('/edit_category/:id', function(req, res, next){
  (async () => {
    let sess = req.session;
    const mess = req.query.mess || '';
    const cat_ID = req.params.id;
    const cur_cat = await query("SELECT * FROM category WHERE cat_ID = " + cat_ID);
    res.render('admin', {title: 'Edit user', css: 'admin', page: 'edit_category', sess, message: mess, cur_cat, cat_ID});
    
  })();
});

// POST EDIT CATEGORY
router.post('/edit_category/:id', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    let name = req.body.cat_name;
    let des = req.body.cat_des;

    let cat_ID = req.params.id;

    const cur_cat = await query("SELECT * FROM category WHERE cat_ID = " + cat_ID);

    if(name && des){
      let rs = await query(`SELECT * FROM category WHERE cat_name = '${name}'`);
      if(rs.length && name !== cur_cat[0].cat_name){
        res.redirect(`/admin/edit_category/${cat_ID}?mess=wrong`);
      }else{
        await query(`UPDATE category SET cat_name = '${name}', cat_des = '${des}' WHERE cat_ID = ${cat_ID}`);

        sess.category = await query('SELECT * FROM category');
        res.redirect(`/admin/edit_category/${cat_ID}?mess=accept`);
      }
    }else{
      res.redirect(`/admin/edit_category/${cat_ID}?mess=empty`);
    }
  })();
});

// ARTICLES
router.get('/articles', function(req, res, next){
  let sess = req.session;

  const numRows = sess.articles.length;
  const page = parseInt(req.query.page) || 0;
  const numPerPage = 10;
  const last = Math.ceil(numRows/numPerPage);
  const start = page * numPerPage;
  
  const pagination = {
    start: start,
    end: (start + numPerPage) < numRows ? start + numPerPage : numRows,
    current: page,
    lastPage: last,
    previous: page > 0 ? page - 1 : 0,
    next: page < (((last - 1) >= 0)?last - 1: 0) ? page + 1 : (((last - 1) >= 0)?last - 1: 0),
    lastItem: (((page + 4 )< last)?page + 4:last)
  };
  res.render('admin', {title: 'Articles', css: 'admin', page: 'articles', sess, pagination});
});

// ADD articles 
router.get('/add_article', function(req, res, next){
  let sess = req.session;

  res.render('admin', {title: 'Thêm article', css: 'admin', page: 'add_article', sess, message: ''});
});

// POST ADD articles
router.post('/add_article', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    console.log(req.files);
    const name = req.body.name;
    const des = req.body.des;
    let pic = req.files;
    if(pic) pic = req.files.pic;
    const stt = req.body.stt;
    const cate = req.body.cate;

    console.log(req.body);

    if(name && des && pic && stt && cate){
      let rs = await query(`SELECT * FROM article WHERE ar_name = '${name}'`);
      if(rs.length){
        mess = 'wrong';
        res.render('admin', {title: 'Thêm Article', css: 'admin', page: 'add_article',sess, message: mess});
      }else{
        let ID;
        if(sess.articles.length > 0)
          ID = parseInt(sess.articles[0].ar_ID) + 1;
        else ID = 1;
        pic.mv(path.join(`${__dirname}/../public/images/article/${pic.name}`), function(err) {
          if (err)
            return res.status(500).send(err);
        });


        await query(`INSERT INTO article (ar_ID, ar_name, ar_des, ar_pic, ar_chap_num, ar_view, ar_date, ar_stt) VALUES (${ID}, '${name}', '${des}', '${pic.name}', '0', '0', utc_date(), ${stt})`);
        mess = 'accept';
        sess.articles = await query('SELECT * FROM article ORDER BY ar_ID DESC');
        for(let cat of cate){
          await query(`INSERT INTO ar_cat (ar_ID, cat_ID) VALUES (${ID}, ${cat})`);
        }
        sess.cate = [];
        sess.chapters = [];
        for(let i = 0; i < sess.articles.length; i++){
          let query2 = "SELECT * FROM ar_cat INNER JOIN category ON category.cat_ID = ar_cat.cat_ID WHERE ar_cat.ar_ID = ? ";
          sess.cate[i] = await query(query2, sess.articles[i].ar_ID);
          let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC";
          sess.chapters[i] = await query(query3, sess.articles[i].ar_ID) || [];
        }
        fs.mkdir(path.join(`${__dirname}/../public/images/chapter/${ID}`), function(err) { 
          if(err){
            console.log(err);
          }
        });
        res.render('admin', {title: 'Thêm Article', css: 'admin', page: 'add_article', sess, message: mess});
      }
    }else{
      mess = 'empty';
      res.render('admin', {title: 'Thêm Article', css: 'admin', page: 'add_article', sess, message: mess});
    }
  })();
});

//DELETE ARTICLE
router.get('/delete_article', function(req, res, next){
  (async () => {
    let sess = req.session;
    
    const ID = parseInt(req.query.id);

    let index;
    for(let i = 0; i < sess.articles.length; i++){
      if(sess.articles[i].ar_ID === ID){
        index = i;
        break;
      }
    }

    let ar_path = path.join(`${__dirname}/../public/images/chapter/${sess.articles[index].ar_ID}`);
    let pic_path = path.join(`${__dirname}/../public/images/article/${sess.articles[index].ar_pic}`);
    fs.unlink(pic_path, (err) => {
      if(err) console.log(err);
      else console.log(`Delete ${pic_path}`);
    });
    rimraf(ar_path, (err) => {
      if(err) console.log(err);
      else console.log(`Delete ${ar_path}`);
    });

    await query("DELETE FROM count_view WHERE ar_ID = " + ID);
    await query("DELETE FROM chapter WHERE ar_ID = " + ID);
    await query("DELETE FROM ar_cat WHERE ar_ID = " + ID);
    await query("DELETE FROM article WHERE ar_ID = " + ID);
    sess.articles = await query('SELECT * FROM article ORDER BY ar_ID DESC');
    
    res.redirect('/admin/articles');
  })();
});

//EDIT ARTICLE
router.get('/edit_article/:id', function(req, res, next){
  (async () => {
    let sess = req.session;
    const mess = req.query.mess || '';
    const ar_ID = req.params.id;
    const cur_ar = await query("SELECT * FROM article WHERE ar_ID = " + ar_ID);
    const cur_ar_cat = await query("SELECT * FROM ar_cat WHERE ar_ID = " + ar_ID);
    let ar_cat = [];
    for(let i = 0; i < cur_ar_cat.length; i++){
      ar_cat[i] = cur_ar_cat[i].cat_ID;
    }

    res.render('admin', {title: 'Edit Article', css: 'admin', page: 'edit_article', sess, message: mess, cur_ar, ar_ID, ar_cat});
    
  })();
});

// POST EDIT ARTICLE
router.post('/edit_article/:id', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    const name = req.body.name;
    const des = req.body.des;
    let pic = req.files;
    if(pic) pic = req.files.pic;
    const stt = req.body.stt;
    const cate = req.body.cate;
    const ar_ID = req.params.id;
    const cur_ar = await query("SELECT * FROM article WHERE ar_ID = " + ar_ID);


    if(name && des && stt && cate){
      let rs = await query(`SELECT * FROM article WHERE ar_name = '${name}'`);
      if(rs.length && name !== cur_ar[0].ar_name){
        res.redirect(`/admin/edit_article/${ar_ID}?mess=wrong`);
      }else{
        if(name !== cur_ar[0].ar_name) {
          await query(`UPDATE article SET ar_name = '${name}' WHERE ar_ID = ${ar_ID}`);
          
        }
        if(des !== cur_ar[0].ar_des)
          await query(`UPDATE article SET ar_des = '${des}' WHERE ar_ID = ${ar_ID}`);
        if(stt !== cur_ar[0].ar_stt)
          await query(`UPDATE article SET ar_stt = ${stt} WHERE ar_ID = ${ar_ID}`);
        if(pic){
          await query(`UPDATE article SET ar_pic = '${pic.name}' WHERE ar_ID = ${ar_ID}`);
          pic.mv(path.join(`${__dirname}/../public/images/article/${pic.name}`), function(err) {
            if (err)
              return res.status(500).send(err);
          });
          fs.unlink(path.join(`${__dirname}/../public/images/article/${cur_ar[0].ar_pic}`), (err) => {
            if(err) console.log(err);
            else console.log(`Delete`);
          });
        }
        
        await query("DELETE FROM ar_cat WHERE ar_ID = " + ar_ID);
        for(let cat of cate){
          await query(`INSERT INTO ar_cat (ar_ID, cat_ID) VALUES (${ar_ID}, ${cat})`);
        }

        sess.articles = await query('SELECT * FROM article ORDER BY ar_ID DESC');

        sess.cate = [];
        sess.chapters = [];
        for(let i = 0; i < sess.articles.length; i++){
          let query2 = "SELECT * FROM ar_cat INNER JOIN category ON category.cat_ID = ar_cat.cat_ID WHERE ar_cat.ar_ID = ? ";
          sess.cate[i] = await query(query2, sess.articles[i].ar_ID);
          let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC";
          sess.chapters[i] = await query(query3, sess.articles[i].ar_ID) ;
        }
        res.redirect(`/admin/edit_article/${ar_ID}?mess=accept`);
      }
    }else{
      res.redirect(`/admin/edit_article/${ar_ID}?mess=empty`);
    }
  })();
});


//CHAPTER
router.get('/articles/chapters', function(req, res, next){
  let sess = req.session;
  let user =  sess.user,
  userID = sess.userID;

  if(userID == null){
    res.redirect('/login');
    return;
  }
  const id = parseInt(req.query.id);
  let index;
  for(let i = 0; i < sess.articles.length; i++){
    if(sess.articles[i].ar_ID === id){
      index = i;
      break;
    }
  }
  console.log(index);
  const numRows = sess.chapters[index].length || 0;
  const page = parseInt(req.query.page) || 0;
  const numPerPage = 10;
  const last = Math.ceil(numRows/numPerPage);
  const start = page * numPerPage;
  
  const pagination = {
    start: start,
    end: (start + numPerPage) < numRows ? start + numPerPage : numRows,
    current: page,
    lastPage: last,
    previous: page > 0 ? page - 1 : 0,
    next: page < (((last - 1) >= 0)?last - 1: 0) ? page + 1 : (((last - 1) >= 0)?last - 1: 0),
    lastItem: (((page + 4 )< last)?page + 4:last)
  };
  console.log(pagination);
  res.render('admin', {title: sess.articles[index].ar_name + " - Chapters", css: 'admin', page: 'chapters', sess, pagination, index});
});

//DELETE CHAPTER
router.get('/delete_chapter', function(req, res, next){
  (async () => {
    let sess = req.session;

    const ID = req.query.id;
    const index = req.query.index;

    let chap_path = path.join(`${__dirname}/../public/images/chapter/${sess.articles[index].ar_ID}/${ID}`)
    rimraf(chap_path, (err) => {
      if(err) console.log(err);
      else console.log(`Delete ${chap_path}`);
    });

    await query(`DELETE FROM chapter WHERE chap_ID = ${ID} AND ar_ID = ${sess.articles[index].ar_ID}`);

    let count = parseInt(sess.articles[index].ar_chap_num) - 1;
    await query(`UPDATE article SET ar_chap_num = ${count} WHERE ar_ID = ${sess.articles[index].ar_ID}`);
    sess.articles = await query('SELECT * FROM article ORDER BY ar_ID DESC');
    sess.chapters[index] = await query('SELECT * FROM chapter WHERE ar_ID = ' + sess.articles[index].ar_ID + ' ORDER BY chap_ID DESC');
    
    res.redirect('/admin/articles/chapters?id=' + sess.articles[index].ar_ID);
  })();
});

// ADD chapter 
router.get('/add_chapter/:id', function(req, res, next){
  let sess = req.session;
  let ar_id = req.params.id;

  let mess = req.query.mess || '';
  res.render('admin', {title: 'Thêm chapter', css: 'admin', page: 'add_chapter', sess, message: mess, ar_id});
});

// POST ADD chapter
router.post('/add_chapter/:id', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    const name = req.body.name;
    const ar_id = parseInt(req.params.id);
    let pic = req.files;
    // console.log(pic);

    let page_num;
    if(pic) page_num = pic['many-files'].length || 1;
    let index;

    for(let i = 0; i < sess.articles.length; i++){
      if(sess.articles[i].ar_ID === ar_id){
        index = i;
        break;
      }
    }

    if(name && pic){
      let rs = await query(`SELECT * FROM chapter WHERE chap_name = '${name}' AND ar_ID = ${ar_id}`);
      if(rs.length){
        res.redirect(`/admin/add_chapter/${ar_id}?mess=wrong`);
      }else{
        let ID;
        if(sess.chapters[index][0]){
          ID = parseInt(sess.chapters[index][0].chap_ID) + 1;
        }else {
          ID = 1;
        }

        
        let chap_path = path.join(`${__dirname}/../public/images/chapter/${sess.articles[index].ar_ID}/${ID}`);
        fs.mkdir(`public/images/chapter/${sess.articles[index].ar_ID}/${ID}`, function(err) { 
          if(err){
            console.log(err);
          }
          console.log(chap_path);
        });
        for(let i = 0;i < page_num; i++){
          console.log(pic['many-files'][i]);
          let img = pic['many-files'][i];
          img.mv(path.join(`${__dirname}/../public/images/chapter/${sess.articles[index].ar_ID}/${ID}/${img.name}`), function(err) {
            if (err)
             console.log(err);
          });
        }
        
        console.log(name, page_num, ar_id, ID);

        await query(`INSERT INTO chapter (chap_ID, ar_ID, chap_name, chap_page, chap_date) VALUES (${ID}, ${ar_id}, '${name}', '${page_num}', utc_date())`);
        
        let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC";
        sess.chapters[index] = await query(query3, sess.articles[index].ar_ID);

        let cur_ar = await query("SELECT * FROM article WHERE ar_ID = " + ar_id);
        let count = parseInt(cur_ar[0].ar_chap_num) + 1;
        await query(`UPDATE article SET ar_chap_num = ${count} WHERE ar_ID = ${ar_id}`);
        await query(`UPDATE article SET ar_date = utc_date() WHERE ar_ID = ${ar_id}`);

        sess.articles = await query('SELECT * FROM article ORDER BY ar_ID DESC');

        res.redirect(`/admin/add_chapter/${ar_id}?mess=accept`);
      }
    }else{
      res.redirect(`/admin/add_chapter/${ar_id}?mess=empty`);
    }
  })();
});

// EDIT chapter 
router.get('/edit_chapter/:ar_id/:chap_id', function(req, res, next){
  (async () => {
    let sess = req.session;
    let ar_ID = req.params.ar_id;
    let chap_ID = req.params.chap_id;

    const cur_chap = await query(`SELECT * FROM chapter WHERE chap_id = ${chap_ID} AND ar_ID = ${ar_ID}`)

    let mess = req.query.mess || '';
    res.render('admin', {title: 'Edit chapter', css: 'admin', page: 'edit_chapter', sess, message: mess, cur_chap});
  })();
});

// POST ADD chapter
router.post('/edit_chapter/:ar_id/:chap_id', function(req, res, next){
  (async () =>{
    let mess = '';
    let sess = req.session;

    const name = req.body.name;
    let ar_ID = req.params.ar_id;
    let chap_ID = req.params.chap_id;

    const cur_chap = await query(`SELECT * FROM chapter WHERE chap_id = ${chap_ID} AND ar_ID = ${ar_ID}`)
    
    if(name){
      let rs = await query(`SELECT * FROM chapter WHERE chap_name = '${name}' AND ar_ID = ${ar_ID}`);
      if(rs.length && name !== cur_chap[0].chap_name){
        res.redirect(`/admin/edit_chapter/${ar_ID}/${chap_ID}?mess=wrong`);
      }else{
        
        await query(`UPDATE chapter SET chap_name = '${name}' WHERE chap_ID = ${chap_ID}`);
        for(let i = 0; i < sess.articles.length; i++){
          let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC";
          sess.chapters[i] = await query(query3, sess.articles[i].ar_ID) || [];
        }

        res.redirect(`/admin/edit_chapter/${ar_ID}/${chap_ID}?mess=accept`);
      }
    }else{
      res.redirect(`/admin/edit_chapter/${ar_ID}/${chap_ID}?mess=empty`);
    }
  })();
});

//LOG OUT
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/login');
  return;
});


// router.get('/test', function(req, res, next){
//   res.render('test');
// });

router.get('/test', function(req, res, next){
  if(req.query['file-name']){
    res.render('/test');
  }else{
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: 'taihen',
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://taihen.s3.amazonaws.com/${fileName}`
      };
      console.log(JSON.stringify(returnData));
      res.end();
    });
  }
});



module.exports = router;
