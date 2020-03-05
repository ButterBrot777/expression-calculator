function eval() {
    // Do not use eval!!!
    return;
}

const priority = {
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
};

function expressionCalculator(expr) {
	return calculateResult(reversePolishNotation(expr));
}

function prepareArray(expr) { // create an array with numbers and operators and brackets
	expr = expr.split('').filter(elem => elem !== ' ');
	let arr = [],
		isNumb = 0;
	expr.forEach(elem => {
		if(!Number(elem) && elem != '0') {
			arr.push(elem);
			isNumb = false;
		} else if(isNumb) {
			arr[arr.length-1] += elem;
		} else {
			arr.push(elem);
			isNumb = true;
		}
	});
	//check if all brackets are paired
	let openBracket = [],
		closeBracket = [];
	arr.forEach(elem => {
		if(elem === '(') {
			closeBracket.push(elem);
		} if(elem === ')') {
			openBracket.push(elem);
		}
	})
	if(openBracket.length !== closeBracket.length) {
		throw new Error("ExpressionError: Brackets must be paired");
	}
	return arr;
}

function revPolNotationDefinePirority(current, lastInStack) { // set priority when we have brackets
	if(Number(current) || current === '0') {
		return 'first';
	} else if(current === '(' || current === ')') {
		if(current === '(') return 'second';
		if(current === ')' && priority[lastInStack]) return 'third';
		return 'fourth';
	} else {
		if(priority[current] <= priority[lastInStack]) return 'third';
		return 'second';
	}
}

function reversePolishNotation(expr) { // see https://m.habr.com/ru/post/282379/
	let arr = prepareArray(expr);
	let result = [], // array with result
		stackOfOperators = []; // stack for operators

	for (let i = 0; i < arr.length; i++) {
		let current = arr[i];
		let lastInStack = stackOfOperators[stackOfOperators.length-1];

		let inputPriority = revPolNotationDefinePirority(current, lastInStack);
		switch (inputPriority) {
			case 'first':
				result.push(current);
				break;
			case 'second':
				stackOfOperators.push(current);
				break;
			case 'third':
				result.push(stackOfOperators.pop());
				i--;
				break;
			case 'fourth':
				stackOfOperators.pop();
		}
	}
	while(stackOfOperators.length != 0) {
		result.push(stackOfOperators.pop());
	}
	result.forEach((elem, index) => {
		if(elem == '(' || elem == ')') {
			result.splice(index, 1);
		}
	});
	return result;
}

function calculateResult(expr) { // use reversed polnish notation we calculate the result
	for (let i = 0; i < expr.length; i++) {
		let operator = expr[i],
			operand1 = expr[i-2],
			operand2 = expr[i-1],
			result = 0;
		if(priority[expr[i]]) {
			switch (operator) {
				case '+':
					result = +operand1 + +operand2;
					break;
				case '-':
					result = +operand1 - +operand2;
					break;
				case '*':
					result = +operand1 * +operand2;
					break;
				case '/':
					if(operand1 == 0 || operand2 == 0) {
						throw new Error('TypeError: Division by zero.');
					}
					result = +operand1 / +operand2;
			}
			expr.splice(i-2, 3, result);
			i=0;
		}
	}
	return expr[0];
}

module.exports = {
    expressionCalculator
}