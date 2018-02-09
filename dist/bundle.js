/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polynetz_js__ = __webpack_require__(1);


let colors = ["#3444FF", "#FF2B25", "#B616E8", "#E8964C", "#FFE46A"];

function init() {
	this.polynetz = new __WEBPACK_IMPORTED_MODULE_0__polynetz_js__["a" /* default */]({
		background_color: "#222",
		line_color: "tomato",
		slices: 10,
		connection_radius: 100,
		max_connection_radius: 150,
		connection_mode: "freeze_under_mouse",
		render_poly: true,
		freeze_multiplier: 0.75,
		mouse: {
			push_radius: 100,
			freeze_radius: 100,
			size_radius: 5,
			color: "white",	
		},
		debug: {
			grid: false,
			connection_radius: false,
			render_connection_grid: false,
			render_push_radius: false,
			render_freze_radius: false,
		},
		poly: {
			speed_multiplikator: 3,
			size_radius: 3,
			color: "#ff6347",
		},
	});

	this.polynetz.init();

	this.polynetz.addEventlistener("click", evt => {
		this.polynetz.addPoly({
			x: evt.clientX, 
			y: evt.clientY,
		}, {
			color: "rgba(255,255,255,0.65)",
			size_radius: 2,
		});
	});

	this.polynetz.addEventlistener("reset", evt => {
		console.log(`Cleared: ${evt.amount}`);
		spawnBulk(100, {x: 200, y: 300}, true, false);
	});

	this.polynetz.start(30);

	/*
	this.polynetz.addConnectionFunction("test", function() {
		if (!this.test_x) this.test_x = 0;
		if (!this.test_y) this.test_y = 0;
	
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.test_y);
		this.ctx.lineTo(this.test_x, this.test_y);
		this.ctx.stroke();    
	
		this.test_x += 10;
		if (this.test_x > this.width) {
			this.test_x = 0;
			this.test_y += 10;
		}
	});
	*/
}

let getRandomColor = () => colors[Math.round(Math.random() *4)];
let getRandomNumber = (min, max) => Math.round(min + (Math.random() * (max - min)));

