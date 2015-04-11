var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var height = canvas.height;
var width = canvas.width;

var rows;
var cols;

var nBrd;
var nDim;

var start;
var end;

var startX;
var startY;
var endX;
var endY;

var startExist;
var endExist;

var grid = [];

var isRunning;
var toggleAlg;

var closedset;
var openset;

var isDone = false;

var mx, my;

var debug;

document.onmousemove = function(e){
	mouseX = e.pageX - (window.innerWidth - width) / 2;
	mouseY = e.pageY - (window.innerHeight - height) / 2;
	
	//console.log("mousex: " + mouseX + ", mousey: " + mouseY);
};


document.onmousedown = function(e){
	
	var mouseCol = Math.floor((mouseX / (nDim + nBrd)) - 1) ;
	var mouseRow = Math.floor(mouseY / (nDim + nBrd));
	
	// console.log("mouseCol: " + mouseCol + ", mouseRow: " + mouseRow);
	
	if(!e)
		e = window.event;
	
	var block = grid[mouseRow][mouseCol];
	
	if(!block.path){
		if(block.isStart){
			block.isStart = false;
			block.isObs = false;
			start = null;
			startExist = false;
			
			if(endExist){
				block.isEnd = false;
			}
			else{
				block.isEnd = true;
				endX = block.x;
				endY = block.y;
				end = block;
				endExist = true;
			}
		}
		else if(block.isEnd){
			block.isEnd = false;
			block.isObs = false;
			end = null;
			endExist = false;
		}
		else{
			if(block.isObs){
				block.isObs = false;
				block.isStart = false;
				block.isEnd = false;
			}
			else{
				if(startExist && endExist){
					block.isObs = true;
					block.isStart = false;
					block.isEnd = false;
				}
				else if(startExist && !endExist){
					block.isStart = false;
					block.isEnd = true;
					block.isObs = false;
					
					end = block;
					endX = block.x;
					endY = block.y;
					endExist = true;
				}
				else{
					block.isStart = true;
					block.isEnd = false;
					block.isObs = false;
					
					start = block;
					startX = block.x;
					startY = block.y;
					startExist = true;
				}
			}
		}
	}
	
	draw();
}

function keyFunc(e){
	switch(e.keyCode){
		case 68:
			if(isDone){
				init();
			}
			else{
				A_star();
			}
			isDone = !isDone;
			break;
		case 65:
			debug = (debug + 1) % 4;
			draw();
			break;
		case 70:
			if(!isDone || isRunning != 0)
			toggleAlg = (toggleAlg + 1) % 2;
			break;
		case 83:
			if(isRunning == 0)
				setupAStar();
			else if(isRunning == 1)
				AStarStep();
			else
				init();
			break;
		case 90:
			init();
			break;
	}
}

function setRowCol(){
	rows = parseInt(document.getElementById('rowValue').value);
	cols = parseInt(document.getElementById('colValue').value);
	
	nBrd = 1;
	nDim = (width - ((rows - 1) * nBrd)) / rows;
	
	if(startX > cols)
		startX = cols-1
	if(startY > rows)
		startY = rows-1;

	if(endX > cols)
		endX = cols-1;
	if(endY > rows)
		endY = rows-1;
	
	buildGrid();
	
	// grid = new Array();
	
	// for(var i = 0; i < rows; i++){
		
		// grid[i] = new Array();
		
		// for(var j = 0; j < cols; j++){
		
			// var t = new node();
			// t.x = j;
			// t.y = i;
		
			// if(i == startY && j == startX){
				// start = t;
				// t.isStart = true;
				// t.isEnd = false;
				// t.isObs = false;
				// startExist = true;
			// }
			// else if(i == endY && j == endX){
				// end = t;
				// t.isStart = false;
				// t.isEnd = true;
				// t.isObs = false;
				// endExist = true;
			// }
			// else{
				// t.isStart = false;
				// t.isEnd = false;
				// t.isObs = false;
			// }
			//t.parent = null;
			// grid[i][j] = t;
		// }
	// }
	
	// draw();
	
}

node = function(){
	this.isStart = false;
	this.isEnd = false;
	this.isObs = false;
	
	this.x;
	this.y;
	
	this.f = 0;
	this.g = 0;
	this.h = 0;
	
	this.parent;
	this.path = false;
	this.winPath = false;
	
	this.neighbors = new Array();
}

