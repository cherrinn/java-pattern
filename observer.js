function BidMessage(propertyName,propertyID,price,bidderName,submitTime){
    this.propertyID = propertyID  || '';
    this.price = price || 0;
    this.bidderName = bidderName.getUser() || '';
    this.submitTime = submitTime || '';
    this.toBid = new ToBidProperty(propertyName,propertyID);
}

BidMessage.prototype.getPropertyID = function(){
    return this.propertyID;
};

BidMessage.prototype.getPrice = function(){
    return this.price;
};

BidMessage.prototype.getSubmitTime = function(){
    return this.submitTime.toLocaleString();
};

BidMessage.prototype.getBidderName = function(){
    return this.bidderName;
};

BidMessage.prototype.toString = function(){
    return "[ID "+this.getPropertyID()+": "+this.getPrice()+", at "+ this.getSubmitTime().toLocaleString()+"]";
};

function ToBidProperty(name,id){
    this.name = name || '';
    this.id = id || '';
}
ToBidProperty.prototype.getPropertyName = function(){
    return this.name;
};
ToBidProperty.prototype.getID = function(){
    return this.id;
};

function BidQueue(){
    this.queue = [];
    this.observer = [];
}
BidQueue.prototype.register = function(observer){
    this.observer.push(observer);
    console.log("Register --> "+observer.getUser()+"\n");
};
BidQueue.prototype.unRegister = function(observer){
    var indexOb = 0;
    var indexQ = 0;
    for(var i in this.observer){
        if(this.observer[i] == observer){
            indexOb = i;
        }
    }
    for(var j in this.queue){
        if(this.queue[j].getBidderName() == observer.getUser()){
            indexQ = j;
        }
    }
    this.observer.splice(indexOb,indexOb);
    this.queue.splice(indexQ,indexQ); 
    console.log("Unregister --> "+observer.getUser()+"\n");
};
BidQueue.prototype.addMessage = function(bidMessage){
    this.queue.push(bidMessage);
    this.queue.sort(function(a,b){
        if(a.getSubmitTime().t < b.getSubmitTime()){
            return -1;
        } 
        if(a.getSubmitTime() > b.getSubmitTime()){
            return 1;
        }
        return 0;
    });
    this.update(this);
};
BidQueue.prototype.getBidMessage = function(){
    return this.queue[0];
};

BidQueue.prototype.notify = function(fn){
    for(var i in this.observer) {
        this.observer[i].update(fn,this,i);
    }
};

BidQueue.prototype.update = function(fn){
    this.notify(fn);
};

function BidScreen(user){
    this.user = user || '';
    this.message = undefined;
}

BidScreen.prototype.update = function(fn,that,i){
    if(fn instanceof BidQueue){
        console.log("\t\tScreen : "+that.observer[i].getUser());
        console.log(that.queue[that.queue.length-1].getBidderName() +" bids "+that.queue[that.queue.length-1].toBid.getPropertyName()
                    + "(#"+that.queue[that.queue.length-1].getPropertyID()+")" + " with $"+that.queue[that.queue.length-1].getPrice());
        console.log("Current Bid : $"+that.queue[that.queue.length-1].getPrice());
        console.log("Time : "+that.queue[that.queue.length-1].getSubmitTime());
        console.log("------------------------------------------");
    }
    if(fn instanceof Antique){
        console.log("           Screen : "+that.observer[i].getUser());
        console.log("TIME OUT "+new Date().toLocaleString());
        console.log(fn.winnerBidder+" is a winner!!!"+fn.winnerBidder);
        console.log(fn.winnerBidder+" has bid $"+fn.winnerPrice+" for "+"'"+fn.winnerPropertyName+"'");
        console.log("------------------------------------------");
    }
};  
BidScreen.prototype.getUser = function(){
    return this.user;
};
BidScreen.prototype.bid = function(message){
    this.message = message || '';
};

function Antique(bidQ){
    this.bidQ = bidQ || '';
    this.winnerPrice = 0;
    this.winnerBidder = '';
    this.winnerPropertyName = '';
    this.pID = '';
}
Antique.prototype.getWinnerPrice = function(propertyID){
    for(var i in this.bidQ.queue){
        if(this.bidQ.queue[i].getPropertyID() == propertyID && this.winnerPrice < this.bidQ.queue[i].getPrice()){ 
            this.winnerPrice =  this.bidQ.queue[i].getPrice();
            this.winnerBidder = this.bidQ.queue[i].getBidderName();
            this.winnerPropertyName = this.bidQ.queue[i].toBid.getPropertyName();
            this.pID = propertyID;
        }
        else if((this.pID != propertyID) && i > 0){
            this.winnerPrice = 0;
            this.winnerBidder = '';
            this.winnerPropertyName = '';
            this.pID = '';
        }
    }
    this.bidQ.update(this);
};

var Thread = {
	sleep: function(ms) {
		var start = Date.now();
		while (true) {
			var clock = (Date.now() - start);
			if (clock >= ms) break;
		}
		
	}
};

    var queue1 = new BidQueue();
    var antique = new Antique(queue1);
    var screen1 = new BidScreen("John");
    var screen2 = new BidScreen("Somsri");
    var screen3 = new BidScreen("Manee");
    queue1.register(screen1);
    queue1.register(screen2);
  
    
    var m1 = new BidMessage("monalisa","ss1234",1200, screen1 ,new Date());
    Thread.sleep(5000);
    var m2 = new BidMessage("monalisa","s1234",9999, screen2, new Date());
    Thread.sleep(5000);
    var m3 = new BidMessage("monalisa","s1234",55000, screen3, new Date());
    Thread.sleep(5000);
    var m4 = new BidMessage("vanko","s1111",2000, screen1, new Date());
    
        queue1.addMessage(m1);
        queue1.register(screen3);
        queue1.addMessage(m2);
        queue1.addMessage(m3);
        queue1.unRegister(screen3);
        queue1.addMessage(m4);

        antique.getWinnerPrice("s1234");
        antique.getWinnerPrice("s1111");
