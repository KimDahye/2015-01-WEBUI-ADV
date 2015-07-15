function multiply(list) {
	var result = 1;
	list.forEach(function(entry) {
	result = result * entry;
});
	return result;
}

function power(list) {
	return Math.pow(list[0], list[1]);
}

function add(list) {
	var result = 0;
	list.forEach(function(entry) {
	result = result + entry;
});
	return result;
}

function execOperation(operate, answer) {	
	return function (list) {
		return answer + operate(list);
	}
}