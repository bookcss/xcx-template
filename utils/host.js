

/**
 * 测试、生成环境域名
 * @return Object
 */
function getHost(){

    let isDev = false;
    let host = {
      dev : {
        // 商城API
        baseApi : 'https://testpanda.huodao.hk',
        // 抽奖api
        drawApi :  'https://testact.zhaoliangji.com'
      },
      pro : {
        // 商城API
        baseApi : 'https://panda.huodao.hk',
        // 抽奖api
        drawApi :  'https://act.zhaoliangji.com'
      }
    }

    return isDev ? host.dev : host.pro
    
}

export default getHost()