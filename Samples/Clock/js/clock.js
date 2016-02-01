var clock = new domElement("clock");

var seconds = new Variable("seconds", 59);
var minutes = new Variable("minutes", 59);
var hours = new Variable("hours", 23);

clock.newVar(seconds);
clock.newVar(minutes);
clock.newVar(hours);

timer(updateTimer, clock.seconds);

function timer(callback, timeLeft){
	setTimeout(function(){
		clock.seconds--;
		updateTimer(clock.seconds);
	
		if(clock.seconds == 0){
			clock.seconds = 60;
		}
		
		timer(callback, timeLeft);
	}, 1000);
}

function updateTimer(seconds) {
	if(clock.minutes == 0)
		clock.hours--;
	if(clock.seconds == 0)
		clock.minutes--;
}
