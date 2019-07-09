/**
 * 表格查询条件工具
 * @author zhou
 * @param tableArr表格参数[{},{},{}]，where查询条件格式。威胁名称=K and 采取操作=1232321
 * @returns [{},{},{}]
 */
function queryCriteria(tableArr, where) {
	//将tableArr转换为{字段：[],字段：[],字段：[]}。然后进行解读判断
	var listMap = {}
	for (var i = 0; i < tableArr.length; i++) {
		for (var k in tableArr[i]) {
			if (listMap[k]) {
				listMap[k].push(tableArr[i][k]);
			} else {
				var arr = [];
				arr.push(tableArr[i][k]);
				listMap[k] = arr;
			}
		}
	}
	//连续的条件不是同一字段时。
	var criteriaArr = where.split(" and ");
	//需要删除的对象的下标
	var delectArr = {};
	for (var i3 = 0; i3 < criteriaArr.length; i3++) {
		for (var k in listMap) {
			//判断字段是否存在
			if (criteriaArr[i3].indexOf(k) != -1) {
				for (var i = 0; i < listMap[k].length; i++) {

					var newCriteriaArr = criteriaArr[i3].replace(k, listMap[k][i]);
					//转换为可判断的表达式，返回判断结果
					var booleanIf = judge(newCriteriaArr);
					if (!booleanIf) {

						//记录不满足条件的下标
						delectArr["index" + i] = i;
					}
				}
			}
		}
	}
	for (var k in delectArr) {
		delete tableArr[delectArr[k]];
	}
	var newTableArr = [];
	for (var i = 0; i < tableArr.length; i++) {
		if (tableArr[i] != undefined) {
			newTableArr.push(tableArr[i]);
		}
	}
	return newTableArr;
}

/**
 * 将字符串解析为if判断表达式
 * @author zhou
 * @param data
 * @returns boolean
 */
function judge(str) {
	if (str.indexOf("=") != -1) {
		var criteriaArr = str.split("=");
		if (criteriaArr[0] == criteriaArr[1]) {
			return true;
		} else {
			return false;
		}
	} else if (str.indexOf("!=") != -1) {
		var criteriaArr = str.split("!=");
		if (criteriaArr[0] != criteriaArr[1]) {
			return true;
		} else {
			return false;
		}
	} else if (str.indexOf(">") != -1) {
		var criteriaArr = str.split(">");
		if (criteriaArr[0] > criteriaArr[1]) {
			return true;
		} else {
			return false;
		}
	} else if (str.indexOf("<") != -1) {
		var criteriaArr = str.split("<");
		if (criteriaArr[0] < criteriaArr[1]) {
			return true;
		} else {
			return false;
		}
	} else if (str.indexOf("不包含") != -1) {
		var criteriaArr = str.split("不包含");
		if (criteriaArr[0].indexOf(criteriaArr[1]) == -1) {
			return true;
		} else {
			return false;
		}
	} else if (str.indexOf("包含") != -1) {
		var criteriaArr = str.split("包含");
		if (criteriaArr[0].indexOf(criteriaArr[1]) != -1) {
			return true;
		} else {
			return false;
		}
	}
}


/**
 * 将满足条件的字段值修改为制定的值
 * @returns
 */
function setCondition(arr, where) {
	var strArr = where.split(" and ");
	for (var i = 0; i < strArr.length; i++) {
		var regex = /\((.+?)\)/g;
		var str = strArr[i].match(regex)[0];
		str = str.split("(").join('');
		str = str.split(")").join('');
		//区分类型,不包含则进
		if (str.indexOf(">=") == -1) {
			var arrStr = str.split("包含");
			for (var i2 = 0; i2 < arr.length; i2++) {
				//包含则进
				if (arr[i2][arrStr[0]].indexOf(arrStr[1]) != -1) {
					arr[i2][arrStr[0]] = strArr[i].split(")=")[1];
				}

			}
		} else {
			var arrStr = str.split(">=");
			for (var i2 = 0; i2 < arr.length; i2++) {
				//满足则进
				if (arr[i2][arrStr[1]] >= arrStr[2] && arr[i2][arrStr[1]] <= arrStr[0]) {
					arr[i2][arrStr[1]] = strArr[i].split(")=")[1];
				}

			}
		}

	}
	return arr;
}


/**
 * 测试工具方法
 * @author zhou
 * @returns void
 */
test();

function test() {
	var testParam = [{
		test1: 2,
		test2: 3,
		test3: 5
	}, {
		test1: 5,
		test2: 4,
		test3: 5
	}, {
		test1: 2,
		test2: 3,
		test3: "好好"
	}];
	//返回的结果
	var newTableArr = queryCriteria(testParam, "test1=2 and test3不包含好好");
	console.log(JSON.stringify(newTableArr));
	
	var testParam2 = [{
		"置信值": "2",
		"事件": "我的电脑被攻击了",
		"威胁名称": "K",
		"采取操作": "关机",
		"创建时间": "2019-05-06"
	}, {
		"置信值": "3",
		"事件": "我的电脑被谁关机了",
		"威胁名称": "C",
		"采取操作": "拔网线",
		"创建时间": "2019-06-18"
	}, {
		"置信值": "3",
		"事件": "我的电脑被谁关机了",
		"威胁名称": "C",
		"采取操作": "拔网线",
		"创建时间": "2019-06-18"
	}, {
		"置信值": "2",
		"事件": "摄像头无缘无故打开了",
		"威胁名称": "C",
		"采取操作": "关机",
		"创建时间": "2019-06-17"
	}, {
		"置信值": "3",
		"事件": "死机了",
		"威胁名称": "A",
		"采取操作": "打开",
		"创建时间": "2019-06-19"
	}];
	var arr = setCondition(testParam2, "(2019-06-18>=创建时间>=2019-05-05)=旧数据 and (3>=置信值>=2)=高 and (事件包含死机)=屏蔽");
	console.log(JSON.stringify(arr));
}
