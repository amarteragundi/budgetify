
//Budget Controller
var budgetController = (function(){

})();

// UI controller
var UIController = (function(){

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputSubmit: '.add__btn'
	}
	return {
		getInput: function(){
			return {
				type : document.querySelector(DOMStrings.inputType).value, // will be either income or expense
				description : document.querySelector(DOMStrings.inputDescription).value,
				value : document.querySelector(DOMStrings.inputValue).value
			}
		},
		getDOMStrings: function(){
			return DOMStrings;
		}
	}

})();

//  Global App controller
var controller = (function(budgetCtrl, UICtrl){
	var DOM = UICtrl.getDOMStrings();
	
	var ctrlAddItem = function(){
		// 1. get the field data from input.
		var input = UICtrl.getInput();
		console.log(input)
		// 2. Add the item to the budget controller.
		
		// 3.Add the item to UI
		
		// 4. calculate the budget.
		
		// 5. display the budget on UI
		
	}

	document.querySelector(DOM.inputSubmit).addEventListener('click', ctrlAddItem)

	document.addEventListener('keypress', function(event){
		if(event.keyCode == 13 || event.which == 13){
			ctrlAddItem()
		}
	});

})(budgetController, UIController);