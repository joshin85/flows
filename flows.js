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
	
	this.getObj = function(){
		return this;
	}
	
	this.getListener = function() {
		return this[this.key];
	}
	
	this.setListener = function(Var) {
		this[this.key] = Var ;
		this.Var = Var ;
		this.onChange();
	}
	
	this.onChange = function(){
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
	
	this.setChangeListener = function(newChangeListener){
		if(typeof newChangeListener == typeof Function)
			this.setListener = newChangeListener;
		else 
			console.error("This function required an input of type function, was passed typeof : " + typeof newChangeListener);
	}
	
	this.setGetListener = function(newGetListener){
		if(typeof newGetListener == typeof Function)
			this.setListener = newGetListener;
		else 
			console.error("This function required an input of type function, was passed typeof : " + typeof newGetListener);
	}
	
	this.init(key, Var);
	this.key;
	this.Var; 
	
}


function Data(){

	this.init = function() {
		Observer.registerListeners(this);
	}
	
	this.getObj = function(key){
		return this[key];
	}
	
	/* deprecated */
	this.dataChange = function() {
		//When a data Var from this DataContainer is changed this event is called...
		//document.getElementById("test").textContent = this.getVar(); 
	}
	
	this.addData = function(newVar, varName) {
	//If passed object with prototype of listenerMethods then add new variable to Data Object ELSE assume newVar needs to be constructed; 
		if(typeof newVar != typeof undefined && newVar.constructor.name == "listenerMethods") {
			this[newVar.key] = newVar;
		} else if(typeof varName != typeof undefined) {
			newVar = new Variable(varName, newVar);
			this[varName] = newVar;
		} else 
			console.error("This function requires an input whose prototype is listenerMethods or a value key pair : addData(value, key)");		
	/*-------------------------------------------------------------------------------*/
		//Add the getter and setter functions that are called when newVar is manipulated
		//THIS CODE MAKES THE OBJECT ITSELF IN ACCESSABLE -- You can access the object only if you instantiate it outside of the object 
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
		this[newVar.key] = newVar.Var;
	}
	
	this.init();
	
}
/* buggy */
domClasses.prototype = new Data();
function domClasses(ParentObject, id){
	
	this.classes = "";
	
	this.updateClass = function(){
		document.getElementById(this.id).className = this.classes;
	}
	
	this.addClass = function(className) {
		this.classes +=  className + " ";
		this.updateClass();
	}
	
	this.removeClass = function(className) {
		this.classes = this.classes.replace(className + " ", " ");
		this.updateClass();
	}
	
	this.init = function(id){
		this.id = id;
		var classString  = document.getElementById(id).className;
		var currentClasses = classString.split(" ");
		var numClasses = currentClasses.length;
		console.log(currentClasses);
		for (i = 0; i < numClasses; i++){
			console.log(currentClasses[i]);
			this.addClass(currentClasses[i]);
		}
	}
	
	this.init(id);
	
}

domStyle.prototype = new Data(); 
function domStyle(ParentObject, id){
	
	this.style = "";
	
	this.generateStyle = function(val){
		var newStyle = "";
		var parentObj = this.ParentObject;
		this.Var = val;
		this[this.key] = val;
		Object.keys(parentObj).forEach(function(key,index) {
			var objProp = parentObj[key];
			if(typeof objProp == typeof "" && objProp != null && key != "style") {
				newStyle += key + " : " + objProp + ";" ;
			}
		});
		parentObj.style = newStyle;
		document.getElementById(parentObj.id).style = parentObj.style;
	}
	
	property.prototype = new Variable();
	function property(key, value, ParentObject){
		this.ParentObject = ParentObject;
		this.init(key, value);
	}
	
	this.css = function(key, value) {
		var newProp = new property(key, value, this);
		newProp.setChangeListener(this.generateStyle);
		this.addData(newProp);
	}
	
	this.init = function(ParentObject, id){
		this.id = id;
		this.ParentObject = ParentObject;		
	}
	
	
	this.init(ParentObject, id);
	/**/
} 

//Add Prototype
domElement.prototype = new Data();
function domElement(target){
	
	this.init = function() {
		this.flow = [];
		this.classes = new domClasses(this, target);
		this.style = new domStyle(this, target);
		this.currentStage;
		this.stageList;
	}
	
	this.newVar = function(newVar, varName) {
		this.addData(newVar, varName);
	}
		
	this.domAnalyzer = function(target) {
		//This will be used for parsing dom -- will replace data-flows method
	}
	
	this.updateAll = function(){
		Object.keys(this).forEach(function(key,index) {
			var objProp = this[key];
			if(objProp instanceof Variable){
				objProp.onChange();
			}
		});
	}
	
	this.css = function(key, target) {
		this.style.css(key, target);
	}
	
	this.addClass = function(className){
		this.classes.addClass(className);
	}
	
	this.removeClass = function(className){
		this.classes.removeClass(className);
	}
				
	/* Not sure if this is useful yet development paused */
	this.setStage = function(stage) {
		if(typeof stage == "Number"){
			stage = flow[stage];
		} else if(typeof stage == "Object") {
			stage = stage;
		}
		
		this.updateDataObject(stage);
		
	}
	
	this.addStage = function(newStage){
		flow.push(newStage);
	}

	this.flow;
	this.classes;
	this.style;
	this.currentStage;
	this.stageList;
	
	this.init();
}

function ActiveElement(target){

	this.init = function(target) {
		this.Element = new domElement(target);
	}
	
	this.update = function(newElement){
		this.Element = newElement;
		this.Element.updateAll();
	}
	
	
	
	this.init(target);
	
}