let jwt = require('jsonwebtoken')
let rule = 'NZ2002';

module.exports={
  //生成签名
  sign:({username,_id})=>{
    return jwt.sign({username,_id},rule,{expiresIn: 60 * 60 * 24})
  },
  //校验签名
  verify:(token)=>new Promise((resolve,reject)=>{
    jwt.verify(token,rule,(err,decode)=>{
      if(!err){
        resolve({
          err:0,
          msg:'校验成功',
          data:decode
        })
      }else{
        reject({
          err: 2,
          msg: 'token校验失败，或者过期'
        })
      }
    })
  })
}