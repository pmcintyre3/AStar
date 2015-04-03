// var c;
// var ctx;

// var width;
// var height;

// var rows;
// var cols;

// var nBrd;
// var nDim;

// var startX;
// var startY;
// var endX;
// var endY;

function node(t){
	this.type = t;
}

function game(sx, sy, ex, ey, r, c, nb, nd, cx){
	this.ctx = cx;
	
	this.row = r;
	this.col = c;
	this.startX = sx;
	this.startY = sy;
	this.endX = ex;
	this.endY = ey;
	this.nDim = nd;
	this.nBrd = nb;
	
	var arr = new Array(rows);
	
	for(var g = 0; g < rows; g++)
		arr[g] = new Array(cols);
	
	for(var h = 0; h < rows; h++){
		for(var i = 0; i < cols; i++){
			arr[h][i] = new node();
			
			if(h == startX && i == startY){
				arr[h][i] = new node(0);
				console.log("start node");
			}
			else if(h == endX && i == endY){
				arr[h][i] = new node(1);
				console.log("end node");
			}
			else{
				arr[h][i] = new node(2);
			}
			
			console.log("Array pass #2, Type: " + arr[h][i].type);
			
		}
	}
}

game.prototype.draw(){
	
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


function init(){
	
	var c = document.getElementById("gameCanvas");
	var context = c.getContext('2d');

	var width = c.width;
	var height = c.height;
	
	var rows = 10;
	var cols = 10;
	
	var nBd = 5;
	var nD = (width - ((rows-1) * nBd)) / rows;
	
	var start_X = 1;
	var start_Y = 1;
	var end_X = 8;
	var end_Y = 7;
	
	var A = new game(start_X, start_Y, end_X, end_Y, rows, cols, nBd, nD, context);
	
	var gameloop;
	var fps = 60;
	
	main(gameloop, fps);
	
	// var arr = new Array(rows);
	
	// for(var g = 0; g < rows; g++)
		// arr[g] = new Array(cols);
	
	// for(var h = 0; h < rows; h++){
		// for(var i = 0; i < cols; i++){
			// arr[h][i] = new node();
			
			// if(h == startX && i == startY){
				// arr[h][i] = new node(0);
				// console.log("start node");
			// }
			// else if(h == endX && i == endY){
				// arr[h][i] = new node(1);
				// console.log("end node");
			// }
			// else{
				// arr[h][i] = new node(2);
			// }
			
			// console.log("Array pass #2, Type: " + arr[h][i].type);
			
		// }
	// }
	
	// for(var j = 0; j < rows; j++){
		// for(var k = 0; k < cols; k++){
	// for(var j in arr){
		// for(var k in arr[j]){
			// // ctx.rect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
			
			// var str = "";
			
			// if(arr[j][k].type == 0)
				// str = "blue";
			// else if(arr[j][k].type == 1)
				// str = "red";
			// else
				// str = "black";
			
			// //console.log("Array Pass #3, str: " + str + " and ctx.fillStyle: " + ctx.fillStyle);
			
			// //ctx.rect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
			// ctx.fillStyle = str;
			// ctx.fillRect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
			
			
			
			// // var str = "pink"
			// // ctx.fillStyle = str;
			// // ctx.fill();
		// }
	// }
}

function main(fps, loop){
	if(loop)
		clearInterval(loop);
	
	loop = setInterval(update, 1000/fps);
	
}