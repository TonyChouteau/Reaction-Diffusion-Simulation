/**
 * @class Simulation
 * @param {SimulationOption} options
 */
function Simulation(options) {
	this.init(options);
}

Simulation.prototype = {
	/**
	 * @method init : Init the simulation
	 * @param {SimulationOption} options
	 */
	init: function (options) {
		this.sizeX = options.width;
		this.sizeY = options.height;

		this.options = options;

		this.state = [];
		for (let i = 0; i < this.sizeY; i++) {
			let line = [];
			for (let j = 0; j < this.sizeX; j++) {
				const position = {
					x: j,
					y: i,
				};
				line.push(new Cell(options, position));
			}
			this.state.push(line);
		}

		noStroke();
		frameRate(options.fps);
	},

	randomSeed: function (rate) {
		for (let i = 0; i < this.sizeY; i++) {
			for (let j = 0; j < this.sizeX; j++) {
				this.state[i][j].b = Math.random() < rate ? 1 : 0;
			}
		}
		//this.state[1][0].b = 1;
	},

	centerSeed: function () {
		for (let i = int(this.sizeY / 3); i < int((2 * this.sizeY) / 3); i++) {
			for (let j = int(this.sizeX / 3); j < int((2 * this.sizeY) / 3); j++) {
				this.state[i][j].b = 1;
			}
		}
	},

	seed: function (type, arg) {
		switch (type) {
			case 'random':
			default:
				this.randomSeed(arg);
				break;
			case 'center':
				this.centerSeed(arg);
				break;
		}
	},

	/**
	 * @method f2d: function used in the laplacian convolution
	 *
	 * @param {Object} delta
	 * @param {Cell} cell
	 * @param {number} matrixValue
	 *
	 * @returns {number} result for the specified cell of the convolution
	 */
	f2d: function (delta, cell, matrixValue) {
		if (cell) {
			return {
				a: delta.a + cell.lastA * matrixValue,
				b: delta.b + cell.lastB * matrixValue,
			};
		} else {
			return delta;
		}
	},

	/**
	 * @method laplacian : Compute the laplacian convolution
	 *
	 * @param {Array[Array[]]} matrix : Laplacian convolution matrix
	 */
	laplacian: function (matrix, i, j) {
		let delta = {
			a: 0,
			b: 0,
		};
		// Top
		delta = this.f2d(delta, i > 0 && j > 0 ? this.state[i - 1][j - 1] : null, matrix[0][0]);
		delta = this.f2d(delta, i > 0 ? this.state[i - 1][j] : null, matrix[0][1]);
		delta = this.f2d(delta, i > 0 && j < this.sizeX - 1 ? this.state[i - 1][j + 1] : null, matrix[0][2]);

		// Center
		delta = this.f2d(delta, j > 0 ? this.state[i][j - 1] : null, matrix[1][0]);
		delta = this.f2d(delta, this.state[i][j], matrix[1][1]);
		delta = this.f2d(delta, j < this.sizeX - 1 ? this.state[i][j + 1] : null, matrix[1][2]);

		// Bottom
		delta = this.f2d(delta, i < this.sizeY - 1 && j > 0 ? this.state[i + 1][j - 1] : null, matrix[2][0]);
		delta = this.f2d(delta, i < this.sizeY - 1 ? this.state[i + 1][j] : null, matrix[2][1]);
		delta = this.f2d(
			delta,
			i < this.sizeY - 1 && j < this.sizeX - 1 ? this.state[i + 1][j + 1] : null,
			matrix[2][2]
		);

		return delta;
	},

	/**
	 * @method draw : Update all Cells
	 */
	update: function () {
		for (let i = 0; i < this.sizeY; i++) {
			for (let j = 0; j < this.sizeX; j++) {
				this.state[i][j].update(this.laplacian(this.options.laplacianMatrix, i, j));
			}
		}
	},

	/**
	 * @method draw : Draw all Cells
	 */
	draw: function () {
		for (let i = 0; i < this.sizeY; i++) {
			for (let j = 0; j < this.sizeX; j++) {
				this.state[i][j].draw();
			}
		}
	},

	print: function () {
		console.log(this.state.map((line) => line.map((state) => state.a + ' ' + state.b)));
	},
};

/**
 * @typedef SimulationOption
 *
 * @property {number} width
 * @property {number} height
 *
 * @property {number} canvasWidth
 * @property {number} canvasHeight
 */
