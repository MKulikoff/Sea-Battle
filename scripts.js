const view = {
	
	displayMessage: function(msg) {
		let messageArea = document.querySelector('.message');
		messageArea.innerHTML = msg;
	 
	},

	displayHit: function(location) {
		let cell = document.getElementsByClassName(location)[0].classList.add('hit');
	},

	displayMiss: function(location) {
		let cell = document.getElementsByClassName(location)[0].classList.add("miss");
	},
	
}; 

const model = {
	shipLength: 3, 
	numShips: 3, 
	boardSize: 7,
	shipsSunk: 0, 

	ships:  [
		{
			locations: [0, 0, 0],
			hits: ['', '', ''],
		},

		{
			locations: [0, 0, 0],
			hits: ['', '', ''],
		},

		{
			locations: [0, 0, 0],
			hits: ['', '', '']
		}
	],

	fire: function(guess) {
		for(let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];  
			let index = ship.locations.indexOf(guess); 
			if (index >= 0) {
				ship.hits[index] = 'hit'; 
				view.displayMessage("HIT!");
				view.displayHit(guess);
					if(this.isSunk(ship)) {
						view.displayMessage('BattleShip is sunk!');
						this.shipsSunk++; 
					}
					return true;
			}  
		} 
				view.displayMessage("MISSED!");
				view.displayMiss(guess);
				return false;
	}, 

	isSunk: function(ship) {
		for(let i = 0; i < this.shipLength; i++) {
			if(ship.hits[i] !== 'hit') {
				return false;
			}
		}
		return true; 
	}, 

	generateShipsLocation: function() {
		let locations; 
		for (let i = 0; i < this.numShips; i++) {
			do {
				location = this.generateShip(); 
			} 
		 while (this.collision(locations));  
		this.ships[i].locations = locations; 
	}
	},

	generateShip: function() {
		let direction = Math.floor(Math.random() * 2); 
		let row, col; 

		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * this.boardSize - this.shipLength + 1); 
			} else {
			row = Math.floor(Math.random() * this.boardSize - this.shipLength + 1); 
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = []; 

		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" +  (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col); 
			}
		}

		return newShipLocations; 

	},

	collision: function(locations) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i]; 
			for (let j = 0; j < locations.length; j++) {
				if (ship.locaitons.indexOf(locations[j]) >= 0) {
					return true; 
				}
			}
		}
		return false; 
	}
}

const controller = {
	guesses: 0,

	processGuess: function(guess) {
		let location = parseGuess(guess); 
		if(location) {
			this.guesses++; 
			let hit = model.fire(location); 
			if (hit && model.shipsSunk === model.numShips) {
				alert(`Ты потопил все мои корабли за ${this.guesses} выстрелов`);
				location = 0; 
			}
		}
	}
}

function parseGuess(guess) {

		let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
		if(guess === 0 || guess.length !== 2) {
			alert('Error this'); 
		} else {
			let letter = guess.charAt(0);
			let row = alphabet.indexOf(letter); 
			let column = guess.charAt(1);

			if(isNaN(row) || isNaN(column)) 
				{
				alert('Incorrect input'); 
				} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize)
				{
					alert("Oops, that's off the board!");
				} else 
				{
					return row + column; 
				}
		}
		return null; 
}

function handlerFireButton() {
	let guessInput = document.querySelector('.form-text'); 
	let guess = guessInput.value.toUpeerCase(); 
	
	controller.processGuess(guess);

	guessInput.value = ''; 
	}

function handleKeyPress(e) {
		let fireButton = document.getElementById('fireBtn');
		
		e = e || window.event;

		if (e.keyCode === 13) {
			fireButton.addEventListener('click', () => {
			return false; 
		});
		
	}
}

window.addEventListener('load', () => {
	console.log('page is fully loaded');
	init(); 
}); 

function init() {
	let fireButton = document.getElementById('fireBtn');
	console.log(fireButton); 
	fireButton.addEventListener('click', () => {
		handlerFireButton(); 
	});  

	let guessInput = document.querySelector('.form-text'); 
	guessInput.addEventListener('onkeypress', () => {
		handleKeyPress();  
	}); 

	model.generateShipsLocation(); 
}