function A_star(){
	
	for(var i = 0; i < rows; i++){
		for(var j = 0; j < cols; j++){
			if(grid[i][j].isStart){
				start = grid[i][j];
			}
			if(grid[i][j].isEnd){
				end = grid[i][j];
			}
		}
	}
	
	closedset = new Array();
	openset = new Array();
	
	start.g = 0;
	manhattanDistance(start);
	start.f = start.g + start.h;
	
	start.parent = null;
	
	openset.push(start);
	
	while(openset.length > 0){
		
		var current;

		var min = Number.POSITIVE_INFINITY;
		var minIndex = 0;
		
		for(var i = openset.length-1; i >= 0; i--){
			if(openset[i].f < min){
				min = openset[i].f;
				minIndex = i;
			}
		}
		
		current = openset[minIndex];
		
		if(current.isEnd){
			
			current.winPath = true;
			//end.parent = current;
			
			return followPath(current);
		}
		
		current.path = true;
		
		openset.splice(minIndex, 1);
		closedset.push(current);
		
		findNeighbors(current);
		
		var neighbors = current.neighbors;
		
		for(var j = 0; j < neighbors.length; j++){
			if(closedset.indexOf(neighbors[j]) >= 0 || neighbors[j].isObs){
				continue;
			}
			
			var temp_g;
			
			if(current.x == neighbors[j].x || current.y == neighbors[j].y){
				temp_g = current.g + 10;
			}
			else{
				temp_g = current.g + 14;
			}
			
			if(openset.indexOf(neighbors[j]) <= 0 ||temp_g < neighbors[j].g){
				
				var t = neighbors[j];
				
				t.parent = current;
				
				t.g = temp_g;
				manhattanDistance(t);
				t.f = t.g + t.h;
				
				if(openset.indexOf(t) < 0){
					openset.push(t);
				}
				
				neighbors[j] = t;
			}
		}
		draw();
	}
	alert("No path found!");
	init();
}

function setupAStar(){
	isRunning = 1;
	
	for(var i = 0; i < rows; i++){
		for(var j = 0; j < cols; j++){
			if(grid[i][j].isStart){
				start = grid[i][j];
			}
			if(grid[i][j].isEnd){
				end = grid[i][j];
			}
		}
	}
	
	closedset = new Array();
	openset = new Array();
	
	start.g = 0;
	manhattanDistance(start);
	start.f = start.g + start.h;
	
	start.parent = null;
	
	openset.push(start);
	
	AStarStep();
	
}
function AStarStep(){
	
	if(openset.length > 0){
		
		var current;

		var min = Number.POSITIVE_INFINITY;
		var minIndex = 0;
		
		for(var i = openset.length-1; i >= 0; i--){
			if(openset[i].f < min){
				min = openset[i].f;
				minIndex = i;
			}
		}
		
		current = openset[minIndex];
		
		if(current.isEnd){
			
			current.winPath = true;
			// end.parent = current;
			
			return followPath(current);
		}
		
		current.path = true;
		
		openset.splice(minIndex, 1);
		closedset.push(current);
		
		findNeighbors(current);
		
		var neighbors = current.neighbors;
		
		for(var j = 0; j < neighbors.length; j++){
			if(closedset.indexOf(neighbors[j]) >= 0 || neighbors[j].isObs){
				continue;
			}
			
			var temp_g;
			
			if(current.x == neighbors[j].x || current.y == neighbors[j].y){
				temp_g = current.g + 10;
			}
			else{
				temp_g = current.g + 14;
			}
			
			if(openset.indexOf(neighbors[j]) <= 0 ||temp_g < neighbors[j].g){
				
				var t = neighbors[j];
				
				t.parent = current;
				
				t.g = temp_g;
				manhattanDistance(t);
				t.f = t.g + t.h;
				
				if(openset.indexOf(t) < 0){
					openset.push(t);
				}
				
				neighbors[j] = t;
			}
		}
		draw();
	}
	else{
		alert("No path found!");
		init();
	}
}

function followPath(curr){
	var p = curr;
	p.winPath = true;
	
	while(p.parent){
		p.winPath = true;
		p.path = false;
		p = p.parent;
		draw();
	}
	
	isRunning = 2;
	draw();
	
}

Array.prototype.min = function() {
  return Math.min.apply(null, this.f);
};

function manhattanDistance(node){
	
	if(toggleAlg == 0){
		if(end){
			var dx = Math.floor(Math.abs(node.x - endX));
			var dy = Math.floor(Math.abs(node.y - endY));
		
			node.h = ((dx + dy) * 10);
		}
		else
			alert("H undefined!");
	}
	else
		node.h = 0;
}

