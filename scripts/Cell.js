/**
 * @class Cell
 *
 * @param {SimulationOption} options
 * @param {Position} position
 */
function Cell(options, position) {
	this.init(options, position);
}

Cell.prototype = {
	/**
	 * @method init :
	 *
	 * @param {SimulationOption} options
	 * @param {Position} position
	 */
	init: function (options, position) {
		this.a = 1;
		this.lastA = this.a;
		this.b = 0;
		this.lastB = this.b;

		this.o = options;

		this.sizeX = options.canvasWidth / options.width;
		this.sizeY = options.canvasHeight / options.height;

		this.x = position.x;
		this.y = position.y;
	},

	/**
	 * @method update : Update Cell
	 */
	update: function (delta) {
		this.lastA = this.a;
		this.lastB = this.b;

		this.a =
			this.a +
			(this.o.diffusionA * delta.a * this.a - this.a * pow(this.b, 2) + this.o.feed * (1 - this.a)) *
				this.o.speed;
		this.b =
			this.b +
			(this.o.diffusionB * delta.b*1.1 * this.b +
				this.a * pow(this.b, 2) -
				(this.o.kill + this.o.feed) * this.b) *
				this.o.speed;
	},

	/**
	 * @method draw : Draw Cell
	 */
	draw: function () {
		const rate = this.a/(this.a+this.b);
		fill(rate * 255);
		rect(this.x * this.sizeX, this.y * this.sizeY, this.sizeX, this.sizeY);
	},
};

/**
 * @typedef Position
 *
 * @property {number} x
 * @property {number} y
 */
