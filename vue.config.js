const path = require('path') // 引入path模块
function resolve(dir) {
  return path.join(__dirname, dir) //path.join(_dirname)设置绝对路径
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      //第一个参数：别名 第二个参数：路径
      .set('@', resolve('src'))
      .set('components', resolve('@/components'))
      .set('assets', resolve('@/assets'))
      .set('common', resolve('@/common'))
      .set('views', resolve('@/views'))
  }
}
