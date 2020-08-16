let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')

/* router.get('/',(req,res,next)=>{
  console.log('ipones',req.body)
}) */

router.get('/:iponename', (req, res, next) => {
  // console.log('/api/ipones/xxx')

  //有传id，跳转到/:iponesname/:id接口 
  if (req.query._id) {
    res.redirect(`/api/ipone/${req.params.iponename}/${req.params._id}`)
    return;
  }
  
  //查询列表
  let collectionName = req.params.iponename;//要操作的集合
  let { _page, _limit, _sort, q } = req.query;

  mgdb.findList({
    collectionName,_page,_limit,_sort,q
  }).then(
    result => res.send(result)
  ).catch(
    err => res.send(err)
  )
})

router.get('/:iponename/:_id', (req, res, next) => {
  //处理详情
  let collectionName=req.params.iponename;
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