
// 是否开发环境
let isDev = false;

// 开发环境域名
let dev = {
  // 商城API
  baseApi : 'xxx1.com',
  // 抽奖api
  drawApi :  'xxx2.com'
};

// 线上环境域名
let pro = {
  // 商城API
  baseApi : 'xxx3.com',
  // 抽奖api
  drawApi :  'xxx4.com'
};

export default isDev ? dev : pro