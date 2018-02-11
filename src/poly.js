export default class Poly {
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

    if (this.grid_location.gx !== poly_netz_x || this.grid_location.gy !== poly_netz_y) {
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