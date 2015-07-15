//shape.Square로 함수에 접근할 수 있도록 전역 객체 shape를 만든다
var shape= {};

//conflict 체크를 위해 생성된 스퀘어 리스트를 저장하기 위한 변수 선언
shape.SqaureList = [];

shape.Square = 	function () {
		//생성자 안에서 'square' 클래스를 갖는 div 엘리먼트를 만든다
		this.element = document.createElement('div');
		this.element.classList.add('square');

		//나중에 이벤트를 등록하고 지워주기 위해 저장한 함수들
		this._onMouseMove = this._onMouseMove.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
	}

//매개변수로 받은 x,y 값을 this.element의 left, top값으로 지정
shape.Square.prototype.setPosition = function (x, y) {
	this.element.style.top = y + 'px';
	this.element.style.left = x + 'px';
	//html에서 체이닝으로 다음함수를 호출하기 때문에 this를 리턴해주어야 한다.
	return this;
};

//매개변수로 받은 mousedown이벤트를 통해 start position을 저장해둔다.
shape.Square.prototype.startDragging = function (event) {
	this._startX = event.pageX;
	this._startY = event.pageY;
	this._startTop = parseInt(this.element.style.top);
	this._startLeft = parseInt(this.element.style.left);
	//요구사항을 만족시키기 위해 드래깅을 시작하면 dragging클래스 추가한다.
	this.element.classList.add('dragging');

	//mousemove, mouseup에 대해 이벤트를 등록한다.
	document.addEventListener('mousemove', this._onMouseMove);
	document.addEventListener('mouseup', this._onMouseUp);

	//html에서 체이닝으로 다음함수를 호출하기 때문에 this를 리턴해주어야 한다.
	return this;

}

//매개변수로 받은 컨테이너를 this에 등록해두고, offset정보를 this에 저장해둔다.
shape.Square.prototype.setContainer = function (elContainer) {
	this.container = elContainer;
	this.containerTop = elContainer.offsetTop;
	this.containerLeft = elContainer.offsetLeft;
	this.containerBottom = this.containerTop + elContainer.offsetHeight;
	this.containerRight = this.containerLeft + elContainer.offsetWidth;
	
	//html에서 체이닝으로 다음함수를 호출하기 때문에 this를 리턴해주어야 한다.
	return this;
};

//부모 엘리먼트 아래에 자식으로 this.element를 추가하여 화면에 보여지도록 한다.
shape.Square.prototype.setParent = function(parent) {
	this.parent = parent;
	parent.appendChild(this.element);
	this.element.style.position = 'absolute';
};

shape.Square.prototype._onMouseMove = function(event) {
	var diffX = event.pageX - this._startX, diffY = event.pageY - this._startY;
	this.element.style.top = this._startTop + diffY + 'px';
	this.element.style.left = this._startLeft + diffX + 'px';
};

shape.Square.prototype._onMouseUp = function(event) {
	document.removeEventListener('mousemove', this._onMouseMove);
	document.removeEventListener('mouseup', this._onMouseUp);
	
	//컨테이너 밖이면 element 를 지우기 위한 준비과정
	var top = parseInt(this.element.style.top);
	var left = parseInt(this.element.style.left);
	var size = this.element.offsetWidth; //정사각형이므로 offsetHeigth는 구하지 않겠습니다.
	var bottom = top + size;
	var right = left + size;
	
	//멈춘 곳이 컨테이너 밖이면 바디에서 사라진다
	if(top < this.containerTop || left < this.containerLeft || bottom > this.containerBottom || right > this.containerRight) {
		this.parent.removeChild(this.element);
		return;
	}
	
	//위의 if문에 해당되지 않았다면, 생성된 순서대로 번호가 매겨지고, 20px/s로 하강해야한다.
	this.element.innerText = document.body.childNodes.length - 7;
	this.fall();

	//충돌 체크를 위해 지금 만들어둔 element를 shape.SquareList에 저장한다.
	shape.SqaureList.push(this.element);
};

//20px/s로 하강하다 바닥을 만나면 멈추는 애니메이션 함수
shape.Square.prototype.fall = function () {
	var step = 200/1000 // 1s 당 내려가야할 px 값
	var self = this, start; //this를 self로 저장해둔다. start변수 선언한다.
	var firstTop = this.element.style.top; //등속도로 낙하하기 위해 처음 top값을 기록해둔다.

	function tick(timestamp){
		if (!start) start = timestamp;
		var elapsed = timestamp - start;
		var min = self.containerBottom - self.element.offsetHeight; //사각형이 가질 수 있는 top의 최대값 - 컨테이너 밖을 넘어가지 않기 위해 필요한 값이다.
		self.element.style.top = Math.round(Math.min(parseInt(firstTop) +  (elapsed * step) , min)) + 'px';
		
		//이미 내려간 스퀘어와 충돌했다면, 애니메이션을 멈춘다.
		var conflictIndex = indexOfConflictSqure(self.element);
		if(conflictIndex !== -1) {
			//내려가고 있는 스퀘어의 위치를 충돌한 스퀘어 바로 위에 위치하도록 조정
			self.element.style.top = (shape.SqaureList[conflictIndex].offsetTop - self.element.offsetHeight) + 'px';
			return;
		}

		//이미 내려간 스퀘어와 충돌하지 않았는데, 아직 컨테이너 바닥에 닿지 않았다면 애니메이션을 지속한다.
		var bottom = self.element.offsetTop + self.element.offsetHeight;
		if (bottom < self.containerBottom) {
			window.requestAnimationFrame(tick);
		}		
	};

	window.requestAnimationFrame(tick);
}

//내려가고 있는 스퀘어가 이미 내려가 있는 스퀘어 리스트 중 충돌한 게 있다면 그 사각형의 인덱스를 반환한다.
function indexOfConflictSqure(elSquare) {
	for(var i = 0; i< shape.SqaureList.length - 1; i++){
		var square = shape.SqaureList[i];
		if(isConflict(elSquare, square)){
			return i;
		}
	}
	return -1;
}

function isConflict(newSquare, oldSquare) {
	var left = newSquare.offsetLeft;
	var right = left + newSquare.offsetWidth;
	var top = newSquare.offsetTop;
	var bottom = top + newSquare.offsetHeight;

	var oldTop = oldSquare.offsetTop;
	var oldBottom = oldTop + oldSquare.offsetHeight;
	var oldLeft = oldSquare.offsetLeft;
	var oldRight = oldLeft + oldSquare.offsetWidth;
	return (isBetween(bottom, oldTop, oldBottom) || isBetween(top, oldTop, oldBottom)) && (isBetween(left, oldLeft, oldRight) || isBetween(right, oldLeft, oldRight));
}

function isBetween(value, min, max) {
	return (value >= min) && (value <= max);
}
