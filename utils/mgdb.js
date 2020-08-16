let mongodb = require('mongodb')

//实例化
let mongoCt = mongodb.MongoClient;
let ObjectId = mongodb.ObjectId;// 函数, 把字符转换成对象形id

let address = 'mongodb://127.0.0.1:27017'
let options = { useUnifiedTopology: true }
let sql = 'oldsix';
let connect = null;

let open = ({ dbName = sql, collectionName, url = address }) => {
  return new Promise((resolve, reject) => {
    if (!collectionName) {
      reject('集合名为必传参数');
      return;
    }
    mongoCt.connect(url, options, (err, client) => {
      //err 错误 client链接后的客户端
      if (err) {
        reject({err:1,msg:'链接失败'})
      } else {
        // client链接体
        connect = client;
        let db = client.db(dbName);//链接库
        let collection = db.collection(collectionName);//链接集合
        resolve({ collection,ObjectId })
      }
    })
  })
}

let close = () => {
  connect && connect.close()
}

let findList = ({
  collectionName,//集合名
  dbName = sql,
  _page, _limit, _sort, q //可选参数
}) => new Promise((resolve, reject) => {
  //判断必传参数
  if (!collectionName) {
    reject({err:1,msg:'集合名为必传参数'});
    return;
  }

  //定义查询规则
  // let rule = q ? {title:new RegExp(q,'ig')} :{};
  let rule = q ? { title: eval('/' + q + '/') } : {};

  //兜库
  open({ dbName, collectionName })
    .then(
      ({ collection }) => {
        collection.find(rule, {
          skip: _page * _limit, //分页
          limit: _limit,//条数限定
          projection: {},//要显示的列
          sort: { [_sort]: -1 }//排序
        }).toArray((err, result) => {

          if (!err && result.length > 0) {
            resolve({
              err: 0,
              msg: '成功',
              data: result
            })
          } else {
            resolve({
              err: 1,
              msg: '查不到数据',
              data: []
            })
          }
          close() //关闭连接

        })
      }
    ).catch(
      err=>reject({err:1,msg:'库链接失败-find-list'})
    )
})


let findDetail = ({
  collectionName,
  dbName=sql,
  _id = null
}) => new Promise((resolve,reject)=>{
  
  if(!_id){
    reject({err:1,msg:'_id为必传参数'});
    return;
  }else if(_id.length !== 24){
    reject({err:1,msg:'_id格式不正确'});
    return;
  }


  open({dbName,collectionName})
    .then(
      ({collection})=>collection.find({
        _id: ObjectId(_id)
      },{
        projection:{_id:0}
      }).toArray((err,result)=>{
        if (!err && result.length > 0) {
          resolve({
            err: 0,
            msg: '成功',
            data: result[0]
          })
        } else {
          resolve({
            err: 1,
            msg: '查不到数据',
          })
        }
        close() //关闭连接
      })
    ).catch(
      err=>reject({err:1,msg:'库链接失败-find-detail'})
    )

})


exports.open = open;
exports.findList = findList;
exports.findDetail = findDetail;
exports.close = close;