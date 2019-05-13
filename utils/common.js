
import host from './host'
import md5 from './md5'

export default {

    host:host,

    /**
     * 版本号及来源参数
     */
    urlParams: {
        p: 'xcx',
        v: '1.0.0'
    },
    
    /**
     * 生成设备id
     */
    getDevice(callback) {
        let t = new Date().getTime();
        wx.getSystemInfo({
            success: function(res) {
                let str = md5(res.system + t);
                if (!wx.getStorageSync('deviceId')) {
                    wx.setStorageSync('deviceId', str);
                }
                callback ? callback(str) : '';
            }
        })
    },

    /**
     * 合并对象
     */
    extend(to, from) {
        for (var key in from) {
            to[key] = from[key];
        }
        return to;
    }

}