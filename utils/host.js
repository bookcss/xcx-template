


// 是否开发环境
let isDev = false;

// 开发环境域名
let dev = {
  // 商城API
  baseApi : 'https://testpanda.huodao.hk',
  // 抽奖api
  drawApi :  'https://testact.zhaoliangji.com'
}

// 线上环境域名
let pro = {
  // 商城API
  baseApi : 'https://panda.huodao.hk',
  // 抽奖api
  drawApi :  'https://act.zhaoliangji.com'
}


export default isDev ? dev : pro