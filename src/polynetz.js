import { polysConnectInSameCell, updateAllPolys, drawPolyBalls, connectThemPolys, freezeUnderMouse, pushFromMouse, connectToMouse } from "./default-functions.js";
import Poly from "./poly.js";

export default class Polynetz {
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
    let poly = new Poly(location, {gx: poly_netz_x, gy: poly_netz_y}, Object.assign({}, this.poly_config, custom_config || {}), this);

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
        this.addConnectionFunction("connect_all_polys", connectThemPolys);
        break;
    
      case "connect_them_all_and_mouse":
        this.addConnectionFunction("connect_all_polys", connectThemPolys);          
        this.addConnectionFunction("connect_to_mouse", connectToMouse);
        break;
    
      case "connect_only_mouse":
        this.addConnectionFunction("connect_to_mouse", connectToMouse);
        break;

      case "push_from_mouse":
        this.addConnectionFunction("connect_all_polys", connectThemPolys);
        this.addConnectionFunction("push_from_mouse", pushFromMouse);          
        break;        

      case "freeze_under_mouse":
        this.addConnectionFunction("connect_all_polys", connectThemPolys);
        this.addConnectionFunction("freeze_under_mouse", freezeUnderMouse); 
        break;

      default:
        console.error("Connectionmode undefined");
        return;
    }

    // braucht man immer
    this.addConnectionFunction("update_all_polys", updateAllPolys);
    this.addConnectionFunction("render_all_polys", drawPolyBalls);    
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
