
import getPublicParams from './sign'

class Request {

    /**
     * 默认属性
     */
    constructor() {

        this.method = 'GET'
        this.data = {
            isSign : false // 是否需要签名
        }
        
    }
   
    /**
     * GET、POST请求
     * @return Promise
     */
    ajax(options = {}){

        options.data = Object.assign({},options.data,this.data);
        options.method ?  '' : options.method = this.method

        return new Promise((resolve, reject) => {

            // 判断是否需要签名
            if (options.data.isSign) {
                getPublicParams(options.data).then(function(data){
                    request(data);
                })   
            }else{
                request(options.data);
            }
            function request(data){
                wx.request({
                    url: options.url,
                    method: options.method,
                    data: data,
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
            }  
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