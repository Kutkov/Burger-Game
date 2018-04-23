// begin view
// var playerName = JSON.parse(localStorage.getItem('name'));
// console.log(playerName);

var view = {
	// Отображает счет
	showCount: function (count) {
		var elCount = document.getElementById('area_game__user_count--total');
		elCount.innerHTML = count;
	},
	// Отображает сообщение
	showMsg: function(msg) {
		var elMessage = document.getElementById('area_game__user-message--msg');
		elMessage.innerHTML = msg;
	},
	// Отображает найденный бургер
	showBurger: function (id, color) {
		var elBurger = document.getElementById(id);
		elBurger.setAttribute('class', color);
	},
	// Отображает логотип (кетчап) при промохе
	showLogo: function(id) {
		var elLogo = document.getElementById(id);
		elLogo.setAttribute('class', 'brend');
	},
	// Отображает блок с информацией перекрывающий игровое поле
	showBodyWrapp: function(wrapp, btn) {
		var bodyWrapp = document.getElementById(wrapp);
		var btnNextRound = document.getElementById(btn);
		bodyWrapp.style.display = 'flex';
		setTimeout(function() {
			btnNextRound.style.visibility = 'visible';	
		}, 1500);
	},

	// Удаляет все бургеры и логотипы(промохи) с поля
	clearClass: function() {
		var elCell = document.getElementsByTagName("td");
		for (var i = 0; i < elCell.length; i++) {
			elCell[i].removeAttribute('class');
		}
	},
	// При нажатии кнопки нового раунда скрывает блок перекрывающий игровое поле
	hideBodyWrapp: function(wrapp, btn) {
		var bodyWrapp = document.getElementById(wrapp);
		var btnNextRound = document.getElementById(btn);
		bodyWrapp.style.display = 'none';
		btnNextRound.style.visibility = 'hidden';	

	},

	winner: function () {

	}
};


// end view

// begin model


var model = {
	sizeMap: 7, // Размер карты
	numBurger: 6, // Количество бургерных столов
	lengthBurger: 3, // Количество бургеров на столе
	destroyBurger: 0, // Найденные бургерные столы
	missShot: [],

	mapBurger: [
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "burger0" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "burger1" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "burger2" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "burger3" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "burger4" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "burger5" }

	],

	// Производит "выстрел" и проверку на поподание
	shot: function (id) {

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

		if(this.missShot.indexOf(id) == -1){
			this.missShot[this.missShot.length] = id;
		}else{
			return false;
		}

		return id;

	},
	// Проверяет полностью найденный стол (3 бургера)
	checkDestroyedBurger: function (burger) {
		for (var i = 0; i < this.lengthBurger; i++) {
			if (burger.damage[i] === "") {
				return false;
			}
		};
		return true;
	},
	// Создаем позиции бургеров (вертикальную или горизонтальную)
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
	// Проверяем на повторение позиции
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
	/* 
		объединяет в себе функции createBurgerPos() и checkRepeatsPos(),
		генерирует бургеры в массиве mapBurger[]
		очищает попадания из прошлого раунда	
	*/ 
	createMapBurger: function () {
		var position;
		for (var i = 0; i < this.numBurger; i++) {

			do{
				position = this.createBurgerPos();
			} while (this.checkRepeatsPos(position));
			this.mapBurger[i].position = position;
			this.mapBurger[i].damage = ["", "", ""];
		};
	},

	openMapBurger: function () {
		for (var i = 0; i < this.numBurger; i++) {
			for(var j =0; j < this.lengthBurger; j++){
				view.showBurger(this.mapBurger[i].position[j], this.mapBurger[i].color);
			}
		};
	}

};
// model end

// begin controller
var controller = {
	// количество допустимых выстрелов
	numShots: 30,
	// Сгенерировать бургеры
	createBurger: function () {
		model.createMapBurger();
		view.showCount(this.numShots);
	},
	// Очистить поле и показать страницу поражения
	clearMap: function() {
		model.openMapBurger();
		model.missShot.length = 0;
		view.showBodyWrapp('body-wrapp', 'next-round');
		setTimeout(function(){
			view.clearClass();
			controller.numShots = 10;
			controller.createBurger();
		}, 1500);
	},
	// Объединяет в себе вызов методов из model и view
	shotBurger: function (id) {
		
		if (id) {

			var loss = model.shot(id);

			if (loss === true) {
				view.showMsg("Хей! Этот бургер уже найден.");
			} else if (loss === false) {
				view.showMsg("Хех ты хочешь промахнуться дважды ? Ты явно не промах, друг.");
			} else if (loss.status === 3) {
				view.showBurger(loss.id, loss.color);
				view.showMsg("Отлично! Этот сет найден.");
			} else if (loss.status === 1) {
				view.showBurger(loss.id, loss.color);
				view.showMsg("Вот это Ketch up Burger");
			} else if (typeof(loss) == 'string') {
				view.showLogo(loss);
				view.showMsg("Ты достаточно мотивирован?");
				this.numShots--;
				view.showCount(this.numShots);
				if(this.numShots === 0){
					this.clearMap();
				}
			}
			if (model.destroyBurger === model.numBurger) {

				view.showMsg("Ура! Ты нашел все Ketch up Burger и смог накормить друзей!");
				view.showBodyWrapp('winner-page', 'next-level');
			}
		}
	},
	/* 
		при наведении курсора на элемент ячейки таблицы меняет стиль.
		Также регистрирует событие onclick на наведенном элементе
		Регистрирует событие onclick на кнопке вызова нового раунда
	*/
	hoverClick: function (id) {
		var el = document.getElementById(id);
		var btnNextRound = document.getElementById('next-round');
		var btnStartGame = document.getElementById('start-game');
		el.onmouseover = function (e) {
			e = e || window.event;

			if (e.target.id !== '') {
				e.target.style.transition = '0.5s';
				e.target.style.backgroundColor = 'rgba(104, 142, 218, 0.33)';

				e.target.onclick = function () {
					var k = this.id;
					controller.shotBurger(k);
				};
			}
		};

		el.onmouseout = function (e) {
			e = e || window.event;
			if (e.target.id !== '') {
				e.target.style.backgroundColor = 'inherit';
			}
		};

		btnNextRound.onclick = function () {
			view.hideBodyWrapp('body-wrapp', 'next-round');
		};
		btnStartGame.onclick = function () {
			view.hideBodyWrapp('start-page', 'start-game');
		};
	}
};

// end controller

// begin anonymous initialize function

(function() {
  
	var start = {

		init: function () {
			this.control();
			this.event();
			this.main();
		},

		main: function() {
			view.showBodyWrapp('start-page', 'start-game');	
		},

		// control() - Запускаем необходимые методы объекта "controller"
		control: function () {
			// Генерируем позиции бургеров и помещаем в массив spaceships
			controller.createBurger();
		},
		
		// event() - Здесь мы регистрируем, вызываем "Обработчики событий"
		event: function () {
			controller.hoverClick("area_game__table");
		}
	};
	
	// запускаем init() - выполняет запуск всего кода
	start.init();

}());

// end anonymous function