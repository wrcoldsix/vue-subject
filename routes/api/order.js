let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')

/* router.get('/',(req,res,next)=>{
  console.log('detail',req.body)
}) */

router.post('/', (req, res, next) => {
  // console.log('/api/other/xxx')
  let {username,order}=req.body;
  //有传id，跳转到/:othername/:id接口 
  // if (req.query._id) {
  //   res.redirect(`/api/other/${req.params.othername}/${req.params._id}`)
  //   return;
  // }
  if(!username){
    res.send({err:1,msg:'用户名为必传参数'});
    return;
  }
  //查询列表
  // let collectionName = req.params.othername;//要操作的集合
  // let { _page, _limit, _sort, q } = req.query;

  // mgdb.findList({
  //   collectionName,_page,_limit,_sort,q
  // }).then(
  //   result => res.send(result)
  // ).catch(
  //   err => res.send(err)
  // )
  mgdb.open({collectionName:'user'})
    .then(
      ({collection})=>collection.find({username}).toArray((err,result)=>{
        if(err){
          res.send({err:1,msg:'集合操作失败-reg'})
          mgdb.close()
        }else{
          if(result.length<=0){
            res.send({err:1,msg:'用户不存在'})
            mgdb.close()
          }else{
            //密码加密 入口
            // password = bcrypt.hashSync(password)

            collection.updateOne({"username":username},
              {$push:{"order":order}},
              {upsert:true},(err,result)=>{
              if(!err){

                //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                // delete result.ops[0].username
                // delete result.ops[0].password
                res.send({err:0,msg:'订单操作成功'})
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

router.get('/:othername/:_id', (req, res, next) => {
  //处理详情
  let collectionName=req.params.othername;
  let _id = req.params._id;

  mgdb.findDetail({
    collectionName,_id
  }).then(
    result => res.send(result)
  ).catch(
    err=>res.send(err)
  )

})

module.exports = router;