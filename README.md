# JavaScript-Design-Patterns
本项目收录一些JS设计模式，用于学习开发总结。

## 目录

- [单例模式](#singleton)
- [中介者模式](#mediator)
- [节流模式](#throttle)
- [状态模式](#state)

--- 

<h3 id="singleton">单例模式</h3>

又称单体模式，顾名思义，只允许被实例化一次的对象类。一般定义一个对象来规划一个命名空间，用来管理其属性和方法; 也常用来管理代码库的功能模块,在模块化开发中尤为常见。比如👇

```js
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

//调用实例
const singleton = new SingleTon();
singleton.get('name'); // "single"
singleton.say(); // "I am a single partten based js"
```

✍️ 使用场景：

- 适合用于功能模块化需求。比如密码校验模块 `CheckPassword()`
- 第三方引用库。比如JQuery、Zepto也是典型的单例，一次实例化全局使用 window.$ 命名空间

---

<h3 id="mediator">中介者模式</h3>

通过中介者对象封装一系列对象之间的交互，使对象之间不再相互引用，降低耦合。

经典案例 👉 **`订阅发布消息机制`**

```js
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

//调用实例

//Component1 发布消息：
MessageCenter.publish('demo');
//Component2 接收消息：
MessageCenter.subscribe('demo', function() {
	//业务逻辑
});
```
✍️ 调用实例可以看出，组件1发布消息，组件2，3...只要订阅消息就能收到组件1的状态信息，从而dosomething()。这种模式下很好地解决了组件耦合问题，干净利落。

---

<h3 id="throttle">节流模式</h3>

对重复的Dom操作或者业务逻辑进行节流控制，规定时间内执行最后一次操作，提高性能。

对于节流器，[Lodash](https://www.lodashjs.com/)工具函数中也有封装 👉
[Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)

```js
/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 * 
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数   
 */
const Throttle = function(func, wait, options) {
	let context, args, result;
	let timeout = null;
	// 上次执行时间点
	let previous = 0;
	if (!options) options = {};
	// 延迟执行函数
	let later = function() {
		// 若设定了开始边界不执行选项，上次执行时间始终为0
		previous = options.leading === false ? 0 : _.now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function() {
		let now = _.now();
		// 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
		if (!previous && options.leading === false) previous = now;
		// 延迟执行时间间隔
		let remaining = wait - (now - previous);
		context = this;
		args = arguments;
		// 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
		// remaining大于时间窗口wait，表示客户端系统时间被调整过
		if (remaining <= 0 || remaining > wait) {
			clearTimeout(timeout);
			timeout = null;
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
			//如果延迟执行不存在，且没有设定结尾边界不执行选项
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};

//调用案例
function dosomething() {
	//...
}
window.onscroll = Throttle(dosomething); // native JS
$(window).on('scroll', Throttle(dosomething)); //jQuery
```

✍️ 使用场景：

- 窗口操作 - window对象的 resize、scroll 事件
- 文本输入 - keydown、keyup 事件
- 鼠标移动 - mousemove 事件

---

<h3 id="state">状态模式</h3>

当对象内部状态或者场景状态发生改变时，导致其对应行为的改变。

```js
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

//调用案例
stateManager.setState('state0').run(); // 执行第一种情况
stateManager.setState('state0', 'state1').run(); // 执行第一种情况 执行第二种情况
stateManager.setState('key').run(); // 匹配状态为key值的action
stateManager.setState('abc').run(); // 存在未知指令 => abc
``` 

✍️ 使用场景：

- 业务场景涉及复杂状态管理 
- 用来替代：switch...case，if...else if


## Support the project ⭐
如果你感觉很棒，欢迎 star 或者 fork 支持我 谢谢！这有助于我们了解和发展社区。

![image](https://raw.githubusercontent.com/botpress/botpress/master/.github/assets/star_us.gif)

## License

![image](https://camo.githubusercontent.com/b0224997019dec4e51d692c722ea9bee2818c837/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f6d6173686170652f6170697374617475732e737667)  