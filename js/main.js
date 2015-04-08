var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext('2d');

context.clearRect ( 0 , 0 , canvas.width, canvas.height );

var width = canvas.width;
var height = canvas.height;

var rows;
var cols;

var nDim;
var nBrd;

var start = null;
var noStart = false;
var startX;
var startY;

var end = null;
var noEnd = false;
var endX;
var endY;

var grid = [];

var openList = [];
var closedList = [];

// window.addEventListener("keyup", keyListener, false);

document.onmousemove = function(e){
	mouseX = e.pageX - (window.innerWidth - width) / 2;
	mouseY = e.pageY - (window.innerHeight - height) / 2;
};

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
			endY = grid[mouseRow][mouseCol].y;
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
			endY = grid[mouseRow][mouseCol].y;
			end = grid[mouseRow][mouseCol];
			noEnd = false;
		}
		else{
			grid[mouseRow][mouseCol].type = 0;
			startX = grid[mouseRow][mouseCol].x;
			startY = grid[mouseRow][mouseCol].y;
			start = grid[mouseRow][mouseCol];
			noStart = false;
		}
	}
	else
		grid[mouseRow][mouseCol].type = 0;
	
	draw();
};

function keyListener(e){
	switch(e.keyCode){
		case 32:
			step();
			break;
	}
}

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
	this.parentX = 0;
	this.parentY = 0;
	
	this.neighbors = [];
};

function init(){

	console.log("init");

	rows = 10;
	cols = 10;
	
	nBrd = 2;
	nDim = (width - ((rows-1) * nBrd)) / rows;
	
	startX = 1;
	startY = 1;
	endX = 8;
	endY = 7;

	for(var i = 0; i < rows; i++){
		grid[i] = [];
		for(var j = 0; j < cols; j++){
			var t = new node();
			grid[i][j] = t;
			
			if(i == 0 && j == 0){
				grid[i][j].x = 0;
				grid[i][j].y = 0;
			}
			else{
				grid[i][j].y = i;
				grid[i][j].x = j;
			}
				
			if(i == startX && j == startY){
				grid[i][j].type = 0;
				noStart = false;
				start = grid[i][j];
			}
			else if(i == endX && j == endY){
				grid[i][j].type = 1;
				noEnd = false;
				end = grid[i][j];
			}
			else 
				grid[i][j].type = 2;
		}
	}
	
	draw();
}

function step(){
	
	var min;
	
	for(var a = 0; a < rows; a++){
		for(var b = 0; b < cols; b++){
			if(grid[a][b].type == 3){
				closedList.push(grid[a][b]);
				//console.log("closedList, pushed: (" + b + ", " + a + ")");
			}
		}
	}
	
	grid[startY][startX].path = true;
	closedList.push(grid[startY][startX]);
	
	for(var c = 0; c < rows; c++){
		for(var d = 0; d < cols; d++){
			manhattanDistance(grid[c][d]);
			//console.log("x: " + d + ", y: " + c + ", h: " + grid[c][d].h);
		}
	}
	
	for (var f = 0; f < rows; f++){
		for (var g = 0; g < cols; g++){
			
			findNeighbors(grid[f][g]);
			var n = grid[f][g].neighbors;
			
			for (var s = 0; s < n.length; s++) {
				
				var coord = n[s];
				
				//console.log("coordinates, (" + coord.x + ", " + coord.y + ")");
				
				if(coord.x && coord.y && !(closedList.includes(grid[coord.y][coord.x]))){
					openList.push(grid[coord.y][coord.x]);
					//console.log("openList, pushed (" + coord.x + ", " + coord.y + ")");
					grid[coord.y][coord.x].parentX = startX;
					grid[coord.y][coord.x].parentY = startY;
					
					if(coord.x == startX || coord.Y == startY)
						grid[coord.y][coord.x].g += 10;
					else
						grid[coord.y][coord.x].g += 14;
					
					grid[coord.y][coord.x].f = grid[coord.y][coord.x].h + grid[coord.y][coord.x].g;
					
					// if(coord.x == endX && coord.y == endY){
						
					// }
					
					min = grid[coord.y][coord.x];
				}
			}
		}
		
		for(var l = 0; l < rows; l++){
			for(var m = 0; m < cols; m++){
				if(grid[l][m].f <= min && openlist.includes(grid[l][m]) && !(closedList.includes(grid[l][m]))){
					
					min = grid[l][m].f;
					
					console.log("reassign start");
					
					grid[startY][startX].type = 4;
					
					startX = m;
					startY = l;
					
					start = grid[l][m];
					start.type = 0;
				}
			}
		}
	}
	console.log("x: " + startX + ", y: " + startY);
	draw();
}

