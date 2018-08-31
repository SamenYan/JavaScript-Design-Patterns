# JavaScript-Design-Patterns
本项目收录一些JS设计模式，用于学习开发总结。

## 目录

- [单例模式](#single)
- [中介者模式](#mediator)
- [节流模式](#throttle)

<h3 id="single">单例模式</h3>

又称单体模式，顾名思义，只允许被实例化一次的对象类。一般定义一个对象来规划一个命名空间，用来管理其属性和方法; 也常用来管理代码库的功能模块,在模块化开发中尤为常见。比如👇

```js
var SinglePattern = (function() {
	var _instance = null;
	//私有静态变量
	var STATIC = {
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
var singlePattern = new SinglePattern();
singlePattern.get('name'); // "single"
singlePattern.say(); // "I am a single partten based js"
```

<h3 id="mediator">中介者模式</h3>

通过中介者对象封装一系列对象之间的交互，使对象之间不再相互引用，降低耦合。经典案例 👉 **`订阅发布消息机制`**

```
var MeassageCenter = function() {
	var mess = [];
	/**
	 * 发布消息
	 * @param {String} name 消息名称
	 **/
	publish: function(name) {
		if (mess[name]) {
			for (var i = 0, len = mess[name].length; i < len; i++) {
				mess[name][i] && mess[name][i]();
			}
		}
	}
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
	},
}();

//调用实例
MessageCenter.publish('demo');
MessageCenter.subscribe('demo', function() {
	//业务逻辑
});
```

<h3 id="throttle">节流模式</h3>

对重复的业务逻辑或者dom操作进行节流控制，规定时间内执行最后一次操作，提高性能。

对于节流器，Lodash工具函数中也有封装 👉
[Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)

```
/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 * 
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数   
 */
var Throttle = function(func, wait, options) {
	var context, args, result;
	var timeout = null;
	// 上次执行时间点
	var previous = 0;
	if (!options) options = {};
	// 延迟执行函数
	var later = function() {
		// 若设定了开始边界不执行选项，上次执行时间始终为0
		previous = options.leading === false ? 0 : _.now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function() {
		var now = _.now();
		// 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
		if (!previous && options.leading === false) previous = now;
		// 延迟执行时间间隔
		var remaining = wait - (now - previous);
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

> 使用场景：

- window 对象的 resize 和 scroll 事件
- keydown事件
- 文本输入、自动完成，keyup 事件
- 鼠标移动，mousemove 事件
