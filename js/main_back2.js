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

var grid = new Array();

var isDone = false;

node = function(){
	this.isStart = false;
	this.isEnd = false;
	this.isObs = false;
	
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
	
	this.neighbors = new Array();
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
	
	if(grid[mouseRow][mouseCol].isStart && !grid[mouseRow][mouseCol].isEnd){
		if(noEnd == false){
			grid[mouseRow][mouseCol].isEnd = false;
		}
		else{
			grid[mouseRow][mouseCol].isEnd = true;
			endX = grid[mouseRow][mouseCol].x;
			d_ex = grid[mouseRow][mouseCol].x;
			endY = grid[mouseRow][mouseCol].y;
			d_ey = grid[mouseRow][mouseCol].y;
			end = grid[mouseRow][mouseCol];
			noEnd = false;
		}
		grid[mouseRow][mouseCol].isStart = false;
		grid[mouseRow][mouseCol].isObs = false;
		noStart = true;
		start = null;
	}
	else if(!grid[mouseRow][mouseCol].isStart && grid[mouseRow][mouseCol].isEnd){
		grid[mouseRow][mouseCol].isEnd = false;
		grid[mouseRow][mouseCol].isStart = false;
		grid[mouseRow][mouseCol].isObs = false;
		end = null;
		noEnd = true;
	}
	else if(!grid[mouseRow][mouseCol].isStart && !grid[mouseRow][mouseCol].isEnd){
		if(grid[mouseRow][mouseCol].isObs){
			if(noStart){
				grid[mouseRow][mouseCol].isStart = true;
				grid[mouseRow][mouseCol].isObs = false;
				start = grid[mouseRow][mouseCol];
				noStart = false;
			}
			else if(noEnd){
				grid[mouseRow][mouseCol].isEnd = true;
				grid[mouseRow][mouseCol].isObs = false;
				end = grid[mouseRow][mouseCol];
				noEnd = false;
			}
			else{
				grid[mouseRow][mouseCol].isObs = false;
			}
		}
		else{
			grid[mouseRow][mouseCol].isObs = true;
		}
	}
		
	
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
	
	closedSet = new Array();
	openSet = new Array();
	
	for(var i = 0; i < rows; i++){
		grid[i] = new Array();
		for(var j = 0; j < cols; j++){
			var t = new node();
			
			t.x = j;
			t.y = i;
			
			if(i == startY && j == startX){
				t.isStart = true;
				t.isEnd = false;
				t.isObs = false;
				
				start = t;
				noStart = false;
			}
			else if(i == endY && j == endX){
				t.isEnd = true;
				t.isStart = false;
				t.isObs = false;
				end = t;
				noEnd = false;
			}
			else {				
				t.isStart = false;
				t.isEnd = false;
				t.isObs = false;
			}
			
			grid[i][j] = t;
		}
	}
	
	draw();
}

function A_Star(){
	
	
	if(start && end){
		var x;
		var y;
		
		closedSet = new Array();
		
		for(var a = 0; a < rows; a++){
			for(var b = 0; b < cols; b++){
				if(grid[a][b].isStart){
					x = b;
					y = a;
				}
			}
		}
		
		start = grid[y][x];
		
		// start.parent = null;
		openSet.push(start);
		
		// start.g = 0;
		// start.f = start.g + manhattanDistance(start);
		
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
			openSet.splice(minIndex, 1);
			findNeighbors(current);
			
			if(current.isEnd){
				return followPath();
			}
			//draw();
			
			closedSet.push(current);
			current.path = true;
			
			for(var j = 0; j < current.neighbors.length; j++){
				if(closedSet.indexOf(current.neighbors[j]) >= 0){
					continue;
				}
				
				var temp_g;

				if(current.x == current.neighbors[j].x || current.y == current.neighbors[j].y)
					temp_g = current.g + 10;
				else
					temp_g = current.g + 14;
				
				if(openSet.indexOf(current.neighbors[j]) < 0 || temp_g < current.neighbors[j].g){
					current.neighbors[j].parent = current;
					current.neighbors[j].g = temp_g;
					current.neighbors[j].f = current.neighbors[j].g + manhattanDistance(current.neighbors[j]);
					
					if(openSet.indexOf(current.neighbors[j]) < 0){
						openSet.push(current.neighbors[j]);
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
	
	while(path.parent != null){	
		path = path.parent;
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
			if(grid[j][k].path == false){
				if(grid[j][k].isObs && !grid[j][k].isStart && !grid[j][k].isEnd)
					str = "green";
				else if(!grid[j][k].isObs && grid[j][k].isStart && !grid[j][k].isEnd)
					str = "blue";
				else if(!grid[j][k].isObs && !grid[j][k].isStart && grid[j][k].isEnd)
					str = "red";
				else
					str = "black";
			}
			else{
				if(grid[j][k].isStart)
					str = "blue";
				else if(grid[j][k].isEnd)
					str = "red";
				else
					str = "yellow";
			}
			//manhattanDistance(grid[j][k]);
			
			context.fillStyle = str;
			context.fillRect((k * (nDim + nBrd)), (j * (nDim + nBrd)), nDim, nDim);
			
			context.font="10px Georgia";
			context.fillStyle = "#ffffff";
			context.fillText(grid[j][k].g,(k * (nDim + nBrd)) + 2, (j * (nDim + nBrd)) + 10);
		}
	}
}

init();
window.addEventListener("keyup", keyListener, false);