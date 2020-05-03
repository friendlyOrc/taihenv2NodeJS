var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var busboy = require('connect-busboy');
const fileUpload = require('express-fileupload');
var mkdirp = require('mkdirp');
var util = require('util');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var arListRouter = require('./routes/article_list');
var arRouter = require('./routes/article');
var cateRouter = require('./routes/category');
var chapterRouter = require('./routes/chapter');
var search = require('./routes/search');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login')



var app = express();

// default options
app.use(fileUpload());
// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: true }))
var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


var con = require('./routes/connection');

const query = util.promisify(con.query).bind(con);

app.use('/', function(req, res, next){
  (async () => {
    let sess = req.session;
    if(!sess.articles){
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

      sess.hot_articles = await query('SELECT * FROM article ORDER BY article.ar_view DESC LIMIT 6');
      sess.hot_chapter = [];
      for(let i = 0; i < sess.hot_articles.length; i++){
        let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC LIMIT 1";
        sess.hot_chapter[i] = await query(query3, sess.hot_articles[i].ar_ID);
      }
      
      sess.top_articles = await query("SELECT count_view.ar_ID, article.ar_name, article.ar_date, article.ar_pic, COUNT(count_view.ar_ID) as num FROM count_view INNER JOIN article ON count_view.ar_ID = article.ar_ID WHERE MONTH(count_view.`time`) = MONTH(curdate()) GROUP BY count_view.ar_ID ORDER BY num DESC LIMIT 12;");
      sess.top_chapter = [];
      for(let i = 0; i < sess.top_articles.length; i++){
        let query3 = "SELECT * from chapter WHERE chapter.ar_ID = ? ORDER BY chapter.chap_ID DESC LIMIT 1";
        sess.top_chapter[i] = await query(query3, sess.top_articles[i].ar_ID);
      }
    }
    // console.log(sess.category);

    next();
    
  })();
});
app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/category', cateRouter);
app.use('/article_list', arListRouter);
app.use('/article', arRouter);
app.use('/chapter', chapterRouter);
app.use('/search', search);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
