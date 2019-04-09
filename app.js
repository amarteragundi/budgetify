
//Budget Controller
var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems : {
			exp : [],
			inc : []
		},
	 	totals : {
	 		exp : 0,
	 		inc : 0
	 	}
	}

	return {
		addItem: function(type, description, val){
			var newItem, ID;

			// create a new id
			if(data.allItems[type].length > 0)
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			else
				ID = 0;

			if(type == 'exp'){
				newItem = new Expense(ID, description, val)
			}else if(type == 'inc'){
				newItem = new Income(ID, description, val)
			}

			// pushing it into the data structure
			data.allItems[type].push(newItem);
			// return the new element
			return newItem;
			
		},

		testing: function(){
			console.log(data)
		}
	}

})();

// UI controller
var UIController = (function(){

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputSubmit: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list'
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
		},

		addListItem: function(obj, type){

			var html, expense;
			// create html string with placeholders
			if(type == 'inc'){
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'		
			}
			else if(type = 'exp'){
				element = DOMStrings.expenseContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			// replace placeholders with actuals

			var newHTML;

			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', obj.value);


			// insert html to the DOM.

			document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
		},

		clearFields: function(){
			var fields, fieldsArray;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

			fieldsArray = Array.prototype.slice.call(fields);

			// clearing all input fields
			fieldsArray.forEach(function(current, index, array){
				current.value = "";
			});
		}
	}

})();

//  Global App controller
var controller = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function (argument) {

		var DOM = UICtrl.getDOMStrings();
		
		document.querySelector(DOM.inputSubmit).addEventListener('click', ctrlAddItem)

		document.addEventListener('keypress', function(event){
		if(event.keyCode == 13 || event.which == 13){
			ctrlAddItem()
			}
		});
	}
	
	var ctrlAddItem = function(){

		var input, newItem
		// 1. get the field data from input.
		input = UICtrl.getInput();
		
		// 2. Add the item to the budget controller.
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		// 3.Add the item to UI
		UICtrl.addListItem(newItem, input.type)
		//  4. clear the fields
		UICtrl.clearFields()
		// 5. calculate the budget.
		
		// 6. display the budget on UI
		
	}

	return {
		init: function() {
			setupEventListeners();
		}
	}

})(budgetController, UIController);

// Initalize the DOM and events
controller.init();