function spawnBulk(amount, randomColor, randomRadius) {
	for (let i = 0; i < amount; i++) {
		let radius = getRandomNumber(2, 6);
		console.log(`Created Poly with Radius of ${radius}`);
		this.polynetz.addPoly({x: 0, y:0 }, { color: randomColor ? getRandomColor() : "white", radius: randomRadius ? radius : 10 });
	}
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__default_functions_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__poly_js__ = __webpack_require__(3);



class Polynetz {
  constructor(config) {
    // Variablen erstellen 
    this.poly_config = {}; this.config = {}; this.canvas = null; this.parent_object = null;
    this.poly_netz = null; this.width = 0; this.height = 0; this.all_polys = []; this.loop = null;
    this.all_polys_by_color = {}; this.reset_event_callback = function() {}; this.grid_size = {}; this.context = null;
    this.mouse_location = {x: 0, y: 0}; this.canvas_bounding_rect = {};

    this.connection_functions = {};

    // Konfiguartion laden
    this.loadConfig(config || {});
  }

  addPoly(location, custom_config) {
    let poly_netz_x = Math.floor(location.x / this.blocksize_width);
    let poly_netz_y = Math.floor(location.y / this.blocksize_height);
    // Neuen Poly erstellen mit allen relevanten optionen
    let poly = new __WEBPACK_IMPORTED_MODULE_1__poly_js__["a" /* default */](location, {gx: poly_netz_x, gy: poly_netz_y}, Object.assign({}, this.poly_config, custom_config || {}), this);

    // Poly zum Array mit allen Polys hinzufügen
    this.all_polys.push(poly);

    // Poly zu seiner Farbe hinzufügen
    if (this.all_polys_by_color[poly.config.color]) {
      this.all_polys_by_color[poly.config.color].push(poly);
    } else {
      this.all_polys_by_color[poly.config.color] = [poly]
    }

    // Poly zum Grid hinzufügen
    if (this.poly_netz[poly_netz_x][poly_netz_y]) {
      this.poly_netz[poly_netz_x][poly_netz_y].push(poly) 
    } else {
      this.poly_netz[poly_netz_x][poly_netz_y] = [poly];
    }
  }

  update() {
    // alles clearen
    this.ctx.clearRect(0, 0, this.width, this.height);

    // debuging
    if (this.config.debug) {
      if (this.config.debug.grid) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white"; 
        // Horizontalen Linien
        for (let grid_y = 0; grid_y < this.height; grid_y += this.blocksize_height) {
          // zwei breiten Strich zeichnen
          this.ctx.moveTo(0, grid_y);
          this.ctx.lineTo(this.width, grid_y);
        }
        // Vertikalen Linien
        for (let grid_x = 0; grid_x < this.width; grid_x += this.blocksize_width) {
          this.ctx.moveTo(grid_x, 0);
          this.ctx.lineTo(grid_x, this.height);
        }
        this.ctx.lineWidth = 1;
        this.ctx.stroke();        
      }
      if (this.config.debug.connection_radius) {
        this.ctx.beginPath()
        for (let poly_index = 0; poly_index < this.all_polys.length; poly_index++) {
          this.ctx.moveTo(this.all_polys[poly_index].location.x, this.all_polys[poly_index].location.y);
          this.ctx.arc(this.all_polys[poly_index].location.x, this.all_polys[poly_index].location.y, this.config.connection_radius, 0, Math.PI * 2);
          this.ctx.arc(this.all_polys[poly_index].location.x, this.all_polys[poly_index].location.y, this.config.max_connection_radius, 0, Math.PI * 2);      
        }
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
      }
    }

    // führt alle aktivierten connection funktionen aus
    for(let connection_name in this.connection_functions) {
      if (this.connection_functions[connection_name] == null) continue;
      this.connection_functions[connection_name].bind(this)();
    }
  }

  updateAllPolys() {
    // Lokation und Grid aktualisieren
    for (let poly of this.all_polys) {
      poly.updateLocation();
      poly.updateGridLocation();
    }
  }

  updateConfig(config) {
    if (config.poly) Object.assign(this.poly_config, config.poly);
    Object.assign(this.config, config);
    this.styleParentObject();
  }

  loadConfig(config) {
    let default_config = {
      background_color: "#222",
      line_color: "white",
      slices: 10,
      connection_radius: 100,
      max_connection_radius: 200,
      connection_mode: "connect_them_all",
      //connection_mode: "connect_them_all_and_mouse",
      //connection_mode: "connect_only_mouse",
      //connect_to_mouse: false,
      //only_connect_to_mouse: false,
      render_poly: true,
      freeze_multiplier: 1,
      debug: {
        grid: false,
        connection_radius: false,
        render_connection_grid: false,
        render_freeze_radius: false,
      },
      mouse: {
        freeze_radius: 100,
        push_radius: 100,
        size_radius: 5,
        color: "white",
      },
      poly: {
        speed_multiplikator: 1,
        size_radius: 5,
        color: "#ff6347",
      },
    }

    // Poly konfig einspielen
    Object.assign(this.poly_config, default_config.poly, config.poly || {});

    // Configs zusammenfassen
    Object.assign(this.config, default_config, config);
  }

  loadConnectionFunctions() {

    switch (this.config.connection_mode) {
      case "custom":
        return; // bei eigenem connectionMode Nichts machen
      case "connect_them_all":
        this.addConnectionFunction("connect_all_polys", this.connectThemPolys);
        break;
    
      case "connect_them_all_and_mouse":
        this.addConnectionFunction("connect_all_polys", this.connectThemPolys);          
        this.addConnectionFunction("connect_to_mouse", this.connectToMouse);
        break;
    
      case "connect_only_mouse":
        this.addConnectionFunction("connect_to_mouse", this.connectToMouse);
        break;

      case "push_from_mouse":
        this.addConnectionFunction("connect_all_polys", this.connectThemPolys);
        this.addConnectionFunction("push_from_mouse", this.pushFromMouse);          
        break;        

      case "freeze_under_mouse":
        this.addConnectionFunction("connect_all_polys", this.connectThemPolys);
        this.addConnectionFunction("freeze_under_mouse", this.freezeUnderMouse); 
        break;

      default:
        console.error("Connectionmode undefined");
        return;
    }

    // braucht man immer
    this.addConnectionFunction("update_all_polys", this.updateAllPolys);
    this.addConnectionFunction("render_all_polys", this.drawPolyBalls);    
  }

  calcBlockSize() {
    this.blocksize_width = Math.round(this.width / this.config.slices);
    this.blocksize_height = Math.round(this.height / this.config.slices);
    if (this.blocksize_width <= 0) this.blocksize_width = 1;
    if (this.blocksize_height <= 0) this.blocksize_height = 1;
  }

  init(element) {
    if (!this.findElementToAttachTo(element)) return;
    this.loadConnectionFunctions();
    this.createCanvas();
    this.calcBlockSize();
    this.styleParentObject();
    this.initPolyNetz();
    console.log("Created Polynetz");
    console.log(this);
  }

  initPolyNetz() {
    this.poly_netz = Array(this.blocksize_width);
    for(let i = 0; i < this.poly_netz.length; i++) {
      this.poly_netz[i] = Array(this.blocksize_height);
      for (let j = 0; j < this.poly_netz[0].length; j++) {
        this.poly_netz[i][j] = [];
      }
    }
    this.grid_size = {width: this.poly_netz.length, height: this.poly_netz[0].length };
  }

  start(fps) {
    this.loop = setInterval(() => {
      this.update();
    }, 1000 / fps || 30);
  }

  stop() {
    clearInterval(this.loop);
  }

  reset() {
    let evt = {amount: this.all_polys.length};

    this.all_polys = [];
    this.all_polys_by_color = {};
    this.initPolyNetz();

    this.reset_event_callback(evt);
  }

  addEventlistener(event_name, callback) {

    if (event_name === "reset") {
      this.reset_event_callback = callback;
      return;
    }

    // einfach weiter geben
    this.canvas.addEventListener(event_name, callback);
  }

  addConnectionFunction(name, function_callback) {
    this.connection_functions[name] = function_callback;
  }

  removeConnectionFunction(name) {
    let temp_function = this.connection_functions[name];
    this.connection_functions[name] = null;
    return temp_function;
  }

  getLoadedConnectionFunctions() {
    return this.connection_functions;
  }

  getAvailableConnectionFunctions() {
    return ["connect_to_mouse", "polys_same_cell", "update_all_polys"];
  }

  findElementToAttachTo(parent_object) {
    parent_object = parent_object || "polynetz";
    // Überprüfen ob parent_object ein String also die ID oder ein Object also direkt die Node ist
    if (typeof parent_object == "string") {
      this.parent_object = document.getElementById(parent_object);
      // Überprüfen ob überhaupt ein Element gefunden wurde
      if (!this.parent_object) { 
        console.error(`Element with ID: ${parent_object} not found!`);
        return false;
      }    
    } else {
      this.parent_object = parent_object;
    }
    return true;
  }

  createCanvas() {
    this.width = this.parent_object.scrollWidth;
    this.height = this.parent_object.scrollHeight;

    // Canvas erstellen Attribute setzen und Context abrufen
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("style", "width: 100%; height: 100%");
    this.canvas.setAttribute("width", String(this.width));    
    this.canvas.setAttribute("height", String(this.height));    
    this.canvas.setAttribute("id", "polynetz_canvas");
    this.ctx = this.canvas.getContext("2d");
    // Canvas platzieren
    this.parent_object.appendChild(this.canvas);

    // fürs mausposition errechnen
    this.canvas_bounding_rect = this.canvas.getBoundingClientRect();    

    // Mousehandler hinzufügen
    this.canvas.addEventListener("mousemove", evt => {
      this.mouse_location.x = evt.clientX - this.canvas_bounding_rect.left;
      this.mouse_location.y = evt.clientY - this.canvas_bounding_rect.top;
    });

    // Canvas Bounding Rechteck neu berechnen und gleichzeitig auch die Mausposition anpassen
    document.addEventListener("scroll", evt => {
      let temp_rec = this.canvas.getBoundingClientRect();

      this.mouse_location.x += this.canvas_bounding_rect.left - temp_rec.left;
      this.mouse_location.y += this.canvas_bounding_rect.top - temp_rec.top;

      this.canvas_bounding_rect = temp_rec;
    });
  }

  styleParentObject() {
    if (this.config.background_color) this.parent_object.style.backgroundColor = this.config.background_color;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Polynetz;




    /*
    for (let spalte = 0; spalte < this.poly_netz.length; spalte++) {
      for (let zeile = 0; zeile < this.poly_netz[spalte].length; zeile++) {
        for (let poly of this.poly_netz[spalte][zeile]) {
          
        }
      }
    }

    /*
    this.poly_netz.forEach(spalte => {
      spalte.forEach(zeile => {
        zeile.forEach(poly => {
        });
      });
    });
    */


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export polysConnectInSameCell */
/* unused harmony export drawPolyBalls */
/* unused harmony export connectThemPolys */
/* unused harmony export freezeUnderMouse */
/* unused harmony export pushFromMouse */
/* unused harmony export connectToMouse */
function polysConnectInSameCell() {
  // Verbinder zeichnen
  // Style setzen für die Linien
  this.ctx.strokeStyle = this.config.line_color;
  this.ctx.beginPath();
  for (let spalte = 0; spalte < this.poly_netz.length; spalte++) {
    for (let zeile = 0; zeile < this.poly_netz[spalte].length; zeile++) {
      for (let poly of this.poly_netz[spalte][zeile]) {
        for (let target_poly of this.poly_netz[spalte][zeile]) {
          this.ctx.moveTo(poly.location.x, poly.location.y);
          this.ctx.lineTo(target_poly.location.x, target_poly.location.y);
        }
      }
    }
  }
  this.ctx.stroke()
}

function drawPolyBalls() {
  // Poly zeichnen
  // Polys werden beim zeichnen nach Farbe gruppiert, das ermöglicht es die Drawcalls zu minimieren, da nicht jeder Poly einzeln gezeichnet werden muss.
  if (this.config.render_poly) {
    for (let color of Object.keys(this.all_polys_by_color)) {
      this.ctx.beginPath()
      // Pfad mit jedem Poly in dieser Farbe erstellen
      for (let poly of this.all_polys_by_color[color]) {
        this.ctx.moveTo(poly.location.x, poly.location.y);
        this.ctx.arc(poly.location.x, poly.location.y, poly.config.size_radius, 0, Math.PI * 2);
      }

      // Farbe zeichnen
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }
  }
}

function connectThemPolys() {
  let block_range_width = Math.floor(this.config.max_connection_radius / this.blocksize_width);
  let block_range_height = Math.floor(this.config.max_connection_radius / this.blocksize_height);


  for (let all_polys_poly of this.all_polys) {

    let poly_netz_x = all_polys_poly.grid_location.gx;
    let poly_netz_y = all_polys_poly.grid_location.gy;

    let left = poly_netz_x - block_range_width - 1;
    let right = poly_netz_x + block_range_width + 2; // +1 wegen der sonst ungerade anzahl
    let top = poly_netz_y - block_range_height - 1;
    let bottom = poly_netz_y + block_range_height + 2; // +1 wegen der sonst ungeraden anzahl

    if (top < 0) top = 0;
    if (left < 0) left = 0;
    if (bottom >= this.grid_size.height) bottom = this.grid_size.height - 1;
    if (right >= this.grid_size.width) right = this.grid_size.width - 1;


    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        for (let poly of this.poly_netz[x][y]) {
          let range = Math.sqrt(Math.pow((poly.location.x - all_polys_poly.location.x), 2) + Math.pow((poly.location.y - all_polys_poly.location.y), 2));
          if (this.config.max_connection_radius > range) {
            this.ctx.beginPath();

            this.ctx.moveTo(all_polys_poly.location.x, all_polys_poly.location.y);
            this.ctx.lineTo(poly.location.x, poly.location.y);

            // Transparenz kalkulieren
            this.ctx.strokeStyle = "rgba(255,255,255," + (0.65 - range / this.config.max_connection_radius) + ")";

            this.ctx.stroke();
          }
        }
      }
    }
  }
}

