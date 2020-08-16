let express = require('express')
let router = express.Router()

//session的注册

router.get('/',(req,res,next)=>{
  req.session['NZ2002'] = undefined;
  res.send({err:0,msg:'注销成功'})
})
module.exports=router;