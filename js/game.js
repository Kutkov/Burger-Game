// begin view

var view = {
	showCount: function (count) {
		var elCount = document.getElementById('area_game__user_count--total');
		elCount.innerHTML = count;
	},

	showMsg: function(msg) {
		var elMessage = document.getElementById('area_game__user-message--msg');
		elMessage.innerHTML = msg;
	},

	showShip: function (id, color) {
		var elShip = document.getElementById(id);
		if (color == 'red') {
			elShip.setAttribute('class', 'ship-red');
		} else if (color == 'blue') {
			elShip.setAttribute('class', 'ship-blue');
		}
	},

	showAsteroid: function(id) {
		var elAsteroid = document.getElementById(id);
		elAsteroid.setAttribute('class', 'asteroid');
	},

	winner: function () {

	},

	lose: function () {
		alert('u lose');
	}
};


// end view

// begin model

var model = {
	sizeMap: 7,
	numBurger: 6,
	lengthBurger: 3,
	destroyBurger: 0,

	mapBurger: [
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "red"  },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "blue" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "red"  },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "blue" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "blue" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "blue" }

	],

	shot: function (id) {
		console.log(this);
		for (var i = 0; i < this.numBurger; i ++) {
			var mapBurger = this.mapBurger[i];
			var posDamage = mapBurger.position.indexOf(id);

			if(posDamage >= 0) {
				if (mapBurger.damage[posDamage] === 'loss') {
					return true;
				}
				mapBurger.damage[posDamage] = 'loss';
				var color = mapBurger.color;

				if(this.checkDestroyedBurger(mapBurger)) {
					this.destroyBurger++;
					return {
						id,
						color,
						status: 3
					};
				}
				return {
					id,
					color,
					status: 1
				};
			}
		};
		return id;
	},

	checkDestroyedBurger: function (burger) {
		for (var i = 0; i < this.lengthBurger; i++) {
			if (burger.damage[i] === "") {
				return false;
			}
		};
		return true;
	},

	createBurgerPos: function () {
		var col = 0;
		var row = 0;
		var location = Math.floor(Math.random() * 2);
		var burgerPosition = [];

		if( location === 1) {
			row = Math.floor(Math.random() * this.sizeMap);
			col = Math.floor(Math.random() * (this.sizeMap - this.lengthBurger + 1));
		} else {
			row = Math.floor(Math.random() * (this.sizeMap - this.lengthBurger + 1));
			col = Math.floor(Math.random() * this.sizeMap);
		}

		for (var i = 0; i < this.lengthBurger; i++) {
			if (location === 1) {
				burgerPosition.push(row + '' + (col + i));
			} else {
				burgerPosition.push((row + i) + '' + col);
			}
		};

		return burgerPosition;
	},

	checkRepeatsPos: function (position) {
		for (var i = 0; i < this.numBurger; i++) {
			var mapBurger = this.mapBurger[i];
			for (var j = 0; j < position.length; j++) {
				if (mapBurger.position.indexOf(position[j]) >= 0) {
					return true;
				}
			};
		};

		return false;
	},

	createMapBurger: function () {
		var position;
		for (var i = 0; i < this.numBurger; i++) {

			do{
				position = this.createBurgerPos();
			} while (this.checkRepeatsPos(position));
			this.mapBurger[i].position = position;
		};
	}

};


// model end

// begin controller

var controller = {

	numShots: 3,

	createBurger: function () {
		model.createMapBurger();
		view.showCount(this.numShots);
	},

	shotShip: function (id) {
		

		if (id) {
			console.log('ee = ' , id);
			var loss = model.shot(id);
			console.log('loss = ', loss);
			if (loss === true) {
				view.showMsg("Этот бургер уже найден!");
			} else if (loss.status === 3) {
				view.showShip(loss.id, loss.color);
				view.showMsg("Отлично три бургера найдены!");
			} else if (loss.status === 1) {
				view.showShip(loss.id, loss.color);
				view.showMsg("Ты ухватил эту булку!");
			} else if (typeof(loss) == 'string') {
				view.showAsteroid(loss);
				view.showMsg("Горячие котлетки были здесь");
				this.numShots--;
				view.showCount(this.numShots);
				if(this.numShots === 0){
					view.lose();
				}
			}
			
			if (loss && (model.destroyBurger === model.numBurger)) {
				// var count = Math.round((model.numBurger * 3 / this.numShots) * 1000);
				view.showMsg("Отлично! Ты нашел все ketch up и смог накормить друзей!");
				// view.showCount(count);
			}
		}
	},

	hoverClick: function (id) {
		var el = document.getElementById(id);
		console.log(el);
		console.log(id);
		el.onmouseover = function (e) {
			e = e || window.event;

			if (e.target.id !== '') {
				e.target.style.transition = '0.5s';
				e.target.style.backgroundColor = 'rgba(104, 142, 218, 0.33)';


				e.target.onclick = function () {
					var c = this.getAttribute('data-title');
					var k = this.id;

					controller.shotShip(k);
				};

			}
		};

		el.onmouseout = function (e) {
			e = e || window.event;
			if (e.target.id !== '') {
				e.target.style.backgroundColor = 'inherit';
			}
		};
	},

	// createDataTitle: function () {
	// 	var elCell = document.getElementsByTagName('td');
	// 	for (var i = 0; i < elCell.length; i++) {
	// 		if (elCell[i].id !== '') {
	// 			var value = elCell[i].getAttribute('id');
	// 			var element = elCell[i];
	// 			var letter = element.parentNode.firstElementChild.firstElementChild.innerHTML;

	// 			elCell[i].setAttribute('data-title', letter + value.charAt(1));
	// 		}
	// 	};
	// },

	// hBtnClick: function () {
	// 	var el = document.getElementById('crdInput');

	// }




};

// end controller

// begin anonymous initialize function

(function() {
  
	var start = {

		init: function () {
			this.main();
			this.control();
			this.event();
		},

		// main() - Основной код для проекта, например подключать и настраивать плагины и т.д
		main: function () {

		},

		// control() - Запускаем необходимые методы объекта "controller"
		control: function () {

			// Генерируем позиции кораблей и помещаем в массив spaceships
			controller.createBurger();
			// Создаем атрибут (data-title) для ячеек td (кроме 1 столбца и 1 ряда)
			// controller.createDataTitle();


		},
		
		// event() - Здесь мы регистрируем, вызываем "Обработчики событий"
		event: function () {

			// var btnShot = document.getElementById("btnShot");
			// Регистрируем обработчик события "тип события: onclick", "цель события: элемент с id btnShot",
			// "обработчик события: hBtnClick()"
			// btnShot.onclick = controller.hBtnClick;

			// var elCrdInput = document.getElementById("crdInput");
			// elCrdInput.onkeypress = controller.hKeyPress;

			/* 
				Вызываем метод "hoverClick()" объекта "controller".
				Метод "hoverClick()" также относиться к обработчику события. Внутри данного метода уже содержаться обработчики событий.
			*/

			console.log('it true');

			controller.hoverClick("area_game__table");

		}

	};
	
	// запускаем init() - выполняет запуск всего кода
	start.init();

}());

// end anonymous function