function freezeUnderMouse() {
  let poly_netz_x = Math.floor(this.mouse_location.x / this.blocksize_width);
  let poly_netz_y = Math.floor(this.mouse_location.y / this.blocksize_height);

  let block_range_width = Math.floor(this.config.mouse.freeze_radius / this.blocksize_width);
  let block_range_height = Math.floor(this.config.mouse.freeze_radius / this.blocksize_height);

  let left = poly_netz_x - block_range_width - 1;
  let right = poly_netz_x + block_range_width + 2; // +1 wegen der sonst ungerade anzahl
  let top = poly_netz_y - block_range_height - 1;
  let bottom = poly_netz_y + block_range_height + 2; // +1 wegen der sonst ungeraden anzahl

  if (top < 0) top = 0;
  if (left < 0) left = 0;
  if (bottom >= this.grid_size.height) bottom = this.grid_size.height - 1;
  if (right >= this.grid_size.width) right = this.grid_size.width - 1;

  if (this.config.debug.render_freeze_radius) {
    this.ctx.beginPath();
    this.ctx.arc(this.mouse_location.x, this.mouse_location.y, this.config.mouse.freeze_radius, 0, 2 * Math.PI);
    //this.ctx.rect(left * this.blocksize_width, top * this.blocksize_height, (right - left) * this.blocksize_width, (bottom - top) * this.blocksize_height);
    this.ctx.fillStyle = "rgba(155,155,0,0.25)";
    this.ctx.fill();
  }

  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      for (let poly of this.poly_netz[x][y]) {
        let range = Math.sqrt(Math.pow((poly.location.x - this.mouse_location.x), 2) + Math.pow((poly.location.y - this.mouse_location.y), 2));
        if (range <= this.config.mouse.freeze_radius) {

          poly.location.x -= (poly.velocity.vx * poly.config.speed_multiplikator) * this.config.freeze_multiplier;
          poly.location.y -= (poly.velocity.vy * poly.config.speed_multiplikator) * this.config.freeze_multiplier;

        }
      }
    }
  }
}

