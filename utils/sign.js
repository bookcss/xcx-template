
import _ from './common';
import md5 from './md5';

/**
 *
 * @returns Promise
 * @private
 */
function _getPublicParams(){
    const params = {};
    let {system, model} = wx.getSystemInfoSync();
    params.x_system_version = system;
    params.x_device_name = model;
    params.x_system_type = 'wx_xcx';
    params.x_app_version = '1000.1.1';
    params.x_timestamp = new Date().getTime();
    return new Promise((resolve, reject) => {
        wx.getNetworkType({
          success: (res) => {
            params.x_app_network = res.networkType;
            _.getDevice((deviceId) => {
                params.x_device_id = deviceId;
                resolve(params)
            });
          },
          fail: (err) => {
            reject(err)
          }
        })
    })
}

/**
 * 生成签名
 * @param params
 * @returns String
 */
function buildParams(params){
    let keyArr = [];
    for (let key in params) {
        keyArr.push(key);
    }
    keyArr = keyArr.sort();
    let keys = keyArr.map((v) => params[v] ? v + '=' +params[v] : '' ).join('&');
    return md5(keys);
}

/**
 * 将公共参数生成签名
 * @param data
 * @returns Promise
 */
function getPublicParams(data){
    return new Promise((resolve, reject) => {
        _getPublicParams().then((params) => {
            // 公共参数
            for (let key in params) {
              data[key] = params[key];
            }
            // 生成签名
            data.x_api_sign = buildParams(data);
            resolve(data)
        }).catch(function(err){
            reject(err)
        })
    })
}

export default getPublicParams
