// 配置项
const config = {
  // base地址
  // baseURL: 'https://api.izhujialin.com', //正式
  baseURL: 'https://api.sdzhujialin.com', //测试
  APP_KEY: '60487FE91A0577ED60C4DC56A9EF3DB5',
  // 请求头
  header: {
    'content-type': 'application/json'
  },
  // 页面提示
  hints: {
    1: '出小差了，请刷新重试',
  },
}

export {
  config
}