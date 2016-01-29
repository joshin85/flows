/*
MVC test framework 

by Shinjo Melosh
*/

//Initializing Main Dom Observer 
var Observer = new Observer();  
function Observer(){
	
	//vars 
	this.antecedent = "flows"
	this.notaries;
/* Functionality is deprecated for now this will act as namespace for project*/

	this.init = function(){
		this.notaries = [];
	}
	
	this.registerListeners = function(notary){
		this.notaries.push(notary);
	}
	
	this.propogateVar = function(key, Var) {
	
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

	this.propogateEvent = function(Var) {
		Observer.notify();
	}
	
	this.propogateVar = function(Var) {

	}
	
	this.getListener = function() {
		return this[this.key] ;
	}
	
	this.setListener = function(Var) {
		this[this.key] = Var ;
		this.Var = Var ;
		
		/*This functionality will be replaced by a non dom based parse so that parent elements for variables arent required and the dom is not inflated by to much */
		//Select ALL dom elements with data attribute of this Variable Key 
		var domArray = document.querySelectorAll('[data-' + Observer.antecedent + '-' + this.key + ']')
		domArrayLength = domArray.length;
		for(var i = 0 ; i < domArrayLength ; i++) {
			domArray[i].innerText = this[this.key];
		}
	}
}

//Add Prototype
Variable.prototype = new listenerMethods();
function Variable(key, Var){
	
	this.init = function(key, Var){
		this[key] = Var;
		this.key = key; 
		this.Var = Var;
		/** /
		//If original object is modified then do callback (OTHERWISE ONLY MODIFYING THROUGH DATA OBJECT WILL DO CALLBACK)
		Object.defineProperty(this, this.key, {
			get: function(val) {
				return this;
			},
			set: function(val) {
				// Add event listeners to newVar: Called when newVar is set 
				this.setListener(val);
			}
		});
		/**/
	}	
	
	this.init(key, Var);
	this.key;
	this.Var; 
	
}


function Data(){

	this.init = function() {
		Observer.registerListeners(this);
	}
	
	this.dataChange = function() {
		//When a data Var from this DataContainer is changed this event is called...
		//document.getElementById("test").textContent = this.getVar(); 
	}
	
	this.addData = function(newVar, varName) {
	//If passed object with superclass of listenerMethods construct then add new variable to Data Object ELSE assume newVar needs to be constructed; 
		if(typeof newVar != typeof undefined && newVar.constructor.name == "listenerMethods") {
			this[newVar.key] = newVar;
		} else if(typeof varName != typeof undefined) {
			newVar = new Variable(varName, newVar);
			this[varName] = newVar;
		} else 
			console.error("This function requires an input whose prototype is listenerMethods or a value key pair : addData(value, key)");		
		
	/*-------------------------------------------------------------------------------*/
		//Add the getter and setter functions that are called when newVar is manipulated
		//THIS CODE MAKES THE OBJECT ITSELF IN ACCESSABLE -- You can
		Object.defineProperty(this, newVar.key, {
			get: function() {
				// Add event listeners to newVar: Called when newVar is accessed 
				return newVar.getListener();
			},
			set: function(val) {
				// Add event listeners to newVar: Called when newVar is set 
				newVar.setListener(val);
			}
		});
		//Add the getter and setter functions that are called when newVar is manipulated
	/*-------------------------------------------------------------------------------*/
	}
	
	this.init();
	
}

domStyle.prototype = new Data(); 
function domStyle(){
	/** /
	//Ints
	this.top;
	this.left;
	this.bottom;
	this.right;
	//Strings
	this.displayType = "";
	this.class = "";
	this.style = "";
	
	this.generateStyle = function(){
		
	}
	
	this.init = function(){
		this.addData("top", "");
		this.addData("left", "");
		this.addData("bottom", "");
		this.addData("right", "");
		this.addData("displayType", "");
		this.addData("style", "");
		this.addData("class", "");
	}
	
	this.init();
	/**/
} 

//Add Prototype
domElement.prototype = new Data();
function domElement(){
	
	this.init = function() {
		this.prototype = new Data();
	}
	
	this.newVar = function(newVar, varName) {
		this.addData(newVar, varName);
	}
		
	this.domAnalyzer = function(target) {
		
	}
	
	this.domStyle = new domStyle();
	this.currentStage;
	this.stageList;

	this.init();
}