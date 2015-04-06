var c; 
var context;

var width;
var height;

var rows;
var cols;

var nDim;
var nBrd;

var startX;
var startY;

var endX;
var endY;

var grid = [];

node = function(){
	this.type = 2;
};

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

	for(var i = 0; i < rows; i++){
		grid[i] = [];
		for(var j = 0; j < cols; j++){
			var t = new node();
			grid[i][j] = t;
			
			if(i == startX && j == startY)
				grid[i][j].type = 0;
			else if(i == endX && j == endY)
				grid[i][j].type = 1;
			else
				grid[i][j].type = 2;
		}
	}
	
	main();
}

function main(){
	requestAnimationFrame(main);
	//draw();
	
	context.fillStyle = "blue";
	context.fillRect(100, 100, 50, 50);
	
}

// function draw(){
	// for(var j in grid){
		// for(var k in grid[j]){

			// var str = "";
			
			// if(grid[j][k].type == 0)
				// str = "blue";
			// else if(grid[j][k].type == 1)
				// str = "red";
			// else
				// str = "black";
			
			// context.fillStyle = str;
			// context.fillRect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
		// }
	// }
// }