const SingleTon = (function() {
	let _instance = null;
	//私有静态变量
	const STATIC = {
		name: 'single',
		language: 'js'
	};

	function Single() {
		return {
			get: function(name) {
				return STATIC[name] ? STATIC[name] : null;
			},
			say: function() {
				return `I am a ${STATIC.name} partten based ${STATIC.language}`; //es6语法糖，如报错请转化为es5
			}
		}
	}

	return function() {
		if (!_instance) {
			_instance = new Single();
		}
		return _instance;
	};
})();

module.exports = new SingleTon();
