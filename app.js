/*App: Budgetify
Author: Amar Teragundi*/

//Budget Controller
var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0)
			this.percentage = Math.round((this.value / totalIncome)  * 100);
		else
			this.percentage = -1;
	}

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	}

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(current, index, arr){
			sum += current.value
		});

		data.totals[type] = sum;
	}

	var data = {
		allItems : {
			exp : [],
			inc : []
		},
	 	totals : {
	 		exp : 0,
	 		inc : 0
	 	},
	 	budget : 0,
	 	percentage: -1
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
		deleteItem : function(type, ID){
			var ids, index;
			ids = data.allItems[type].map(function(curr, index, arr){
				return curr.id
			});

			index = ids.indexOf(ID);

			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}
		},
		calculateBudget: function(){
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget : income - expense
			data.budget = data.totals.inc - data.totals.exp

			// calculate the % of income we spent
			if(data.totals.inc > 0)
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			else
				data.percentage = -1;
		},

		calculatePercentages: function(){
			data.allItems.exp.forEach(function(curr, index, arr){
				curr.calcPercentage(data.totals.inc)
			})
		},

		getPercentages: function(){
			var allPercentages = data.allItems.exp.map(function(curr){
				return curr.getPercentage()
			})

			return allPercentages;
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalIncome : data.totals.inc,
				totalExpenses : data.totals.exp,
				percentage: data.percentage
			}
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
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incLabel: '.budget__income--value',
		expLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		itemPercentageLabel: '.item__percentage',
		monthLabel: '.budget__title--month'
	}

	var formatNumber =  function(num, type){
			var numSplit, int, dec;
			// formatting numbers with
			// + or -
			// 2 decimal points
			// ',' if in thousands.
			
			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.');

			int = numSplit[0];
			if(int.length > 3)
				int = int.substring(0, int.length - 3) + ',' + int.substring(int.length - 3, 3);
			dec = numSplit[1];

			type == 'exp' ? sign = '-' : sign = "+"

			return (type == 'exp' ? '-' : "+") + ' ' + int + '.' + dec
		}
	return {
		getInput: function(){
			return {
				type : document.querySelector(DOMStrings.inputType).value, // will be either income or expense
				description : document.querySelector(DOMStrings.inputDescription).value,
				value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
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
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'		
			}
			else if(type = 'exp'){
				element = DOMStrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			// replace placeholders with actuals

			var newHTML;

			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));


			// insert html to the DOM.

			document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
		},

		deleteListItem: function(selectorID){
			var el;
			el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		clearFields: function(){
			var fields, fieldsArray;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

			fieldsArray = Array.prototype.slice.call(fields);

			// clearing all input fields
			fieldsArray.forEach(function(current, index, array){
				current.value = "";
			});
			//  setting focus back to description
			fieldsArray[0].focus();
		},

		displayBudget: function(budgetObj){
			document.querySelector(DOMStrings.budgetLabel).textContent = budgetObj.budget;
			document.querySelector(DOMStrings.incLabel).textContent = budgetObj.totalIncome;
			document.querySelector(DOMStrings.expLabel).textContent = budgetObj.totalExpenses;
			document.querySelector(DOMStrings.percentageLabel).textContent = budgetObj.percentage > 0 ?  budgetObj.percentage + '%' : '-' ;
		},

		displayPercentage: function(perc){
			var fields = document.querySelectorAll(DOMStrings.itemPercentageLabel);

			var nodeListForEach = function(list, callBack){
				for(var i = 0; i < list.length; i++){
					callBack(list[i], i)
				}
			}

			nodeListForEach(fields, function(curr, index){
				if(perc[index] > 0)
					curr.textContent = perc[index] + '%';
				else
					curr.textContent = '---'

			})
		}

	}

})();

//  Global App controller
var controller = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function (argument) {

		var DOM = UICtrl.getDOMStrings();

		//  clcik event on submit button
		document.querySelector(DOM.inputSubmit).addEventListener('click', ctrlAddItem)

		//  keypress event on enter key
		document.addEventListener('keypress', function(event){
		if(event.keyCode == 13 || event.which == 13){
			ctrlAddItem()
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)


	}

	var updateBudget = function(){
		// 1. calculate the budget.
		budgetCtrl.calculateBudget()

		// 2. returns budget
		var budget = budgetCtrl.getBudget()

		// 3. display the budget on UI
		UICtrl.displayBudget(budget);
	}

	var updatePercentage = function(){
		//  1. calculate percentage
		 budgetCtrl.calculatePercentages();
		// 2. read percentage from budget controller 
		var percentages = budgetCtrl.getPercentages();
		// 3. Update the UI with new percentages
		UICtrl.displayPercentage(percentages);
	}

	var ctrlAddItem = function(){

		var input, newItem

		// 1. get the field data from input.
		input = UICtrl.getInput();
		if(input.description !== "" && !isNaN(input.value) && input.value > 0){

			// 2. Add the item to the budget controller.
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3.Add the item to UI
			UICtrl.addListItem(newItem, input.type)

			//  4. clear the fields
			UICtrl.clearFields()

			//  5. calculate and update budget
			updateBudget();

			// 6. calculate and update percentages
			updatePercentage()
		}
	}

	// delete the items usibg event delegation
	var ctrlDeleteItem = function(event){
		var itemID,splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseFloat(splitID[1]);

			// 1. delete the item fro data structure
			budgetCtrl.deleteItem(type, ID)

			// 2. delete the item from UI
			UICtrl.deleteListItem(itemID)

			// 3. Update and show the new budget
			updateBudget()

			// 4. calculate and update percentages
			updatePercentage()
		}

		console.log(type, ID)
	}

	return {
		init: function() {
			var initBudget = {
				budget: 0,
				totalIncome : 0,
				totalExpenses : 0,
				percentage: -1
			}
			setupEventListeners();
			UICtrl.displayBudget(initBudget);
		}
	}

})(budgetController, UIController);

// Initalize the DOM and events
controller.init();