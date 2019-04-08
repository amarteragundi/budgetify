
//Budget Controller
var budgetController = (function(){

})();

// UI controller
var UIController = (function(){


})();

//  Global App controller
var controller = (function(budgetCtrl, UICtrl){
	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)
		var ctrlAddItem = function(){
			// 1. get the field data from input.
			
			// 2. Add the item to the budget controller.
			
			// 3.Add the item to UI
			
			// 4. calculate the budget.
			
			// 5. display the budget on UI
			
		}

	document.addEventListener('keypress', function(event){
		if(event.keyCode == 13 || event.which == 13){
			ctrlAddItem()
		}
	});

})(budgetController, UIController);