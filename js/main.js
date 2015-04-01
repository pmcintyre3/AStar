function node(){
	this.type = 2;
}

function init(){
	
	var c = document.getElementById("gameCanvas");
	var ctx = c.getContext('2d');

	var width = c.width;
	var height = c.height;
	
	var rows = 10;
	var cols = 10;
	
	var nBrd = 5;
	var nDim = (width - ((rows-1) * nBrd)) / rows;
	
	var startX = 1;
	var startY = 1;
	var endX = 8;
	var endY = 7;
	
	var arr = new Array(rows);
	
	for(var g = 0; g < rows; g++)
		arr[g] = new Array(cols);
	
	for(var h = 0; h < rows; h++){
		for(var i = 0; i < cols; i++){
			arr[h][i] = new node();
			
			if(h == startX && i == startY)
				arr[h][i].type = 0;
			else if(h == endX && i == endY)
				arr[h][i].type = 1;
			else
				arr[h][i].type = 2;
			
			console.log("Array pass #2, Type: " + arr[h][i].type);
			
		}
	}
	
	//for(var j = 0; j < rows; j++){
		//for(var k = 0; k < cols; k++){
	for(var j in arr){
		for(var k in arr){
			ctx.rect((j * (nDim + nBrd)), (k * (nDim + nBrd)), nDim, nDim);
			
			var str = "";
			
			if(arr[j][k].type === 0)
				str = "green";
			else if(arr[j][k].type === 1)
				str = "blue";
			else if(arr[j][k].type === 2)
				str = "black";
			else
				str = "pink";
			
			console.log("Array Pass #3, str: " + str);
			
			//var str = "pink"
			ctx.fillStyle = str;
			ctx.fill();
		}
	}
}