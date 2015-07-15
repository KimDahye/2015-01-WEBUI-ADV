main = {};
main.ui = {};

main.ui.Square = (function () {
  function Square (elParent, top, left, color) {
    this.element; 
    this.elParent = elParent;
    this.top = top;
    this.left = left;
    this.color = color;
    this.interval;
    this.status = "nonClicked";

    appendElement.call(this); // 프로토타입일 때 this.appendElement is not a function 에러가 난다. 갑자기 왜이러지?
    animateColor.call(this); // 프로토타입일 때 this.animateColor in not a function 에러가 남. 
  }

   function appendElement() {
    var color = this.color;
    this.element = document.createElement("div");
    this.element.classList.add("square");
    this.element.style.backgroundColor = rgb(color.r, color.g, color.b);
    this.element.style.borderColor = rgb(color.r, color.g, color.b);
    this.element.style.top = ""+this.top+"px";
    this.element.style.left = ""+this.left+"px";
    this.elParent.appendChild(this.element);
  };

  function animateColor () {
    clearInterval(this.interval);
    var color = this.color;
    var currentColor = {r:color.r, g:color.g, b:color.b};
    this.interval = setInterval(function(){
        if(currentColor.r < 255 || currentColor.g < 255 || currentColor.b < 255) {
          currentColor.r = currentColor.r + 10;
          currentColor.g = currentColor.g + 10;
          currentColor.b = currentColor.b + 10;
          this.element.style.backgroundColor = rgb(currentColor.r, currentColor.g, currentColor.b);
        }
     }.bind(this), 30);
  };

  Square.prototype.clicked = function () {
    if(this.status === "nonClicked") {
      this.status = "clicked";
      this.element.style.borderWidth = "3px";
    } else {
      this.status = "nonClicked";
      this.element.style.borderWidth = "1px";
    }
  };

  Square.prototype.destroy = function () {
    this.elParent.removeChild(this.element);
  }

  function rgb(r, g, b) {
    return "rgb(" + r +","+g +"," + b +")"
  }

  return Square;
})();

main.ui.SquareManager = (function () {
  var colorList = [
    {r: 152, g:23, b:146},
    {r: 232, g:71, b:52},
    {r: 27, g:7, b:45},
    {r: 50, g:215, b:131}
  ];
  
  function SquareManager () {
    this.elTarget = document.getElementById("sketchbook");
    this.squareList = [];
  }
  
  SquareManager.prototype.addSquare = function () {
    var rand_color = colorList[getRandomInt(0, 3)];
    var width = this.elTarget.offsetWidth;
    var height = this.elTarget.offsetHeight;

    var top = height*Math.random();
    var left = width*Math.random();
    if(top > height - 100) {
      top = top - (top - (height - 100));
    }
    if(left > width - 100){
      left = left - (left - (width - 100));
    }
    var newSquare = new main.ui.Square(this.elTarget, top, left, rand_color);
    this.squareList.push(newSquare);
    newSquare.element.addEventListener("click", function clickHandler() {
      newSquare.clicked();
    });
  };
  
  SquareManager.prototype.removeAllClickedSquares = function() {
    //squareList를 돌면서 status가 deleted이면 element를 dom에서 지우고, squreList에서도 없앤다.
    var length = this.squareList.length
    for(var i = 0; i < length; i++) {
      var curSquare = this.squareList[i];
      if(curSquare.status === "clicked") {
        curSquare.destroy();
        this.squareList.splice(i, 1);
        i--;
        length--;
      }
    }
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  return SquareManager;
})();

window.addEventListener("load", function () {
  var add_btn = document.getElementById("add_btn");
  var delete_btn =document.getElementById("delete_btn");
  var oSquareManager = new main.ui.SquareManager();
  add_btn.addEventListener("click", function(){
    var newSquare = oSquareManager.addSquare();
  });

  delete_btn.addEventListener("click", function() {
    oSquareManager.removeAllClickedSquares();
  });
});

// 클릭하면 테두리가 두꺼워져야함
// 그 상태에서 삭제하면 삭제되어야 함.
