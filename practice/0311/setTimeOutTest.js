function test() {
	this.getAlertMessage();
}

test.prototype.getAlertMessage = function () {
	var that = this;
	setTimeout(function(){ 
		alert("Hello"); 
		console.log(that); 
		//여기에 bind없이는 window가 나옴. bind하면 test가 나온다. 
	}, 3000);
}


var aaa = new test();
