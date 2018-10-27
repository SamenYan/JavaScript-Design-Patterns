const MeassageCenter = function() {
	let mess = [];
	/**
	 * 发布消息
	 * @param {String} name 消息名称
	 **/
	return {
		publish: function(name) {
			if (mess[name]) {
				for (let i = 0, len = mess[name].length; i < len; i++) {
					mess[name][i] && mess[name][i]();
				}
			}
		},
		/**
		 * 订阅消息
		 * @param {String} name 消息名称
		 * @param {function} action 消息处理callback
		 **/
		subscribe: function(name, action) {
			if (!mess[name]) {
				mess[name] = [];
			}
			mess[name].push(action);
		}
	}
}();

module.exports = MeassageCenter;