function findNeighbors(node){
	var nodeNeighbors = [];
	var x = node.x;
	var y = node.y;
	
	//up, down, right, left
	if(grid[y - 1] && grid[y-1][x]){
		if(!grid[y-1][x].isObs || !grid[y-1][x].isStart)
			nodeNeighbors.push(grid[y - 1][x]);
	}
	if(grid[y + 1] && grid[y + 1][x])
		if(!grid[y + 1][x].isObs || !grid[y + 1][x].isStart)
			nodeNeighbors.push(grid[y + 1][x]);
	if(grid[y][x + 1] && grid[y][x + 1])
		if(!grid[y][x + 1].isObs || !grid[y][x + 1].isStart){
			nodeNeighbors.push(grid[y][x + 1]);
		}
	if(grid[y][x - 1] && grid[y][x - 1])
		if(!grid[y][x - 1].isObs|| !grid[y][x - 1].isStart){
			nodeNeighbors.push(grid[y][x - 1]);
		}
		
	//diagonals
	
	if(grid[y - 1] && grid[y - 1][x - 1]){
		if((!grid[y - 1][x - 1].isObs || !grid[y - 1][x - 1].isStart) && (!grid[y][x - 1].isObs || !grid[y][x - 1].isStart) && (!grid[y - 1][x].isObs || !grid[y - 1][x].isStart)){
			nodeNeighbors.push(grid[y - 1][x - 1]);
			grid[y - 1][x - 1].cost = 14;
		}
	}
	if(grid[y - 1] && grid[y - 1][x + 1]){
		if((!grid[y - 1][x + 1].isObs || !grid[y - 1][x + 1].isStart) && (!grid[y][x + 1].isObs || !grid[y][x + 1].isStart) && (!grid[y - 1][x].isObs || !grid[y - 1][x].isStart)){
			nodeNeighbors.push(grid[y - 1][x + 1]);
			grid[y - 1][x + 1].cost = 14;
		}
	}
	if(grid[y + 1] && grid[y + 1][x - 1]){
		if((!grid[y + 1][x - 1].isObs || !grid[y + 1][x + 1].isStart) && (!grid[y][x - 1].isObs || !grid[y + 1][x].isStart) && (!grid[y + 1][x].isObs || !grid[y + 1][x].isStart)){
			nodeNeighbors.push(grid[y + 1][x - 1]);
			grid[y + 1][x - 1].cost = 14;
		}
	}
	if(grid[y + 1] && grid[y + 1][x + 1]){
		if((!grid[y + 1][x + 1].isObs || !grid[y + 1][x + 1].isStart) && (!grid[y][x + 1].isObs || !grid[y][x + 1].isStart) && (!grid[y + 1][x].isObs || !grid[y + 1][x].isStart)){
			nodeNeighbors.push(grid[y + 1][x + 1]);
			grid[y + 1][x + 1].cost = 14;
		}
	}
	
	node.neighbors = nodeNeighbors;
}

function init(){
	
	if(isNaN(rows)){
		rows = 15;
	}
	if(isNaN(cols)){
		cols = 15;
	}

	if(isNaN(toggleAlg))
		toggleAlg = 0;
	
	startX = 1;
	startY = 2;
	
	endX = 8;
	endY = 7;
	
	nBrd = 1;
	nDim = (width - ((rows - 1) * nBrd)) / rows;
	
	if(isNaN(debug))
		debug = 0;
	
	isRunning = 0;
	buildGrid();
}

function buildGrid(){
	
	grid = new Array();
	
	for(var i = 0; i < rows; i++){
		
		grid[i] = new Array();
		
		for(var j = 0; j < cols; j++){
		
			var t = new node();
			t.x = j;
			t.y = i;
		
			if(i == startY && j == startX){
				start = t;
				t.isStart = true;
				t.isEnd = false;
				t.isObs = false;
				startExist = true;
			}
			else if(i == endY && j == endX){
				end = t;
				t.isStart = false;
				t.isEnd = true;
				t.isObs = false;
				endExist = true;
			}
			else{
				t.isStart = false;
				t.isEnd = false;
				t.isObs = false;
			}
			// t.parent = null;
			
			grid[i][j] = t;
		}
	}
	
	draw();
}

function draw(){
	
	context.clearRect(0,0,width, height);
	
	for(var i = 0; i < rows; i++){
		for(var j = 0; j < cols; j++){
			var block = grid[i][j];
			
			var str = "";
			if(block.winPath && !block.isEnd)
				str = "yellow";
			else{
				if(block.isStart)
					str = "blue";
				else if(block.isEnd)
					str = "red";
				else if(block.isObs)
					str = "green";
				else if(block.path && (!block.isStart || !block.isEnd)){
					if(toggleAlg == 0)
						str = "#232323";
					else
						str = "#DCDCDC";
				}
				else
					str = "black";
			}
			if(start && end)	
				manhattanDistance(grid[i][j]);
				
			context.fillStyle = str;
			context.fillRect(j * (nDim + nBrd), i * (nDim + nBrd), nDim, nDim);
			
			if(debug == 0){
				score = "";
				context.font="7px Helvetica";
				context.fillStyle = "#ffffff";
				context.fillText("", (j * (nDim + nBrd)) + 2, (i * (nDim + nBrd)) + 10);
			}
			else if(debug == 1){
				context.font="7px Helvetica";
				context.fillStyle = "#ffffff";
				context.fillText(grid[i][j].f, (j * (nDim + nBrd)) + 2, (i * (nDim + nBrd)) + 10);
			}
			else if(debug == 2){
				context.font="7px Helvetica";
				context.fillStyle = "#ffffff";
				context.fillText(grid[i][j].g, (j * (nDim + nBrd)) + 2, (i * (nDim + nBrd)) + 10);
			}
			else{
				context.font="7px Helvetica";
				context.fillStyle = "#ffffff";
				context.fillText(grid[i][j].h, (j * (nDim + nBrd)) + 2, (i * (nDim + nBrd)) + 10);
			}
			
			// context.font="7px Helvetica";
			// context.fillStyle = "#ffffff";
			// context.fillText(grid[i][j].f, (j * (nDim + nBrd)) + 2, (i * (nDim + nBrd)) + 10);
			
			
		}
	}
}

init();
window.addEventListener("keyup", keyFunc, false);