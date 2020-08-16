//引入各种包
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();//实例化一个应用
let cors = require('cors');

//安装中间件
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



//上传的文件体，分发到不同位置
let multer  = require('multer');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user') !== -1 || req.url.indexOf('reg') !== -1){
      cb(null, path.join(__dirname,'public','upload','user'))
    }else if(req.url.indexOf('banner') !== -1){
      cb(null, path.join(__dirname,'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname,'public','upload','product'))
    }
    
  }
})
let objMulter = multer({ storage});

app.use(objMulter.any());  //允许上传什么类型文件,any 代表任何类型 

//静态资源托管   接口的权重比资源托管 高

// app.use(express.static(path.join(__dirname, 'dist','views')));
app.use(express.static(path.join(__dirname, 'public','template')));
// app.use('/bulala',express.static(path.join(__dirname, 'public','admin')));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  //允许所有前端域名
  "origin": ["http://127.0.0.1:8848","http://localhost:5000"],  
  "credentials":true,//允许携带凭证
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
  "allowedHeaders":['Content-Type','Authorization','token']//被允许的post方式的请求头
}));

//客户端接口
app.all('/api/*',require('./routes/api/params'));//处理api一下所有的公共参数
app.use('/api/goods', require('./routes/api/goods'));
app.use('/api/reg', require('./routes/api/reg'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/other', require('./routes/api/other'));
app.use('/api/order', require('./routes/api/order'));




//服务端接口

//代理端接口

//推送端接口

// 处理404
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
  if(req.url.includes('/api')){//你再访问一个不存在的api/不存在
    res.send({err:1,msg:'不存在的接口'})
  }else if(req.url.includes('/admin')){
    res.render('error');
  }else{ //解决 vue项目部署后的问题

  }
 
});

module.exports = app;
