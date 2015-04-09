var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext('2d');

context.clearRect ( 0 , 0 , canvas.width, canvas.height );

var width = canvas.width;
var height = canvas.height;

var rows;
var cols;

var nDim;
var nBrd;

var start;
var noStart = false;
var startX;
var startY;

var end;
var noEnd = false;
var endX;
var endY;

var d_sx;
var d_sy;

var d_ex;
var d_ey;

var grid = [];

var isDone = false;

node = function(){
	this.type = 2;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	
	this.x = 0;
	this.y = 0;
	
	this.cost = 10;
	
	this.path = false;
	
	this.parent = null;
	// this.parentX = 0;
	// this.parentY = 0;
	
	this.neighbors = [];
};

document.onmousemove = function(e){
	mouseX = e.pageX - (window.innerWidth - width) / 2;
	mouseY = e.pageY - (window.innerHeight - height) / 2;
};

function keyListener(e){
	switch(e.keyCode){
		case 32:
			if(isDone){
				console.log("init...");
				init();
			}
			else{
				console.log("A_Star...");
				A_Star();
			}
			isDone = !isDone;
			break;
	}
}

document.onmousedown = function(e){
	var mouseCol = Math.floor(mouseX / (nDim + nBrd));
	var mouseRow = Math.floor(mouseY / (nDim + nBrd));
	if(!e)
		e = window.event;
	
	var cap = 3;
	
	// if(grid[mouseRow][mouseCol].type == 2)
		// grid[mouseRow][mouseCol].type = 3;
	// else if(grid[mouseRow][mouseCol].type == 3)
		// grid[mouseRow][mouseCol].type = 2;
	
	if(grid[mouseRow][mouseCol].type == 0){
		if(noEnd == false)
			grid[mouseRow][mouseCol].type = 2;
		else{
			grid[mouseRow][mouseCol].type = 1;
			endX = grid[mouseRow][mouseCol].x;
			d_ex = grid[mouseRow][mouseCol].x;
			endY = grid[mouseRow][mouseCol].y;
			d_ey = grid[mouseRow][mouseCol].y;
			end = grid[mouseRow][mouseCol];
			noEnd = false;
		}
		noStart = true;
		start = null;
	}
	else if(grid[mouseRow][mouseCol].type == 1){
		grid[mouseRow][mouseCol].type = 2;
		end = null;
		noEnd = true;
	}
	else if(grid[mouseRow][mouseCol].type == 2)
		grid[mouseRow][mouseCol].type = 3;
	else if(grid[mouseRow][mouseCol].type == 3){
		if(noStart == false && noEnd == false)
			grid[mouseRow][mouseCol].type = 2;
		else if(noStart == false && noEnd == true){
			grid[mouseRow][mouseCol].type = 1;
			endX = grid[mouseRow][mouseCol].x;
			d_ex = grid[mouseRow][mouseCol].x;
			endY = grid[mouseRow][mouseCol].y;
			d_ey = grid[mouseRow][mouseCol].y;
			end = grid[mouseRow][mouseCol];
			noEnd = false;
		}
		else{
			grid[mouseRow][mouseCol].type = 0;
			startX = grid[mouseRow][mouseCol].x;
			d_sx = grid[mouseRow][mouseCol].x;
			startY = grid[mouseRow][mouseCol].y;
			d_sy = grid[mouseRow][mouseCol].y;
			start = grid[mouseRow][mouseCol];
			noStart = false;
		}
	}
	else
		grid[mouseRow][mouseCol].type = 3;
	
	draw();
};

function init(){

	// console.log("init");

	rows = 20;
	cols = 20;
	
	nBrd = 1;
	nDim = (width - ((rows-1) * nBrd)) / rows;
	
	startX = 1;
	startY = 1;
	endX = 18;
	endY = 17;
	
	d_sx = startX;
	d_sy = startY;
	d_ex = endX;
	d_ey = endY;
	
	closedSet = [];
	openSet = [];
	
	for(var i = 0; i < rows; i++){
		grid[i] = [];
		for(var j = 0; j < cols; j++){
			var t = new node();
			
			t.x = j;
			t.y = i;
			
			if(i == startY && j == startX){
				// grid[i][j].type = 0;
				t.type = 0;
				start = t;
				noStart = false;
				// start = grid[i][j];
			}
			else if(i == endY && j == endX){
				// grid[i][j].type = 1;
				t.type = 1;
				end = t;
				noEnd = false;
				// end = grid[i][j];
			}
			else {				
				// grid[i][j].type = 2;
				t.type = 2;
			}
			
			grid[i][j] = t;
		}
	}
	
	draw();
}

