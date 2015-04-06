var c;
var ctx;

var width;
var height;

var rows;
var cols;

var nBrd;
var nDim;

var startX;
var startY;
var endX;
var endY;

var arr;
// var grid;

node = function(){
	this.type = 2;
	// this.parent = null;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	
	// this.prevX = 0;
	// this.prevY = 0;
}

// function game(sx, sy, ex, ey, r, c, nb, nd, cx){
	// this.ctx = cx;
	
	// this.row = r;
	// this.col = c;
	// this.startX = sx;
	// this.startY = sy;
	// this.endX = ex;
	// this.endY = ey;
	// this.nDim = nd;
	// this.nBrd = nb;
	
	// this.arr = new Array(this.rows);
	
	// for(var g = 0; g < this.rows; g++)
		// this.arr[g] = new Array(this.cols);
	
	// for(var h = 0; h < this.rows; h++){
		// for(var i = 0; i < this.cols; i++){
			// this.arr[h][i] = new node();
			
			// if(h == this.startX && i == this.startY){
				// this.arr[h][i] = new node(0);
				// console.log("start node");
			// }
			// else if(h == this.endX && i == this.endY){
				// this.arr[h][i] = new node(1);
				// console.log("end node");
			// }
			// else{
				// this.arr[h][i] = new node(2);
			// }
			
			// console.log("Array pass #2, Type: " + this.arr[h][i].type);
		// }
	// }
// }

// game.prototype.draw = function() {
	
	// for(var j in this.arr){
		// for(var k in this.arr[j]){
			
			// var str = "";
			
			// if(this.arr[j][k].type == 0)
				// str = "blue";
			// else if(this.arr[j][k].type == 1)
				// str = "red";
			// else
				// str = "black";

			// ctx.fillStyle = str;
			// ctx.fillRect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
		// }
	// }
// };

// function draw(){
	// for(var j in arr){
		// for(var k in arr[j]){
			
			// var str = "";
			
			// if(arr[j][k].type == 0)
				// str = "blue";
			// else if(arr[j][k].type == 1)
				// str = "red";
			// else
				// str = "black";

			// ctx.fillStyle = str;
			// ctx.fillRect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
		// }
	// }
// }

function init(){
	
	c = document.getElementById("gameCanvas");
	context = c.getContext('2d');

	width = c.width;
	height = c.height;	
	
	rows = 10;
	cols = 10;
	
	nBrd = 5;
	nDim = (width - ((rows-1) * nBd)) / rows;
	
	startX = 1;
	startY = 1;
	endX = 8;
	endY = 7;
	
	//grid = new game(start_X, start_Y, end_X, end_Y, rows, cols, nBd, nD, context);
	
	arr = new Array(rows);
	for(var g = 0; g < rows; g++)
		arr[g] = new Array(cols);
	
	
	for(var h = 0; h < rows; h++){
		for(var i = 0; i < cols; i++){
			console.log("HERE");
			var n = new node();
			arr[h][i] = n;
			if(h == startX && i == startY){
				arr[h][i] .type = 0;
				console.log("start node");
			}
			else if(h == endX && i == endY){
				arr[h][i] .type = 1;
				console.log("end node");
			}
			else{
				arr[h][i] .type = 2;
			}
			
			console.log("Array pass #2, Type: " + arr[h][i].type);
			
		}
	}
	
	// for(var j = 0; j < rows; j++){
		// for(var k = 0; k < cols; k++){
	for(var j in arr){
		for(var k in arr[j]){
			// ctx.rect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
			
			var str = "";
			
			if(arr[j][k].type == 0)
				str = "blue";
			else if(arr[j][k].type == 1)
				str = "red";
			else
				str = "black";
			
			//console.log("Array Pass #3, str: " + str + " and ctx.fillStyle: " + ctx.fillStyle);
			
			//ctx.rect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
			ctx.fillStyle = str;
			ctx.fillRect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
			
			
			
			// var str = "pink"
			// ctx.fillStyle = str;
			// ctx.fill();
		}
	}
}

// function main(){
	// requestAnimationFrame(main);
	// draw();
// }

