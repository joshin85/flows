/*
MVC test framework 

by Shinjo Melosh
*/

//Initializing Main Dom Observer 
var Observer = new Observer();  
function Observer(){
	
	//vars 
	this.notaries;
	
	this.init = function(){
		this.notaries = [];
	}
	
	this.registerListeners = function(notary){
		this.notaries.push(notary);
	}
	
	this.propogateValue = function(key, value) {
	
	}
	
	this.notify = function() {
		var notariesLength = this.notaries.length;
		for(var i = 0; i < notariesLength; i++) {
			this.notaries[i].dataChange();
		}
	}
	
	this.init();
	
}

//Override this prototype to change functionality of the notification method
function listenerMethods(){

	this.propogateEvent = function(value) {
		Observer.notify();
	}
	
	this.propogateValue = function(value) {

	}
	
	this.getListener = function() {
		return this[this.key] ;
	}
	
	this.setListener = function(val) {
		console.log(val);
		this[this.key] = val;
	}
}

//Add Super Class
Value.prototype = new listenerMethods();
function Value(key, value){
	
	//Setter - Propogate events when value is set 
	this.setValue = function(newValue) {
		this[thiskey] = newValue;
	}
	
	//Getter
	this.getValue = function() {
		return this[this.key];
	}
	
	this.getKey = function(){
		return this.key; 
	}
	
	this.setKey = function(newKey) {
		delete this[this.key];
		this.key = newKey;
	}
	
	this.init = function(key, value){
		this[key] = value;
		this.key = key; 
	}	
	
	this.init(key, value);
	this.key;
	this.value; 
	
}


function Data(){

	this.init = function() {
		Observer.registerListeners(this);
	}
	
	this.dataChange = function() {
		//When a data value from this DataContainer is changed this event is called...
		document.getElementById("test").textContent = this.getValue(); 
	}
	
	this.addData = function(newValue) {
		this[newValue.key] = newValue;
		/*-------------------------------------------------------------------------------*/
		//Add the getter and setter functions that are called when newValue is manipulated
		//THIS CODE MAKES THE OBJECT ITSELF IN ACCESSABLE -- You can
		Object.defineProperty(this, newValue.key, {
			get: function() {
				// Add event listeners to newValue: Called when newValue is accessed 
				return newValue.getListener();
			},
			set: function(val) {
				// Add event listeners to newValue: Called when newValue is set 
				newValue.setListener(val);
			}
		});
		//Add the getter and setter functions that are called when newValue is manipulated
	/*-------------------------------------------------------------------------------*/
	}
	
	this.init();
	
}

//Add Super Class
domElement.prototype = new Data();
function domElement(){
	
	this.init = function() {
		this.prototype = new Data();
	}
	
	this.newValue = function(newValue) {
		this.addData(newValue);
	
	}

	this.init();
}