var clock = new domElement();

var seconds = new Variable("seconds", 60);
var minutes = new Variable("minutes", 60);
var hours = new Variable("hours", 60);

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
