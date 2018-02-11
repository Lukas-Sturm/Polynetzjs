//import Polynetz from "./polynetz.js";

let colors = ["#3444FF", "#FF2B25", "#B616E8", "#E8964C", "#FFE46A"];

this.polynetz = new Polynetz({
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

window.onload = () => {
	init();
};

function init() {
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

	console.log(this.polynetz.getLoadedConnectionFunctions());
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