function min_node(nodeArray){
	var min;
	var minIndex;
	if(nodeArray){
		min = nodeArray[0].f;
		minIndex = 0;
		for(var i = 0; i < nodeArray.length; i++){
			if(nodeArray[i].f < min){
				min = nodeArray[i].f;
				minIndex = i;
			}
		}
		
		return nodeArray[minIndex];
	}
}

function A_Star(){
	
	
	if(start && end){
		closedSet = [];
		start.parent = null;
		openSet.push(start);
		
		start.g = 0;
		start.f = start.g + manhattanDistance(start);
		
		while(openSet.length > 0){
			
			var min = openSet[0].f;
			var minIndex = 0;
			
			for(var i = 0; i < openSet.length; i++){
				if(openSet[i].f < min){
					min = openSet[i].f;
					minIndex = i;
				}
			}
			
			var current = openSet[minIndex];
			
			if(current == end){
				return followPath();
			}
			//draw();
			openSet.splice(minIndex, 1);
			closedSet.push(current);
			current.path = true;
			
			findNeighbors(current);

			for(var j = 0; j < current.neighbors.length; j++){
				if(closedSet.indexOf(current.neighbors[j]) >= 0){
					continue
					current.neighbors[j].type = 2;
				}

				current.neighbors[j].type = 2;
				
				var temp_g = current.g + current.neighbors[j].cost;

				if(openSet.indexOf(current.neighbors[j]) < 0 || temp_g < current.neighbors[j].g){
					current.neighbors[j].parent = current;
					current.neighbors[j].g = temp_g;
					current.neighbors[j].f = current.neighbors[j].g + manhattanDistance(current.neighbors[j]);
					
					current.neighbors[j].type = 2;
					
					if(openSet.indexOf(current.neighbors[j]) < 0){
						openSet.push(current.neighbors[j]);
						current.neighbors[j].type = 2;
					}
				}
			}
		}
		alert("No path available!");
		init();
	}
	else{
		if(!start && end){
			alert("no start!");
			clear();
		}
		else if(!end && start){
			alert("no end!");
			clear();
		}
		else{
			alert("no start and end!");
			clear();
		}
	}
	
	//return false;
}

function followPath(){
	var path = end;
	path.type = 2;
	while(path.parent != null){	
		path = path.parent;
		//path.type = 6;	
	}
	
	draw();	
}

function manhattanDistance(node){
	
	var dx = Math.floor(Math.abs(node.x - endX));
	var dy = Math.floor(Math.abs(node.y - endY));
	
	node.h = ((dx + dy) * 10);
}

