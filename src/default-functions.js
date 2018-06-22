export function polysConnectInSameCell() {
  // Verbinder zeichnen
  // Style setzen für die Linien
  this.ctx.strokeStyle = this.config.connection_color;
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

export function updateAllPolys() {
  // Lokation und Grid aktualisieren
  for (let poly of this.all_polys) {
    poly.updateLocation();
    poly.updateGridLocation();
  }
}

export function drawPolyBalls() {
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

export function connectThemPolys() {
  let block_range_width = Math.floor(this.config.connection_radius / this.blocksize_width);
  let block_range_height = Math.floor(this.config.connection_radius / this.blocksize_height);


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
          if (range < this.config.connection_radius) {
            this.ctx.beginPath();

            this.ctx.moveTo(all_polys_poly.location.x, all_polys_poly.location.y);
            this.ctx.lineTo(poly.location.x, poly.location.y);

            // Transparenz kalkulieren
            if (this.config.connection_is_transparent) {
              this.ctx.strokeStyle = "rgba("+ this.config.connection_color + "," + (1 - range / this.config.connection_radius) + ")";
            } else {
              this.ctx.strokeStyle = "rgba("+ this.config.connection_color + ")";
            }

            this.ctx.stroke();
          }
        }
      }
    }
  }
}

export function freezeUnderMouse() {
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

export function pushFromMouse() {
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

export function  connectToMouse() {
  if (this.config.render_poly) {
    this.ctx.beginPath();
    this.ctx.arc(this.mouse_location.x, this.mouse_location.y, this.config.mouse.size_radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.config.mouse.color;
    this.ctx.fill();
  }

  let poly_netz_x = Math.floor(this.mouse_location.x / this.blocksize_width);
  let poly_netz_y = Math.floor(this.mouse_location.y / this.blocksize_height);

  let block_range_width = Math.floor(this.config.connection_radius / this.blocksize_width);
  let block_range_height = Math.floor(this.config.connection_radius / this.blocksize_height);

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
    this.ctx.arc(this.mouse_location.x, this.mouse_location.y, this.config.connection_radius, 0, 2 * Math.PI);
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
        if (this.config.connection_radius > range) {
          this.ctx.beginPath();

          this.ctx.moveTo(this.mouse_location.x, this.mouse_location.y);
          this.ctx.lineTo(poly.location.x, poly.location.y);

          // Transparenz kalkulieren
          this.ctx.strokeStyle = "rgba(255,255,255," + (1 - range / this.config.connection_radius) + ")";

          this.ctx.stroke();
        }
      }
    }
  }
}