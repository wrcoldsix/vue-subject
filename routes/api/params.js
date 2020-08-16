let jwt = require('../../utils/jwt')
module.exports=(req,res,next)=>{
  //处理公共请求参数  address !address  headers

  //address
  req.query._page = req.query._page ? req.query._page-0 : require('../../config/global')._page-0;
  req.query._limit = req.query._limit ? req.query._limit-0 : require('../../config/global')._limit-0;
  req.query.q = req.query.q ? req.query.q+'' : require('../../config/global').q+'';
  req.query._sort = req.query._sort ? req.query._sort+'' : require('../../config/global')._sort+'';

  //!address
  req.body._page = req.body._page ? req.body._page-0 : require('../../config/global')._page-0;
  req.body._limit = req.body._limit ? req.body._limit-0 : require('../../config/global')._limit-0;
  req.body.q = req.body.q ? req.body.q+'' : require('../../config/global').q+'';
  req.body._sort = req.body._sort ? req.body._sort+'' : require('../../config/global')._sort+'';

  //headers
  req.headers._page = req.headers._page ? req.headers._page-0 : require('../../config/global')._page-0;
  req.headers._limit = req.headers._limit ? req.headers._limit-0 : require('../../config/global')._limit-0;
  req.headers.q = req.headers.q ? req.headers.q+'' : require('../../config/global').q+'';
  req.headers._sort = req.headers._sort ? req.headers._sort+'' : require('../../config/global')._sort+'';

  //处理公共授权业务

  if(/login|reg|logout/.test(req.url)){
    //无需携带token
    next()
  }else{
    //校验token
    let token = req.query.token || req.body.token || req.headers.token;

    jwt.verify(token).then(
      result => {
        req.query.decode=result;//校验通过，把解密后的token捆绑在req上
        next()
      }
    ).catch(
      err => res.send(err)
    )

  }

  
}