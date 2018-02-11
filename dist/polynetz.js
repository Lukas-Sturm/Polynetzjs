var Polynetz =
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
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(1).default;
// keine Ahnung warum man das braucht
// Wahrscheinlich weil Webpack richtig schön kompliziert sein muss DANKE DAFÜR

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _defaultFunctions = __webpack_require__(2);

var _poly = __webpack_require__(3);

var _poly2 = _interopRequireDefault(_poly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polynetz = function () {
  function Polynetz(config) {
    _classCallCheck(this, Polynetz);

    // Variablen erstellen 
    this.poly_config = {};this.config = {};this.canvas = null;this.parent_object = null;
    this.poly_netz = null;this.width = 0;this.height = 0;this.all_polys = [];this.loop = null;
    this.all_polys_by_color = {};this.reset_event_callback = function () {};this.grid_size = {};
    this.mouse_location = { x: 0, y: 0 };this.canvas_bounding_rect = {};

    this.connection_functions = [];

    // Konfiguartion laden
    this.loadConfig(config || {});
  }

  _createClass(Polynetz, [{
    key: "addPoly",
    value: function addPoly(location, custom_config) {
      var poly_netz_x = Math.floor(location.x / this.blocksize_width);
      var poly_netz_y = Math.floor(location.y / this.blocksize_height);
      // Neuen Poly erstellen mit allen relevanten optionen
      var poly = new _poly2.default(location, { gx: poly_netz_x, gy: poly_netz_y }, Object.assign({}, this.poly_config, custom_config || {}), this);

      // Poly zum Array mit allen Polys hinzufügen
      this.all_polys.push(poly);

      // Poly zu seiner Farbe hinzufügen
      if (this.all_polys_by_color[poly.config.color]) {
        this.all_polys_by_color[poly.config.color].push(poly);
      } else {
        this.all_polys_by_color[poly.config.color] = [poly];
      }

      // Poly zum Grid hinzufügen
      if (this.poly_netz[poly_netz_x][poly_netz_y]) {
        this.poly_netz[poly_netz_x][poly_netz_y].push(poly);
      } else {
        this.poly_netz[poly_netz_x][poly_netz_y] = [poly];
      }
    }
  }, {
    key: "update",
    value: function update() {
      // alles clearen
      this.ctx.clearRect(0, 0, this.width, this.height);

      // debuging
      if (this.config.debug) {
        if (this.config.debug.grid) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = "white";
          // Horizontalen Linien
          for (var grid_y = 0; grid_y < this.height; grid_y += this.blocksize_height) {
            // zwei breiten Strich zeichnen
            this.ctx.moveTo(0, grid_y);
            this.ctx.lineTo(this.width, grid_y);
          }
          // Vertikalen Linien
          for (var grid_x = 0; grid_x < this.width; grid_x += this.blocksize_width) {
            this.ctx.moveTo(grid_x, 0);
            this.ctx.lineTo(grid_x, this.height);
          }
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
        if (this.config.debug.connection_radius) {
          this.ctx.beginPath();
          for (var poly_index = 0; poly_index < this.all_polys.length; poly_index++) {
            this.ctx.moveTo(this.all_polys[poly_index].location.x, this.all_polys[poly_index].location.y);
            this.ctx.arc(this.all_polys[poly_index].location.x, this.all_polys[poly_index].location.y, this.config.connection_radius, 0, Math.PI * 2);
            this.ctx.arc(this.all_polys[poly_index].location.x, this.all_polys[poly_index].location.y, this.config.max_connection_radius, 0, Math.PI * 2);
          }
          this.ctx.strokeStyle = "white";
          this.ctx.stroke();
        }
      }

      // führt alle aktivierten connection funktionen aus
      for (var i = 0; i < this.connection_functions.length; i++) {
        this.connection_functions[i].c.bind(this)();
      }
    }
  }, {
    key: "updateConfig",
    value: function updateConfig(config) {
      if (config.poly) Object.assign(this.poly_config, config.poly);
      Object.assign(this.config, config);
      this.styleParentObject();
    }
  }, {
    key: "loadConfig",
    value: function loadConfig(config) {
      var default_config = {
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
          render_freeze_radius: false
        },
        mouse: {
          freeze_radius: 100,
          push_radius: 100,
          size_radius: 5,
          color: "white"
        },
        poly: {
          speed_multiplikator: 1,
          size_radius: 5,
          color: "#ff6347"
        }
      };

      // Poly konfig einspielen
      Object.assign(this.poly_config, default_config.poly, config.poly || {});

      // Configs zusammenfassen
      Object.assign(this.config, default_config, config);
    }
  }, {
    key: "loadConnectionFunctions",
    value: function loadConnectionFunctions() {
      switch (this.config.connection_mode) {
        case "custom":
          return; // bei eigenem connectionMode Nichts machen
        case "connect_them_all":
          this.addConnectionFunction("connect_all_polys", _defaultFunctions.connectThemPolys, 500);
          break;

        case "connect_them_all_and_mouse":
          this.addConnectionFunction("connect_all_polys", _defaultFunctions.connectThemPolys, 500);
          this.addConnectionFunction("connect_to_mouse", _defaultFunctions.connectToMouse, 510);
          break;

        case "connect_only_mouse":
          this.addConnectionFunction("connect_to_mouse", _defaultFunctions.connectToMouse, 500);
          break;

        case "push_from_mouse":
          this.addConnectionFunction("connect_all_polys", _defaultFunctions.connectThemPolys, 500);
          this.addConnectionFunction("push_from_mouse", _defaultFunctions.pushFromMouse, 510);
          break;

        case "freeze_under_mouse":
          this.addConnectionFunction("connect_all_polys", _defaultFunctions.connectThemPolys, 500);
          this.addConnectionFunction("freeze_under_mouse", _defaultFunctions.freezeUnderMouse, 510);
          break;

        default:
          console.error("Connectionmode undefined");
          return;
      }

      // braucht man immer
      this.addConnectionFunction("update_all_polys", _defaultFunctions.updateAllPolys, 1000);
      this.addConnectionFunction("render_all_polys", _defaultFunctions.drawPolyBalls, 1);
    }
  }, {
    key: "calcBlockSize",
    value: function calcBlockSize() {
      this.blocksize_width = Math.round(this.width / this.config.slices);
      this.blocksize_height = Math.round(this.height / this.config.slices);
      if (this.blocksize_width <= 0) this.blocksize_width = 1;
      if (this.blocksize_height <= 0) this.blocksize_height = 1;
    }
  }, {
    key: "init",
    value: function init(element) {
      if (!this.findElementToAttachTo(element)) return;
      this.loadConnectionFunctions();
      this.createCanvas();
      this.calcBlockSize();
      this.styleParentObject();
      this.initPolyNetz();
      console.log("Created Polynetz");
      console.log(this);
    }
  }, {
    key: "initPolyNetz",
    value: function initPolyNetz() {
      this.poly_netz = new Array(this.blocksize_width);
      for (var i = 0; i < this.poly_netz.length; i++) {
        this.poly_netz[i] = new Array(this.blocksize_height);
        for (var j = 0; j < this.poly_netz[0].length; j++) {
          this.poly_netz[i][j] = [];
        }
      }
      this.grid_size = { width: this.poly_netz.length, height: this.poly_netz[0].length };
    }
  }, {
    key: "start",
    value: function start(fps) {
      var _this = this;

      if (this.loop !== null) return;
      this.loop = setInterval(function () {
        _this.update();
      }, 1000 / fps || 30);
    }
  }, {
    key: "stop",
    value: function stop() {
      clearInterval(this.loop);
    }
  }, {
    key: "reset",
    value: function reset() {
      var evt = { amount: this.all_polys.length };

      this.all_polys = [];
      this.all_polys_by_color = {};
      this.initPolyNetz();

      this.reset_event_callback(evt);
    }
  }, {
    key: "addEventlistener",
    value: function addEventlistener(event_name, callback) {

      if (event_name === "reset") {
        this.reset_event_callback = callback;
        return;
      }

      // einfach weiter geben
      this.canvas.addEventListener(event_name, callback);
    }
  }, {
    key: "addConnectionFunction",
    value: function addConnectionFunction(name, function_callback, prio) {
      prio = prio || 500;

      for (var i = 0; i < this.connection_functions.length; i++) {
        if (this.connection_functions[i].p < prio) {
          // Platz gefunden, einfügen
          this.connection_functions.splice(i, 0, {
            n: name,
            c: function_callback,
            p: prio
          });
          // AUS DER FUNKTION SPRINGEN
          return;
        }
      }

      // Kein insertpunkt gefunden
      this.connection_functions.push({
        n: name,
        c: function_callback,
        p: prio
      });
    }
  }, {
    key: "removeConnectionFunction",
    value: function removeConnectionFunction(name) {
      for (var i = 0; i < this.connection_functions.length; i++) {
        if (this.connection_functions[i].n === name) {
          this.connection_functions.splice(i, 1);
          return;
        }
      }
    }
  }, {
    key: "getLoadedConnectionFunctions",
    value: function getLoadedConnectionFunctions() {
      return this.connection_functions;
    }
  }, {
    key: "findElementToAttachTo",
    value: function findElementToAttachTo(parent_object) {
      parent_object = parent_object || "polynetz";
      // Überprüfen ob parent_object ein String also die ID oder ein Object also direkt die Node ist
      if (typeof parent_object === "string") {
        this.parent_object = document.getElementById(parent_object);
        // Überprüfen ob überhaupt ein Element gefunden wurde
        if (!this.parent_object) {
          console.error("Element with ID: " + parent_object + " not found!");
          return false;
        }
      } else {
        this.parent_object = parent_object;
      }
      return true;
    }
  }, {
    key: "createCanvas",
    value: function createCanvas() {
      var _this2 = this;

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
      this.canvas.addEventListener("mousemove", function (evt) {
        _this2.mouse_location.x = evt.clientX - _this2.canvas_bounding_rect.left;
        _this2.mouse_location.y = evt.clientY - _this2.canvas_bounding_rect.top;
      });

      // Canvas Bounding Rechteck neu berechnen und gleichzeitig auch die Mausposition anpassen
      document.addEventListener("scroll", function (evt) {
        var temp_rec = _this2.canvas.getBoundingClientRect();

        _this2.mouse_location.x += _this2.canvas_bounding_rect.left - temp_rec.left;
        _this2.mouse_location.y += _this2.canvas_bounding_rect.top - temp_rec.top;

        _this2.canvas_bounding_rect = temp_rec;
      });
    }
  }, {
    key: "styleParentObject",
    value: function styleParentObject() {
      if (this.config.background_color) this.parent_object.style.backgroundColor = this.config.background_color;
    }
  }]);

  return Polynetz;
}();

