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

var isDone = false;


var mx, my;

window.addEventListener("keydown", keyFunc, false);

document.onmousemove = function(e){
	mouseX = e.pageX - (window.innerWidth - width) / 2;
	mouseY = e.pageY - (window.innerHeight - height) / 2;
	
	//console.log("mousex: " + mouseX + ", mousey: " + mouseY);
};


document.onmousedown = function(e){
	
	var mouseCol = Math.floor(mouseX / (nDim + nBrd));
	var mouseRow = Math.floor(mouseY / (nDim + nBrd));
	
	console.log("mouseCol: " + mouseCol + ", mouseRow: " + mouseRow);
	
	if(!e)
		e = window.event;
	
	var block = grid[mouseRow][mouseCol];
	
	// if(!block.path){
		if(block.isStart){
			block.isStart = false;
			block.isObs = false;
			startExist = false;
			
			if(endExist){
				block.isEnd = false;
			}
			else{
				block.isEnd = true;
				endX = block.x;
				endY = block.y;
			}
		}
		else if(block.isEnd){
			block.isEnd = false;
			block.isObs = false;
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
					
					endX = block.x;
					endY = block.y;
					endExist = true;
				}
				else{
					block.isStart = true;
					block.isEnd = false;
					block.isObs = false;
					
					startX = block.x;
					startY = block.y;
					startExist = true;
				}
			}
		}
	// }
}

// function getClickPosition(e) {
    // var parentPosition = getPosition(e.currentTarget);
    // var mx = e.clientX - parentPosition.x;
    // var my = e.clientY - parentPosition.y;
	
	// return {x: xPosition, y: yPosition};
// }
 
// function getPosition(element) {
    // var xPosition = 0;
    // var yPosition = 0;
      
    // while (element) {
        // xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        // yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        // element = element.offsetParent;
    // }
    // return { x: xPosition, y: yPosition };
// }

// HTMLCanvasElement.prototype.getMouse = function(e) {
  // var element = this, offsetX = 0, offsetY = 0, mx, my;

  // if (element.offsetParent !== undefined) {
    // do {
      // offsetX += element.offsetLeft;
      // offsetY += element.offsetTop;
    // } while ((element = element.offsetParent));
  // }

  // offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  // offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  // mx = e.pageX - offsetX;
  // my = e.pageY - offsetY;

  // console.log("mx: " + mx + ", my: " + my);
  
  // return {x: mx, y: my};
// }

// canvas.addEventListener("mousedown", getPosition, false);

// function getPosition(event)
// {
  // var mx = event.x;
  // var my = event.y;

  // console.log(event.x);
  
  // // var canvas = document.getElementById("canvas");

  // mx -= canvas.offsetLeft;
  // my -= canvas.offsetTop;

  // console.log("mx: " + mx + ", my: " + my);
  
  // return {x: mx, y: my};
// }

function keyFunc(e){
	switch(e.keycode){
		case 32:
		if(!isDone)
			A_star();
		else
			init();
		isDone = !isDone;
		break;
	}
}

node = function(){
	this.isStart = false;
	this.isEnd = false;
	this.isObs = false;
	
	this.x;
	this.y;
	
	this.parent;
	this.path = false;
	
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
	
	var closedset = new Array();
	var openset = new Array();
	
	openset.push(start);
	
	while(openset.length > 0){
		var current;
		var min;
		var minIndex;
		
		for(var i = 0; i < openset.length; i++){
			if(i == 0){
				min = openset[0].f;
				minIndex = 0;
			}
			else{
				if(openset[i].f < min){
					min = openset[i].f;
					minIndex = i;
				}
			}
		}
		
		current = openset[i];
		openset.splice(myIndex, 1);
		closedset.push(current);
		
		if(current.isEnd)
			return followPath(visited, end);
		
		var neighbors = findNeighbors(current);
		
		for(var j = 0; j < neighbors.length; j++){
			if(closedset.indexOf(neighbor[j]) < 0){
				continue;
			}
			
			var temp_g;
			
			if(current.x == neighbor[j].x || current.y == neighbor[j].y){
				temp_g = current.g + 10;
			}
			else{
				temp_g = current.g + 14;
			}
			
			if(openset.indexOf(neighbor[j]) < 0 || temp_g < neighbor[j].g){
				neighbor[j].parent = current;
				neighbor[j].g = temp_g;
				neighbor[j].f = neighbor[j].g + manhattanDistance(neighbor[j]);
				
				if(openset.indexOf(neighbor[j]) < 0){
					openset.push(neighbor[j]);
				}
			}
		}
	}
}

function init(){
	rows = 10;
	cols = 10;

	startX = 1;
	startY = 2;
	
	endX = 8;
	endY = 8;
	
	nBrd = 1;
	nDim =(width - ((rows - 1) * nBrd)) / rows;
	
	grid = new Array();
	
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
				startExist = true;
			}
			else if(i == endY && j == endX){
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
			
			grid[i][j] = t;
		}
	}
	
	draw();
}

function draw(){
	for(var i = 0; i < rows; i++){
		for(var j = 0; j < cols; j++){
			var block = grid[i][j];
			var str = "";
			
			if(block.path == false){
				if(block.Obs)
					str = "green";
				else if(block.isStart)
					str = "blue";
				else if(block.isEnd)
					str = "red";
				else
					str = "black";
			}
			else{
				if(block.isStart)
					str = "blue";
				else if(block.isEnd)
					str = "red";
				else
					str = "yellow";
			}
			
			context.fillStyle = str;
			context.fillRect(i * (nDim + nBrd), j * (nDim + nBrd), nDim, nDim);
		}
	}
}

init();