let bcrypt = require('bcrypt');

module.exports = {

  //加密  let 加了密后 = bcrypt.hashSync(要加密的字符,加盐数)
  hashSync: password => bcrypt.hashSync(password, 10),
  
  //校验   let  结果 = bcrypt.compareSync(明码,加了密的码)
  compareSync: (sendPassWord,hash) => bcrypt.compareSync(sendPassWord,hash)

}