exports.default = Polynetz;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polysConnectInSameCell = polysConnectInSameCell;
exports.updateAllPolys = updateAllPolys;
exports.drawPolyBalls = drawPolyBalls;
exports.connectThemPolys = connectThemPolys;
exports.freezeUnderMouse = freezeUnderMouse;
exports.pushFromMouse = pushFromMouse;
exports.connectToMouse = connectToMouse;
function polysConnectInSameCell() {
  // Verbinder zeichnen
  // Style setzen für die Linien
  this.ctx.strokeStyle = this.config.line_color;
  this.ctx.beginPath();
  for (var spalte = 0; spalte < this.poly_netz.length; spalte++) {
    for (var zeile = 0; zeile < this.poly_netz[spalte].length; zeile++) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.poly_netz[spalte][zeile][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var poly = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.poly_netz[spalte][zeile][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var target_poly = _step2.value;

              this.ctx.moveTo(poly.location.x, poly.location.y);
              this.ctx.lineTo(target_poly.location.x, target_poly.location.y);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }
  this.ctx.stroke();
}

function updateAllPolys() {
  // Lokation und Grid aktualisieren
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = this.all_polys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var poly = _step3.value;

      poly.updateLocation();
      poly.updateGridLocation();
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

function drawPolyBalls() {
  // Poly zeichnen
  // Polys werden beim zeichnen nach Farbe gruppiert, das ermöglicht es die Drawcalls zu minimieren, da nicht jeder Poly einzeln gezeichnet werden muss.
  if (this.config.render_poly) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = Object.keys(this.all_polys_by_color)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var color = _step4.value;

        this.ctx.beginPath();
        // Pfad mit jedem Poly in dieser Farbe erstellen
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.all_polys_by_color[color][Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var poly = _step5.value;

            this.ctx.moveTo(poly.location.x, poly.location.y);
            this.ctx.arc(poly.location.x, poly.location.y, poly.config.size_radius, 0, Math.PI * 2);
          }

          // Farbe zeichnen
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        this.ctx.fillStyle = color;
        this.ctx.fill();
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  }
}

function connectThemPolys() {
  var block_range_width = Math.floor(this.config.max_connection_radius / this.blocksize_width);
  var block_range_height = Math.floor(this.config.max_connection_radius / this.blocksize_height);

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = this.all_polys[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var all_polys_poly = _step6.value;


      var poly_netz_x = all_polys_poly.grid_location.gx;
      var poly_netz_y = all_polys_poly.grid_location.gy;

      var left = poly_netz_x - block_range_width - 1;
      var right = poly_netz_x + block_range_width + 2; // +1 wegen der sonst ungerade anzahl
      var top = poly_netz_y - block_range_height - 1;
      var bottom = poly_netz_y + block_range_height + 2; // +1 wegen der sonst ungeraden anzahl

      if (top < 0) top = 0;
      if (left < 0) left = 0;
      if (bottom >= this.grid_size.height) bottom = this.grid_size.height - 1;
      if (right >= this.grid_size.width) right = this.grid_size.width - 1;

      for (var y = top; y < bottom; y++) {
        for (var x = left; x < right; x++) {
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = this.poly_netz[x][y][Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var poly = _step7.value;

              var range = Math.sqrt(Math.pow(poly.location.x - all_polys_poly.location.x, 2) + Math.pow(poly.location.y - all_polys_poly.location.y, 2));
              if (this.config.max_connection_radius > range) {
                this.ctx.beginPath();

                this.ctx.moveTo(all_polys_poly.location.x, all_polys_poly.location.y);
                this.ctx.lineTo(poly.location.x, poly.location.y);

                // Transparenz kalkulieren
                this.ctx.strokeStyle = "rgba(255,255,255," + (0.65 - range / this.config.max_connection_radius) + ")";

                this.ctx.stroke();
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }
}

function freezeUnderMouse() {
  var poly_netz_x = Math.floor(this.mouse_location.x / this.blocksize_width);
  var poly_netz_y = Math.floor(this.mouse_location.y / this.blocksize_height);

  var block_range_width = Math.floor(this.config.mouse.freeze_radius / this.blocksize_width);
  var block_range_height = Math.floor(this.config.mouse.freeze_radius / this.blocksize_height);

  var left = poly_netz_x - block_range_width - 1;
  var right = poly_netz_x + block_range_width + 2; // +1 wegen der sonst ungerade anzahl
  var top = poly_netz_y - block_range_height - 1;
  var bottom = poly_netz_y + block_range_height + 2; // +1 wegen der sonst ungeraden anzahl

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

  for (var y = top; y < bottom; y++) {
    for (var x = left; x < right; x++) {
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.poly_netz[x][y][Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var poly = _step8.value;

          var range = Math.sqrt(Math.pow(poly.location.x - this.mouse_location.x, 2) + Math.pow(poly.location.y - this.mouse_location.y, 2));
          if (range <= this.config.mouse.freeze_radius) {

            poly.location.x -= poly.velocity.vx * poly.config.speed_multiplikator * this.config.freeze_multiplier;
            poly.location.y -= poly.velocity.vy * poly.config.speed_multiplikator * this.config.freeze_multiplier;
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }
  }
}

function pushFromMouse() {
  var poly_netz_x = Math.floor(this.mouse_location.x / this.blocksize_width);
  var poly_netz_y = Math.floor(this.mouse_location.y / this.blocksize_height);

  var block_range_width = Math.floor(this.config.mouse.push_radius / this.blocksize_width);
  var block_range_height = Math.floor(this.config.mouse.push_radius / this.blocksize_height);

  var left = poly_netz_x - block_range_width - 1;
  var right = poly_netz_x + block_range_width + 2; // +1 wegen der sonst ungerade anzahl
  var top = poly_netz_y - block_range_height - 1;
  var bottom = poly_netz_y + block_range_height + 2; // +1 wegen der sonst ungeraden anzahl

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

  for (var y = top; y < bottom; y++) {
    for (var x = left; x < right; x++) {
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = this.poly_netz[x][y][Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var poly = _step9.value;

          var range = Math.sqrt(Math.pow(poly.location.x - this.mouse_location.x, 2) + Math.pow(poly.location.y - this.mouse_location.y, 2));
          if (range <= this.config.mouse.push_radius) {

            poly.location.x -= poly.velocity.vx * poly.config.speed_multiplikator * this.config.freeze_multiplier;
            console.log(this.config.freeze_multiplier);
            console.log(poly.velocity.vx * poly.config.speed_multiplikator * this.config.freeze_multiplier);
            poly.location.y -= poly.velocity.vy * poly.config.speed_multiplikator * this.config.freeze_multiplier;
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }
  }
}

function connectToMouse() {
  if (this.config.render_poly) {
    this.ctx.beginPath();
    this.ctx.arc(this.mouse_location.x, this.mouse_location.y, this.config.mouse.size_radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.config.mouse.color;
    this.ctx.fill();
  }

  var poly_netz_x = Math.floor(this.mouse_location.x / this.blocksize_width);
  var poly_netz_y = Math.floor(this.mouse_location.y / this.blocksize_height);

  var block_range_width = Math.floor(this.config.max_connection_radius / this.blocksize_width);
  var block_range_height = Math.floor(this.config.max_connection_radius / this.blocksize_height);

  var left = poly_netz_x - block_range_width - 1;
  var right = poly_netz_x + block_range_width + 2; // +1 wegen der sonst ungerade anzahl
  var top = poly_netz_y - block_range_height - 1;
  var bottom = poly_netz_y + block_range_height + 2; // +1 wegen der sonst ungeraden anzahl

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

  for (var y = top; y < bottom; y++) {
    for (var x = left; x < right; x++) {
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = this.poly_netz[x][y][Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var poly = _step10.value;

          var range = Math.sqrt(Math.pow(poly.location.x - this.mouse_location.x, 2) + Math.pow(poly.location.y - this.mouse_location.y, 2));
          if (this.config.max_connection_radius > range) {
            this.ctx.beginPath();

            this.ctx.moveTo(this.mouse_location.x, this.mouse_location.y);
            this.ctx.lineTo(poly.location.x, poly.location.y);

            // Transparenz kalkulieren
            this.ctx.strokeStyle = "rgba(255,255,255," + (0.65 - range / this.config.max_connection_radius) + ")";

            this.ctx.stroke();
          }
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }
    }
  }
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Poly = function () {
  function Poly(location, grid_location, config, polynetz_reverence) {
    _classCallCheck(this, Poly);

    // Variablen erstellen
    this.config = config;
    this.location = location;
    this.grid_location = grid_location;
    this.polynetz = polynetz_reverence;
    this.grid_size = { width: this.polynetz.poly_netz.length, height: this.polynetz.poly_netz[0].length };
    this.velocity = { vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1 };
  }

  _createClass(Poly, [{
    key: "updateGridLocation",
    value: function updateGridLocation() {
      var poly_netz_x = Math.floor(this.location.x / this.polynetz.blocksize_width);
      var poly_netz_y = Math.floor(this.location.y / this.polynetz.blocksize_height);

      // Kleine Anpassung wegen des Überlaufs
      if (poly_netz_x < 0) poly_netz_x = 0;
      if (poly_netz_x > this.grid_size.width - 1) poly_netz_x = this.grid_size.width - 1;
      if (poly_netz_y < 0) poly_netz_y = 0;
      if (poly_netz_y > this.grid_size.height - 1) poly_netz_x = this.grid_size.height - 1;

      if (this.grid_location.gx !== poly_netz_x || this.grid_location.gy !== poly_netz_y) {
        // Item aus altem Grid Abschnitt entfernen
        for (var i = 0; i < this.polynetz.poly_netz[this.grid_location.gx][this.grid_location.gy].length; i++) {
          if (this.polynetz.poly_netz[this.grid_location.gx][this.grid_location.gy][i] === this) {
            this.polynetz.poly_netz[this.grid_location.gx][this.grid_location.gy].splice(i, 1);
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
  }, {
    key: "updateLocation",
    value: function updateLocation(newLocation) {
      if (newLocation) {
        this.location = newLocation;
      } else {
        this.location.x += this.velocity.vx * this.config.speed_multiplikator;
        this.location.y += this.velocity.vy * this.config.speed_multiplikator;

        // Überlauf (Elemente werden nicht Teleportiert wenn sie erst zur hälfte nicht mehr sichtbar sind)
        if (this.location.x > this.polynetz.width + this.config.size_radius) {
          this.updateLocation({ y: this.location.y, x: 0 - this.config.size_radius });
        } else if (this.location.x < 0 - this.config.size_radius) {
          this.updateLocation({ y: this.location.y, x: this.polynetz.width + this.config.size_radius });
        } else if (this.location.y > this.polynetz.height + this.config.size_radius) {
          this.updateLocation({ x: this.location.x, y: 0 - this.config.size_radius });
        } else if (this.location.y < 0 - this.config.size_radius) {
          this.updateLocation({ x: this.location.x, y: this.polynetz.height + this.config.size_radius });
        }
      }
    }
  }]);

  return Poly;
}();

exports.default = Poly;

/***/ })
/******/ ]);