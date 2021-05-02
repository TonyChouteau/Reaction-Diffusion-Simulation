//====================================================
// Define
//====================================================

const canvasWidth = 500;
const canvasHeight = 500;

const Nx = 100;
const Ny = 100;

let simulation;

//====================================================
// Setup
//====================================================

function setup() {
	let canvas = createCanvas(canvasWidth, canvasHeight);
	canvas.parent('#canvas-container');

	simulation = new Simulation({
		width: Nx,
		height: Ny,
		canvasWidth: canvasWidth,
		canvasHeight: canvasHeight,
		fps: 10,
		diffusionA: 1,
		diffusionB: 0.5,
		feed: 0.045,
		kill: 0.065,
		speed: 1,
		laplacianMatrix: [
			[0.05, 0.2, 0.05],
			[ 0.2,  -1,  0.2],
			[0.05, 0.2, 0.05]
		],
	});

	simulation.seed("center", 0.2);
}

// function windowResized() {
// 	resizeCanvas(windowWidth, windowHeight);
// }

//====================================================
// Draw
//====================================================

function draw() {
	//simulation.print();
	simulation.update();
	simulation.draw();
}

//====================================================
// End
//====================================================
