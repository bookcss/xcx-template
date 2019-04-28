
import _ from './common'
import md5 from './md5'

/**
 * 获取公共参数
 * @return Object
 */
function _getPublicParams(){

    let [vm, params] = [this, {}];
    const res = wx.getSystemInfoSync();

    params.x_system_version = res.system;
    params.x_system_type = 'wx_xcx';
    params.x_app_version = '1000.1.1';
    params.x_device_name = res.model;
    params.x_timestamp = new Date().getTime();

    return new Promise((resolve, reject) => {
        wx.getNetworkType({
          success: (res) => {
            params.x_app_network = res.networkType;
            _.getDevice(function(deviceId){
                params.x_device_id = deviceId;
                resolve(params)
            })
          },
          fail: (err) => {
            reject(err)
          }
        })
    })
    
}


/**
 * 生成签名
 * @return String
 */
function buildParams(params){

    let keys = '',
        keyArr = [];
    for (let key  in params) {
        keyArr.push(key );
    }
    keyArr = keyArr.sort();
    for (let i = 0; i < keyArr.length; i++) {
       params[keyArr[i]] ? keys += keyArr[i] + '=' +params[keyArr[i]]+ '&' : '';
    }
    keys = keys.substring(0, keys.length - 1) + 'zhaoliangji_oauth#$Z.*$%(#$%16Xcxc456^';
    return md5(keys);
    
}

/**
 * 将公共参数生成签名
 * @return Object
 */
function getPublicParams(data){
    return new Promise((resolve, reject) => {
        _getPublicParams().then(function(params){
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
