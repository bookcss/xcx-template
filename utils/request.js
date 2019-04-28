
import getPushlishParams from './sign'

class Request {

    /**
     * 默认属性
     */
    constructor(x, y) {
        this.data = {}
        this.method = 'GET'
    }
   
    /**
     * GET或者POST请求
     * @return Promise
     */
    ajax(options = {}){


        options.data ?  '' : options.data = this.data
        options.method ?  '' : options.method = this.method

        return new Promise((resolve, reject) => {

            // 获取公共参数（如果不需要签名，可跳过次步骤）
            getPushlishParams(options.data).then(function(resultParams){

                wx.request({
                    url: options.url,
                    method: options.method,
                    data: resultParams,
                    header: {
                        'content-type': 'application/json'
                    },
                    success: (res) => {
                        let data = res.data;

                        // 根据请求状态码做相应的判断
                        if (data.code == 1) {
                            // 成功
                            resolve(data)
                        }else if (data.code == -400) {
                            // token失效
                            wx.removeStorageSync('userData');
                            wx.navigateTo({
                                url: '../auth/auth'
                            })
                            reject(res)
                        }else {
                            reject(res)
                        }
                    },
                    fail: (err) => {
                        reject(err)
                    },
                    complete: (res) => {
                       
                    }
                })
            })   
        })

    }

    /**
     * GET请求
     * @return Promise
     */
    get(url,data = {}){
        
        return this.ajax({
           url,
           data,
           method:'GET'
        })

    }
    
    /**
     * POST请求
     * @return Promise
     */
    post(url,data = {}){

        return this.ajax({
           url,
           data,
           method:'POST'
        })

    }

}

export default new Request