Array.prototype.includes = function (obj){

	var i = this.length;
	while(i--){
		if(this[i] == obj){
			return true;
		}
	}
	
	return false;
}

function isWall(node) {
	return node.type == 3;
}

// function breadthFirst(){
	// var openList = [start];
	// var closedList = [];
	
	// var ahead = [];
	// ahead.push(start);
	
	// behind = [];
	
	// while(ahead.length > 0){
		// var temp = ahead.pop();
		
		// if(temp.x == end.x && temp.y == end.y)
			// break;	
		
		// findNeighbors(temp);
		// var around = temp.neighbors;
		// for(int i = 0; i < around.length; i++){
			// if(!behind.includes(around[i])){
				// ahead.push(around[i]);
				// behind.push(temp);
			// }
		// }
	// }
	
	// for each (n in ahead){
		// n.type = 4;
	// }
// }


function manhattanDistance(node){
	
	var dx = Math.floor(Math.abs(node.x - endX));
	var dy = Math.floor(Math.abs(node.y - endY));
	
	node.h = ((dx + dy) * 10);
}

// function main(){
	// requestAnimationFrame(main);
	// draw();
// }	

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
		nodeNeighbors.push(grid[y][x + 1]);
	if(grid[y][x - 1] && grid[y][x - 1])
		nodeNeighbors.push(grid[y][x - 1]);
	
	//diagonals
	
	if(grid[y - 1] && grid[y - 1][x - 1]){
		nodeNeighbors.push(grid[y - 1][x - 1]);
		grid[y - 1][x - 1].cost = 14;
	}
	if(grid[y - 1] && grid[y - 1][x + 1]){
		nodeNeighbors.push(grid[y - 1][x + 1]);
		grid[y - 1][x + 1].cost = 14;
	}
	if(grid[y + 1] && grid[y + 1][x - 1]){
		nodeNeighbors.push(grid[y + 1][x - 1]);
		grid[y + 1][x - 1].cost = 14;
	}
	if(grid[y + 1] && grid[y + 1][x + 1]){
		nodeNeighbors.push(grid[y + 1][x + 1]);
		grid[y + 1][x + 1].cost = 14;
	}
	
	// for(var i = 0; i < nodeNeighbors.length; i++)
		// console.log("findNeighbors, coord (" + nodeNeighbors[i].x + ", " + nodeNeighbors[i].y + ")");
	
	node.neighbors = nodeNeighbors;
}

function draw(){
	for(var j in grid){
		for(var k in grid[j]){

			var str = "";
			
			if(grid[j][k].type == 0)
				str = "blue";
			else if(grid[j][k].type == 1)
				str = "red";
			else if(grid[j][k].type == 2)
				str = "black";
			else if(grid[j][k].type == 3)
				str = "green";
			else
				str = "lightblue";
			
			manhattanDistance(grid[j][k]);
			
			context.fillStyle = str;
			context.fillRect((k * (nDim + nBrd)), (j * (nDim + nBrd)), nDim, nDim);
			
			context.font="10px Georgia";
			context.fillStyle = "#ffffff";
			context.fillText(grid[j][k].h,(k * (nDim + nBrd)) + 2, (j * (nDim + nBrd)) + 10);
		}
	}
}

init();
window.addEventListener("keyup", keyListener, false);