function pushFromMouse() {
  let poly_netz_x = Math.floor(this.mouse_location.x / this.blocksize_width);
  let poly_netz_y = Math.floor(this.mouse_location.y / this.blocksize_height);

  let block_range_width = Math.floor(this.config.mouse.push_radius / this.blocksize_width);
  let block_range_height = Math.floor(this.config.mouse.push_radius / this.blocksize_height);

  let left = poly_netz_x - block_range_width - 1;
  let right = poly_netz_x + block_range_width + 2; // +1 wegen der sonst ungerade anzahl
  let top = poly_netz_y - block_range_height - 1;
  let bottom = poly_netz_y + block_range_height + 2; // +1 wegen der sonst ungeraden anzahl

  if (top < 0) top = 0;
  if (left < 0) left = 0;
  if (bottom >= this.grid_size.height) bottom = this.grid_size.height - 1;
  if (right >= this.grid_size.width) right = this.grid_size.width - 1;

  if (this.config.debug.render_push_radius) {
    this.ctx.beginPath();
    this.ctx.arc(this.mouse_location.x, this.mouse_location.y, this.config.mouse.push_radius, 0, 2 * Math.PI);
    //this.ctx.rect(left * this.blocksize_width, top * this.blocksize_height, (right - left) * this.blocksize_width, (bottom - top) * this.blocksize_height);
    this.ctx.fillStyle = "rgba(155,155,0,0.25)";
    this.ctx.fill();
  }

  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      for (let poly of this.poly_netz[x][y]) {
        let range = Math.sqrt(Math.pow((poly.location.x - this.mouse_location.x), 2) + Math.pow((poly.location.y - this.mouse_location.y), 2));
        if (range <= this.config.mouse.push_radius) {

          poly.location.x -= (poly.velocity.vx * poly.config.speed_multiplikator) * this.config.freeze_multiplier;
          console.log(this.config.freeze_multiplier);
          console.log((poly.velocity.vx * poly.config.speed_multiplikator) * this.config.freeze_multiplier)
          poly.location.y -= (poly.velocity.vy * poly.config.speed_multiplikator) * this.config.freeze_multiplier;


        }
      }
    }
  }
}

