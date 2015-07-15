function Square() {
	// new로 인스턴스를 만들 때 
	// this는 함수를 실행할 때 결정된다.
	this.r= rand(0, 255);
	this.g= rand(0, 255);
	this.b= rand(0, 255);
	this.element = document.createElement('div');
	var size = rand(20, 80); //[20, 100]
	this.element.style.width = size + 'px';
	this.element.style.height = size + 'px';
	this.element.addEventListener('click', this._onSelect.bind(this));

	//private하게 쓰는 방법
	Var  r;
	This.getR = function() {
		Return r;
	}
	
}

Square.prototype.updateColor = function() {
	this.element.style.backgroundColor = 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ")";
}

Square.prototype.setParent = function(parent) {
	parent.appendChild(this.element);
	this.element.style.position = 'absolute';
	this.element.style.top = rand(0, parent.offsetHeight - this.element.offsetHeight) + 'px';
	this.element.style.left = rand(0, parent.offsetWidth - this.element.offsetWidth) + 'px'; 
}

Square.prototype._onSelect = function(event) {
	this.element.style.outline = '1px solid black';
}

function rand(min, max) {
	return Math.round(Math.random() * max) + min;
}
// add 버튼 클릭되었을 때, 이벤트 리스닝 안에 들어갈 부분
var square =  new Square();



