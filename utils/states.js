const stateManager = function() {
	let _currentStates = [];
	const states = {
		//可能是序列号
		state0: () => {
			console.log('执行第一种情况');
		},
		state1: () => {
			console.log('执行第二种情况');
		},
		state2: () => {
			console.log('执行第三种情况');
		},
		//可能是特定key值
		key: () => {
			console.log('匹配状态为key值的action');
		},
		//异常
		error : (state) => {
			console.log('存在未知指令 =>', state);
		},
		donothing: () => {
			console.log('未执行任何动作');
		}
	}

	const Action = {
		setState: function() {
			const args = arguments;
			if (!args.length) {
				states['donothing']();
				return this;
			}

			_currentStates = [];
			for (let i = 0, len = args.length; i < len; i++) {
				if (states.hasOwnProperty(args[i])) {
					_currentStates.push(args[i]);
				} else {
					states['error'](args[i]);
				}
			}

			return this;
		},
		run: function() {
			_currentStates.map(i => {
				states[i] && states[i]();
			});

			return this;
		}
	}

	return {
		setState: Action.setState,
		run: Action.run
	}
}();

module.exports = stateManager;