function  connectToMouse() {
  if (this.config.render_poly) {
    this.ctx.beginPath();
    this.ctx.arc(this.mouse_location.x, this.mouse_location.y, this.config.mouse.size_radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.config.mouse.color;
    this.ctx.fill();
  }

  let poly_netz_x = Math.floor(this.mouse_location.x / this.blocksize_width);
  let poly_netz_y = Math.floor(this.mouse_location.y / this.blocksize_height);

  let block_range_width = Math.floor(this.config.max_connection_radius / this.blocksize_width);
  let block_range_height = Math.floor(this.config.max_connection_radius / this.blocksize_height);

  let left = poly_netz_x - block_range_width - 1;
  let right = poly_netz_x + block_range_width + 2; // +1 wegen der sonst ungerade anzahl
  let top = poly_netz_y - block_range_height - 1;
  let bottom = poly_netz_y + block_range_height + 2; // +1 wegen der sonst ungeraden anzahl

  if (top < 0) top = 0;
  if (left < 0) left = 0;
  if (bottom >= this.grid_size.height) bottom = this.grid_size.height - 1;
  if (right >= this.grid_size.width) right = this.grid_size.width - 1;

  if (this.config.debug.render_connection_grid) {
    this.ctx.beginPath();
    this.ctx.arc(this.mouse_location.x, this.mouse_location.y, this.config.max_connection_radius, 0, 2 * Math.PI);
    //this.ctx.rect(left * this.blocksize_width, top * this.blocksize_height, (right - left) * this.blocksize_width, (bottom - top) * this.blocksize_height);
    this.ctx.fillStyle = "rgba(0,255,0,0.25)";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.rect(poly_netz_x * this.blocksize_width, poly_netz_y * this.blocksize_height, this.blocksize_width, this.blocksize_height);
    this.ctx.fillStyle = "rgba(255,0,0,0.25)";
    this.ctx.fill();

  }

  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      for (let poly of this.poly_netz[x][y]) {
        let range = Math.sqrt(Math.pow((poly.location.x - this.mouse_location.x), 2) + Math.pow((poly.location.y - this.mouse_location.y), 2));
        if (this.config.max_connection_radius > range) {
          this.ctx.beginPath();

          this.ctx.moveTo(this.mouse_location.x, this.mouse_location.y);
          this.ctx.lineTo(poly.location.x, poly.location.y);

          // Transparenz kalkulieren
          this.ctx.strokeStyle = "rgba(255,255,255," + (0.65 - range / this.config.max_connection_radius) + ")";

          this.ctx.stroke();
        }
      }
    }
  }
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Poly {
  constructor(location, grid_location, config, polynetz_reverence) {
    // Variablen erstellen
    this.config = config;
    this.location = location;
    this.grid_location = grid_location;
    this.polynetz = polynetz_reverence;
    this.grid_size = {width: this.polynetz.poly_netz.length, height: this.polynetz.poly_netz[0].length };
    this.velocity = {vx: Math.random() * 2 - 1,vy: Math.random() * 2 - 1};
  }

  updateGridLocation() {
    let poly_netz_x = Math.floor(this.location.x / this.polynetz.blocksize_width);
    let poly_netz_y = Math.floor(this.location.y / this.polynetz.blocksize_height);
    
    // Kleine Anpassung wegen des Überlaufs
    if (poly_netz_x < 0) poly_netz_x = 0;
    if (poly_netz_x > this.grid_size.width - 1) poly_netz_x = this.grid_size.width - 1;    
    if (poly_netz_y < 0) poly_netz_y = 0;
    if (poly_netz_y > this.grid_size.height - 1) poly_netz_x = this.grid_size.height - 1;

    if (this.grid_location.gx != poly_netz_x || this.grid_location.gy != poly_netz_y) {
      // Item aus altem Grid Abschnitt entfernen
      for (let i = 0; i < this.polynetz.poly_netz[this.grid_location.gx][this.grid_location.gy].length; i++) {
        if (this.polynetz.poly_netz[this.grid_location.gx][this.grid_location.gy][i] === this) {
          this.polynetz.poly_netz[this.grid_location.gx][this.grid_location.gy].splice(i,1);
        }
      }

      if (this.polynetz.poly_netz[poly_netz_x][poly_netz_y]) {
        this.polynetz.poly_netz[poly_netz_x][poly_netz_y].push(this);
      } else {
        this.polynetz.poly_netz[poly_netz_x][poly_netz_y] = [this];
      }

      // Location anpassen
      this.grid_location.gy = poly_netz_y;
      this.grid_location.gx = poly_netz_x;
    }
  }

  updateLocation(newLocation) {
    if (newLocation) {
      this.location = newLocation;
    } else {
      this.location.x += this.velocity.vx * this.config.speed_multiplikator;
      this.location.y += this.velocity.vy * this.config.speed_multiplikator;    
    
      // Überlauf (Elemente werden nicht Teleportiert wenn sie erst zur hälfte nicht mehr sichtbar sind)
      if (this.location.x > this.polynetz.width + this.config.size_radius  ) { this.updateLocation({y: this.location.y, x: 0 - this.config.size_radius           }) } else
      if (this.location.x < 0 - this.config.size_radius           ) { this.updateLocation({y: this.location.y, x: this.polynetz.width + this.config.size_radius  }) } else
      if (this.location.y > this.polynetz.height + this.config.size_radius ) { this.updateLocation({x: this.location.x, y: 0 - this.config.size_radius           }) } else
      if (this.location.y < 0 - this.config.size_radius           ) { this.updateLocation({x: this.location.x, y: this.polynetz.height + this.config.size_radius }) }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Poly;


/***/ })
/******/ ]);