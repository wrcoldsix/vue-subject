let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')

router.get('/',(req,res,next)=>{
  // console.log('1',req.query.decode.data.username)

  mgdb.open({collectionName:'user'})
    .then(
      ({collection,ObjectId})=>{
        collection.find({
          username: req.query.decode.data.username,
          _id: ObjectId(req.query.decode.data._id)
        }).toArray((err,result)=>{
          if(err){
            res.send({err:1,msg:'集合操作失败-user'})
          }else{
            if(result.length>0){
              delete result[0].username
              delete result[0].password
              res.send({err:0,msg:'登陆成功',data:result[0]})
            }else{
              res.send({err:1,msg:'获取用户数据失败'})
            }
          }
          mgdb.close()
        })
      }
    )

})
module.exports=router;