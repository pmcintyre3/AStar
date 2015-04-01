//JavaScript A* Implementation

/*
var width;
var height;

var numCols;
var numRows;

var arr = [];

var dist;
var canWalk;
*/

var node = {
	
	parent: null,
	fillColor: null,
	
	nodeColor: 0,
};

var game = {
	
	start: {0, 0},
	end: {0, 0},
	
	board: null,
	onlist: null,
	offlist: null,
	
	ctx: null,
	
	drawList: function() {
		//stuff goes here
	}
	
	
};

var init = function() {
	var c = document.getElementById("gameCanvas");
	var cx = c.getContext("2d");
	
	var width = c.width;
	var height = c.height;
	
	var numCols = 10; //hardcoded for testing
	var numRows = 10; //hardcoded for testing
	
	var gameBoard = [];
	
	var startX = 0;
	var startY = 0;
	
	var endX = 5;
	var endY = 5;
	
	for(var i = 0; i < numCols; i++){
		gameBoard[i] = [];
		for(var j = 0; j < numRows; j++){
			gameBoard[i][j] = new node();
			
			if(i == startX && j == startY)
				gameBoard[i][j].nodeColor = 1;
			else if(i == endX && j == endY)
				gameBoard[i][j].nodeColor = 2;
			else
				gameBoard[i][j].nodeColor = 0;
		}
	}
	var A = new game();
	
	A.board = gameBoard;
	A.ctx = cx;
	A.x = numCols;
	A.y = numRows;
}