let express = require('express')
let router = express.Router()
let bcrypt = require('../../utils/bcrypt')
let mgdb = require('../../utils/mgdb')
let jwt = require('../../utils/jwt')

router.post('/',(req,res,next)=>{
  console.log('/login')
  
  let {username,password} = req.body;
  if(!username || !password){
    res.send({
      err: 1,
      msg:'用户密码为必传参数'
    });
    return;
  }

  //兜库
  mgdb.open({
    collectionName:'user'
  }).then(
    ({collection})=>collection.find({username}).toArray((err,result)=>{
      if(err){
        res.send({err:1,msg:'结合操作失败',errMsg:err})
        mgdb.close()
      }else{
        if(result.length>0){
          //校验密码
          let bl = bcrypt.compareSync(password,result[0].password)
          if(bl){
            //登录成功，返回数据  生成token
            let token = jwt.sign({username,_id:result[0]._id})
            // delete result[0].username;
            delete result[0].password;

            //种cookie 备份session
            // req.session['NZ2002']=username+result[0]._id;

            res.send({err:0,msg:'登陆成功',data:result[0],token})
          }else{
            res.send({err:1,msg:'用户名或者密码有误'})
          }
        }else{
          res.send({err:1,msg:'用户名或者密码有误'})
          mgdb.close()
        }
      }
      
    })
  )


})
module.exports=router;