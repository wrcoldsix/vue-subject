module.exports = {

  //用户端接口参数
  _page: 0,
  _limit: 10,
  q:'',//检索
  _sort:'time',

  //服务端接口参数


  //上传资源限定

  product: {
    uploadUrl:'/upload/product/'
  },

  user: {
    uploadUrl:'/upload/user/'
  },

  banner: {
    uploadUrl:'/upload/banner/'
  },

  normal: '/upload/default.jpg'


}