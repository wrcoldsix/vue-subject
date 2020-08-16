let express = require('express')
let router = express.Router()
let fs = require('fs')
let pathLib = require('path')
let mgdb = require('../../utils/mgdb')
let bcrypt = require('../../utils/bcrypt')

// let xxx = require('系统随机名字一个包')

router.post('/',(req,res,next)=>{
  
  let {username,password,nikename,address,order} = req.body;//昵称为可选  
  // console.log(username,password);
  //username && password必传
  if(!username || !password){
    res.send({err:1,msg:'用户名密码为必传参数'});
    return;
  }
  //完善其他库字段
  nikename =  nikename || '系统生成'; // || xxx()
  address = address || [];
  order = order || [];

  let follow = 0;
  let fans = 0;
  let time = Date.now();//注册时间服务器生成

  let icon = require('../../config/global').normal

  if(req.files && req.files.length>0){
    //改名
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    )
    icon = `${require('../../config/global').user.uploadUrl}${req.files[0].filename + pathLib.parse(req.files[0].originalname).ext}`
  }

  //校验+入口
  mgdb.open({collectionName:'user'})
    .then(
      ({collection})=>collection.find({username}).toArray((err,result)=>{
        if(err){
          res.send({err:1,msg:'集合操作失败-reg'})
          mgdb.close()
        }else{
          if(result.length>0){
            if(!icon.includes('default.jpg')){
              fs.unlinkSync('./public' + icon)
            }
            res.send({err:1,msg:'用户名已存在'})
            mgdb.close()
          }else{
            //密码加密 入口
            password = bcrypt.hashSync(password)

            collection.insertOne({
              username,password,nikename,fans,follow,time,icon,address,order
            },(err,result)=>{
              if(!err){

                //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                delete result.ops[0].username
                delete result.ops[0].password
                res.send({err:0,msg:'注册成功',data:result.ops[0]})
              }else{
                res.send({err:1,msg:'集合操作失败-reg2'})
              }
              mgdb.close()
            })


          }
        }
      })
    )


})

module.exports=router;