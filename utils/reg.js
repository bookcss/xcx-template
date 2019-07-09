
// 正则匹配方法
let reg = {

	// 手机匹配
	phone: {
        test: /^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/,
        message: '请输入正确的格式'
    },

    // 邮箱
    email: {
        test: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        message: '请输入正确的格式'
    }
};

export default reg