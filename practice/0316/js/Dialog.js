var DM = (function() {
    var DialogManager = function (elBase) {
        //do something...
      this.elContent = elBase.querySelector(".content");
      this.elController = elBase.querySelector(".controller");
      this.contentMsg = "";
      this.interval;
      this.fEvent;
    };

    DialogManager.prototype.toggleLayer = function(sContentMsg) {
      //do something...
      this.contentMsg = sContentMsg;
      this.fEvent = _changeContent.bind(this);
      this.elController.addEventListener("click", this.fEvent);
    };

    DialogManager.prototype.changeContentMsg = function(sContentMsg) {
        this.contentMsg = sContentMsg;    
    };

    DialogManager.prototype.setAnimation = function() {
        this.elController.removeEventListener("click", this.fEvent);
        this.fEvent = _increaseHeight.bind(this);
        this.elController.addEventListener("click", this.fEvent);
    }

    /*private 함수들*/
    function _changeContent(ev) {
        this.elContent.innerHTML = this.contentMsg;
        var innerName = this.elController.innerHTML;
        if(innerName === "박스열기") {
            this.elController.innerHTML = "박스닫기";
            this.elContent.style.display = "block";
        }
        else {
            this.elController.innerHTML = "박스열기";
            this.elContent.style.display = "none";
        }
    }//이걸 프로토타입에 넣으면 왜 안될까?

    function _increaseHeight (){
        clearInterval(this.interval);
        if(this.elController.innerHTML === "박스열기") {
            this.elController.innerHTML = "박스닫기";
            this.elContent.style.display = "block";
            this.elContent.style.height = 0 + "px";
            
            this.interval = setInterval(function(){
                var height = parseInt(this.elContent.style.height);
                if(height < 400) {
                this.elContent.style.height =  parseInt(this.elContent.style.height) + 1 + "px";
                }else {
                    clearInterval(this.interval);
                }
                console.log(this.elContent.style.height);          
            }.bind(this),1);
        }
        else {
            this.elController.innerHTML = "박스열기";
            this.elContent.style.display = "none";
        }
    }

    return DialogManager;
})();

//service code
(function(){
    var elTarget = document.querySelector(".container");
    var oDM = new DM(elTarget);

    $("button:first-child").on("click", function(e){
        oDM.toggleLayer("Lorem ipsum dolor sit amet, consectetur adipisicing elit.");
    });
    $("button:nth-child(2)").on("click", function(e){
        oDM.changeContentMsg("message is none...");
    });
    $("button:last-child").on("click", function(e){
        oDM.setAnimation();
    });
})();