function findNeighbors(node){
	var nodeNeighbors = [];
	var x = node.x;
	var y = node.y;
	
	//up, down, right, left
	if(grid[y - 1] && grid[y-1][x]){
		if(grid[y-1][x].type != 3)
			nodeNeighbors.push(grid[y-1][x]);
	}
	if(grid[y + 1] && grid[y + 1][x])
		if(grid[y + 1][x].type != 3)
			nodeNeighbors.push(grid[y + 1][x]);
	if(grid[y][x + 1] && grid[y][x + 1])
		if(grid[y][x + 1].type != 3){
			nodeNeighbors.push(grid[y][x + 1]);
		}
	if(grid[y][x - 1] && grid[y][x - 1])
		if(grid[y][x - 1].type != 3){
			nodeNeighbors.push(grid[y][x - 1]);
		}
	
	//diagonals
	
	if(grid[y - 1] && grid[y - 1][x - 1]){
		if(grid[y - 1][x - 1].type != 3 && grid[y][x - 1].type != 3 && grid[y - 1][x].type != 3){
			nodeNeighbors.push(grid[y - 1][x - 1]);
			grid[y - 1][x - 1].cost = 14;
		}
	}
	if(grid[y - 1] && grid[y - 1][x + 1]){
		if(grid[y - 1][x + 1].type != 3 && grid[y][x + 1].type != 3 && grid[y - 1][x].type != 3){
			nodeNeighbors.push(grid[y - 1][x + 1]);
			grid[y - 1][x + 1].cost = 14;
		}
	}
	if(grid[y + 1] && grid[y + 1][x - 1]){
		if(grid[y + 1][x - 1].type != 3 && grid[y][x - 1].type != 3 && grid[y + 1][x].type != 3){
			nodeNeighbors.push(grid[y + 1][x - 1]);
			grid[y + 1][x - 1].cost = 14;
		}
	}
	if(grid[y + 1] && grid[y + 1][x + 1]){
		if(grid[y + 1][x + 1].type != 3 && grid[y][x + 1].type != 3 && grid[y + 1][x].type != 3){
			nodeNeighbors.push(grid[y + 1][x + 1]);
			grid[y + 1][x + 1].cost = 14;
		}
	}
	
	// for(var i = 0; i < nodeNeighbors.length; i++)
		// console.log("findNeighbors, coord (" + nodeNeighbors[i].x + ", " + nodeNeighbors[i].y + ")");
	
	node.neighbors = nodeNeighbors;
}

function draw(){
	for(var j in grid){
		for(var k in grid[j]){

			var str = "";
			if(grid[j][k].path == false && grid[j][k].type != 0 && grid[j][k].type != 1){
				// if(grid[j][k].type == 0)
					// str = "blue";
				// else if(grid[j][k].type == 1)
					// str = "red";
				if(grid[j][k].type == 2)
					str = "black";
				else //if(grid[j][k].type == 3)
					str = "green";
				// else if(grid[j][k].type == 4)
					// str = "orange";
				// else if(grid[j][k].type == 5)
					// str = "gray";
				// else if(grid[j][k].type == 6)
					// str = "yellow";
			}
			else if(grid[j][k].path == true && grid[j][k].type != 0 && grid[j][k].type != 1)
				str = "gray";
			else if(grid[j][k].type == 0 && grid[j][k].type != 1)
				str = "blue";
			else if(grid[j][k].type != 0 && grid[j][k].type == 1)
				str = "red";
			//manhattanDistance(grid[j][k]);
			
			context.fillStyle = str;
			context.fillRect((k * (nDim + nBrd)), (j * (nDim + nBrd)), nDim, nDim);
			
			context.font="10px Georgia";
			context.fillStyle = "#ffffff";
			context.fillText(grid[j][k].g,(k * (nDim + nBrd)) + 2, (j * (nDim + nBrd)) + 10);
		}
	}
}

// function clear(){
	
	// startX = d_sx;
	// startY = d_sy;
	// endX = d_ex;
	// endY = d_ey;
	
	// for(var i = 0; i < rows; i++){
		// for(var j = 0; j < cols; j++){
			
			// grid[i][j].neighbors = [];
			
			// grid[i][j].f = 0;
			// grid[i][j].g = 0;
			// grid[i][j].h = 0;
			
			// grid[i][j].cost = 10;
			
			// if(i == startY && j == startX){
			// //	t.type = 0;
				// grid[i][j].type = 0;
				// start = grid[i][j];
				// noStart = false;
				// // start = grid[i][j];
			// }
			// else if(i == endY && j == endX){
				// //t.type = 1;
				// //end = t;
				// end = grid[i][j];
				// grid[i][j].type = 1;
				// noEnd = false;
			// }
			// else {				
				// grid[i][j].type = 2;
				// //t.type = 2;
			// }
			
			// //grid[i][j] = t;
		// }
	// }
	
	// // startX = d_sx;
	// // startY = d_sy;
	// // endX = d_ex;
	// // endY = d_ey;
	
	// openSet = [];
	// closedSet = [];
	// draw();
// }

Array.prototype.includes = function (obj){

		var i = this.length;
		
		while(i--){
			if(this[i] == obj){
				return true;
			}
		}
		
		return false;

}

init();
window.addEventListener("keyup", keyListener, false);