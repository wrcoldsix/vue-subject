let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')

/* router.get('/',(req,res,next)=>{
  console.log('detail',req.body)
}) */

router.post('/:othername', (req, res, next) => {
  // console.log('/api/other/xxx')
  //有传id，跳转到/:othername/:id接口 
  if (req.query._id) {
    res.redirect(`/api/other/${req.params.othername}/${req.params._id}`)
    return;
  }
  let {username,address,order,paying,receiveing,addressE,code,nikename,icon}=req.body;

  if(!username){
    res.send({err:1,msg:'用户名为必传参数'});
    return;
  }
  address=address||[];
  addressE=addressE||[];
  order=order||[];
  paying=paying===false?false:true;
  receiveing=receiveing===false?false:true;
  nikename=nikename||'';
  console.log(addressE.name);
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
            if(nikename!=''){
                collection.updateOne({"username":username},
                {$set:{'nikename':nikename,'icon':icon}},
                {upsert:true},(err,result)=>{
                if(!err){

                  //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                  res.send({err:0,msg:'地址操作成功'})
                }else{
                  res.send({err:1,msg:'集合操作失败-reg2'})
                }
                mgdb.close()
              })
            }
            if(address.length!=0){
              collection.updateOne({"username":username},
              {$push:{'address':address}},
              {upsert:true},(err,result)=>{
              if(!err){

                //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                res.send({err:0,msg:'地址操作成功'})
              }else{
                res.send({err:1,msg:'集合操作失败-reg2'})
              }
              mgdb.close()
            })
            }else if(addressE.length!=0){
              collection.updateOne({"username":username,"address.id":code},
              {$set:{'address.$.name':addressE.name,'address.$.phone':addressE.phone,'address.$.address':addressE.address}},
              {projection:true},(err,result)=>{
              if(!err){

                //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                res.send({err:0,msg:'地址操作成功'})
              }else{
                res.send({err:1,msg:'集合操作失败-reg2'})
              }
              mgdb.close()
            })
            }else if(order.length!=0){
              collection.updateOne({"username":username},
              {$push:{'order':order}},
              {upsert:true},(err,result)=>{
              if(!err){

                //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                res.send({err:0,msg:'订单操作成功'})
              }else{
                res.send({err:1,msg:'集合操作失败-reg2'})
              }
              mgdb.close()
            })
            }
            else if(paying===false){
              collection.updateOne({"username":username,"order.id":'paying'},
              {$set:{"order.$.code.paying":false,"order.$.code.receiveing":true}},
              {projection:true},(err,result)=>{
              if(!err){
                //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                res.send({err:0,msg:'订单操作成功'})
              }else{
                res.send({err:1,msg:'集合操作失败-reg2',err1:err})
              }
              mgdb.close()
            })
            }
            else if(receiveing===false){
                collection.updateOne({"username":username,"order.id":'receiveing'},
                {$set:{"order.$.code.receiveing":false,"order.$.code.finished":true}},
                {projection:true},(err,result)=>{
                if(!err){
                  //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                  res.send({err:0,msg:'订单操作成功'})
                }else{
                  res.send({err:1,msg:'集合操作失败-reg2'})
                }
                mgdb.close()
              })
            }
          }
        }
      })
    )
})

router.post('/:othername/:_id', (req, res, next) => {
  //处理详情
  // let collectionName=req.params.othername;
  // let _id = req.params._id;
  let {username,nikename}=req.body;

  if(!username){
    res.send({err:1,msg:'用户名未必传参数'});
    return;
  }
  nikename=nikename||'系统生成';
  // address=address||{};
  // order=order||{};
  let icon = require('../../config/global').normal;
  if(req.files && req.files.length>0){
    //改名
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    )
    icon = `${require('../../config/global').user.uploadUrl}${req.files[0].filename + pathLib.parse(req.files[0].originalname).ext}`
  }
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
              {$push:{'nikename':nikename,'icon':icon}},
              {upsert:true},(err,result)=>{
              if(!err){

                //插入后通过ops娶到插入后的数据，含_id ,删除username,password
                res.send({err:0,msg:'操作成功'})
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

module.exports = router;