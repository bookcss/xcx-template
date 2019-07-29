
import getPublicParams from './sign';

class Request {

    /**
     * 基本属性
     */
    constructor() {
        this.options = {
            method: 'GET',
            data:{}
        }
    }

    /**
     * GET、POST请求
     * @param url
     * @param method
     * @param data
     * @returns {Promise}
     */
    ajax({
         url,
         method = this.options.method,
         data = this.options.data} = this.options
    ){
        return new Promise((resolve, reject) => {
            // 获取公共参数
            // getPublicParams(data).then( (data) => {
            //     console.log(data);
            // });
            wx.request({
                url: url,
                method: method,
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
        })
    }

    /**
     * GET请求
     * @param url
     * @param data
     * @returns {Promise}
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
     * @param url
     * @param data
     * @returns {Promise}
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