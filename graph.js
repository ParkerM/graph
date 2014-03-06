//define some global variables
var title = "My Cool Graph";
var xLabel = "X Axis Label";
var yLabel = "Y Axis Label";
var canvasWidth = 500;
var canvasHeight = 500;
var axesOffset = 50;
var graphWidth = canvasWidth - (2 * axesOffset);
var graphHeight = canvasHeight - (2 * axesOffset);
var xMax = 15;
var xMin = 0;
var yMax = 15;
var yMin = 0;
var msg = "";
var numAxisMarkers = 15;
var pointSize = 4;
var alpha = 0.2;
var showBorder = true;
var showCoords = true;
var showGrid = true;
var showLines = true;
var showPoints = true;
var linearClicked = false;
var polynomialClicked = false;
var polynomialOrder = 3;
var coords = new Array();
var c = document.getElementById("myCanvas");
var canvOK = 1;

//load a scenario
loadScenario();

//draw the canvas
paintCanvas();

//draws everything to canvas
function paintCanvas() {
	try {c.getContext("2d");}
	catch (er) {canvOK=0;}
	if (canvOK==1) {
		//begin by clearing canvas
		var ctx = c.getContext("2d");
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		
		//set canvas attributes
		c.setAttribute("width", canvasWidth);
		c.setAttribute("height", canvasHeight);
		
		//create blank canvas
		var ctx=c.getContext("2d");
		ctx.fillStyle="#FFFFFF";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);	
		
		//draw each point
		replot();
		
		//draw graph elements
		drawBorder();
		drawAxes();	
		drawLabels();
		drawLines();

		linearClicked = false;
		polynomialClicked = false;
	}
}

//load a random scenario from a predefined group
function loadScenario() {
	//load a set of points and define axes
	var scenario = parseInt(Math.random()*2);
	switch (scenario) {
		case 0:
		 	xMax = 15;
	 		yMax = 15;
	 		numAxisMarkers = 15
			addPoint(1, 9);
			addPoint(3, 2);
			addPoint(5, 6);
			addPoint(6, 1);
			addPoint(9, 4);
			addPoint(12, 8);
			break;
		case 1:
			xMax = 400;
			yMax = 400;
			numAxisMarkers = 8;
			addPoint(300, 175);
			addPoint(375, 250);
			addPoint(100, 25);
			addPoint(209, 75);
			addPoint(0, 0);
			addPoint(200, 100);
			addPoint(50, 150);
			addPoint(123, 69);
			addPoint(340, 222);
			break;
	}
}

//comparator for sorting coordinates
function compare(a, b) {
	return a[0] - b[0];
}

//draw the x and y axes
function drawAxes() {
	//draw axes
	var ctx = c.getContext("2d");
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(axesOffset, axesOffset);
	ctx.lineTo(axesOffset, canvasHeight - axesOffset);
	ctx.lineTo(canvasWidth - axesOffset, canvasHeight - axesOffset);
	ctx.strokeStyle = "000000";
	ctx.stroke();
	
	//draw interval markers
	var markLength = 5;
	xInterval = xMax / numAxisMarkers;
	yInterval = yMax / numAxisMarkers;
	ctx.font = "12px Courier";
	ctx.fillStyle = "000000";
	
	//x axis interval markers
	for (var i = 1; i < numAxisMarkers + 1; i++) {
		ctx.beginPath();
		ctx.moveTo(axesOffset + (i * graphWidth / numAxisMarkers), canvasHeight - axesOffset);
		ctx.lineTo(axesOffset + (i * graphWidth / numAxisMarkers), canvasHeight - axesOffset - markLength); //5 = marker length
		ctx.stroke();
		ctx.textAlign = "center";
		ctx.fillText(Number((i * xInterval).toFixed(3)), axesOffset + (i * graphWidth / numAxisMarkers), canvasHeight - axesOffset + 12); //12 is text offset
		
		//draw the grid if enabled
		if (showGrid) {
			ctx.save();
			ctx.globalAlpha = alpha;
			ctx.moveTo(axesOffset + (i * graphWidth / numAxisMarkers), canvasHeight - axesOffset);
			ctx.lineTo(axesOffset + (i * graphWidth / numAxisMarkers), canvasHeight - axesOffset - graphWidth);
			ctx.stroke();
			ctx.restore();
		}
	}
	
	//y axis interval markers
	for (var i = 1; i < numAxisMarkers + 1; i++) {
		ctx.beginPath();
		ctx.moveTo(axesOffset, canvasHeight - axesOffset - (i * (graphHeight / numAxisMarkers)));
		ctx.lineTo(axesOffset + markLength, canvasHeight - axesOffset - (i * (graphHeight / numAxisMarkers))); //5 = marker length
		ctx.stroke();
		ctx.textAlign = "right";
		ctx.fillText(Number((i * yInterval).toFixed(3)), axesOffset - 4, canvasHeight - axesOffset - (i * (graphHeight / numAxisMarkers)) + 3); //4 and 3 are text offset
		
		//draw the grid if enabled
		if (showGrid) {
			ctx.save();
			ctx.globalAlpha = alpha;
			ctx.moveTo(axesOffset, canvasHeight - axesOffset - (i * (graphHeight / numAxisMarkers)));
			ctx.lineTo(axesOffset + graphHeight, canvasHeight - axesOffset - (i * (graphHeight / numAxisMarkers)));
			ctx.stroke();
			ctx.restore();
		}
	}
	//draw "0" at origin
	ctx.fillText("0", axesOffset - 4, canvasHeight - axesOffset + 4);
}	

//draw a border
function drawBorder() {
	if (showBorder) {
		//simply draw a line around the edge of the canvas
		//may change to rect if needed
		var ctx = c.getContext("2d");
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(canvasWidth, 0);
		ctx.lineTo(canvasWidth, canvasHeight);
		ctx.lineTo(0, canvasHeight);
		ctx.lineTo(0, 1);
		ctx.stroke();
	}
}

//draw the title and the axis labels
function drawLabels() {
	var ctx = c.getContext("2d");
	ctx.font = "12px Courier";
	ctx.fillStyle = "000000";
	ctx.textAlign = "center";
	ctx.fillText(title, canvasWidth / 2, 25); //title
	ctx.fillText(xLabel, canvasWidth / 2, canvasHeight - 15); //x-axis label
	
	//the canvas must be rotated to draw vertical text
	ctx.save();			//save canvas position so it can be restored
	ctx.font = "14px Courier";
	ctx.translate(15, canvasHeight / 2); //move canvas in position
	ctx.rotate(Math.PI * 1.5); //rotate canvas
	ctx.fillText(yLabel, 0, 0);
	ctx.restore();		//restore canvas
}

//draw a line given slope and initial y value
function drawLinearFunc(slope, y0) {
	//ratios for line to move as axes change
	var xRatio = graphWidth / xMax;
	var yRatio = graphHeight / yMax;
	var ctx = c.getContext("2d");
	ctx.lineWidth = 2;
	ctx.strokeStyle = document.getElementById("linearColor").value;
	ctx.beginPath();
	
	//calculate beginning point
	if (slope >= 0) {
		var xIntercept = 0;
		if (y0 >= 0) {
			ctx.moveTo(axesOffset, canvasHeight - axesOffset - (y0 * yRatio));
		} else {
			ctx.moveTo(axesOffset - yRatio * (y0 / slope), canvasHeight - axesOffset);
		}
	} else {
		if (y0 >= yMax) {
			ctx.moveTo(axesOffset + yRatio * ((yMax - y0) / slope), axesOffset);
		} else {
			ctx.moveTo(axesOffset, canvasHeight - axesOffset - (y0 * yRatio));
		}
	}
	//calculate end point
	if (slope >= 0){
		var x1 = (yMax - y0) / slope;
		var y1 = (xMax * slope) + y0;
		if (x1 <= xMax){
			ctx.lineTo(axesOffset + (x1 * xRatio), axesOffset);
		} else {
			ctx.lineTo(canvasWidth - axesOffset, canvasHeight - axesOffset - (y1 * yRatio));
		}
	} else {
		var x1 = -y0 / slope;
		var y1 = (xMax * slope) + y0;
		if (x1 <= xMax){
			ctx.lineTo(axesOffset + (x1 * xRatio), canvasHeight - axesOffset);
		} else {
			ctx.lineTo(canvasWidth - axesOffset, canvasHeight - axesOffset - (y1 * yRatio));
		}
	}
	ctx.stroke();

	//print function to textarea
	msg += "f(x) = " + slope + "x + " + y0 + "\n\n";
	printMSG(msg);
}

//draw a polynomial given an array of coefficients
function drawPolynomial(X) {
	var xRatio = graphWidth / xMax;
	var yRatio = graphHeight / yMax;
	var n = X.length;
	var precision = 10000;
	var fX = 0;
	var ctx = c.getContext("2d");
	var strokeOn = true;
	ctx.lineWidth = 1;
	ctx.strokeStyle = document.getElementById("polynomialColor").value;
	ctx.beginPath(axesOffset, canvasHeight - axesOffset - (X[n-1] * yRatio));
	for (var i = 0; i <= precision; i++) {
		xVar = (i * (graphWidth / precision) / (xRatio));
		fX = 0;
		for (var j = 0; j < n; j++) {
			fX += X[j] * Math.pow(xVar, (n - 1) - j);
		}
		//skip drawing if yMax < f(x) < 0
		if ((fX > yMax) || (fX < yMin)) {
			if (strokeOn) {
				ctx.stroke();
				strokeOn = false;
			} else {
				ctx.moveTo(axesOffset + (i * (graphWidth / precision)), canvasHeight - axesOffset - (yRatio * fX));
			}
		} else {
			strokeOn = true;
			ctx.lineTo(axesOffset + (i * (graphWidth / precision)), canvasHeight - axesOffset - (yRatio * fX));
		}

	}
	ctx.stroke();

	//print function to textarea
	if (polynomialOrder < coords.length){
		msg += "f(x) = ";
		for (var i = 0; i < polynomialOrder - 1; i++) {
			msg += X[i].toPrecision(6) + "x^" + (X.length - i - 1) + " + ";
		}
		msg += X[X.length - 2].toPrecision(6) + "x + " + X[X.length - 1].toPrecision(6) + "\n\n";
	} else {
		msg += "Error: n must be less than # points\n\n";
	}
	printMSG(msg);
}

//draw a line connecting each plotted point
function drawLines() {
	if (showLines) {
		//ratios for line to move as axes change
		var xRatio = graphWidth / xMax;
		var yRatio = graphHeight / yMax;
		var ctx = c.getContext("2d");
		ctx.strokeStyle = "000000";
		ctx.beginPath();
		ctx.moveTo(axesOffset + (xRatio * coords[0][0]), canvasHeight - axesOffset - (yRatio * coords[0][1]));
		for (var i = 1; i < coords.length; i++){
			ctx.lineTo(axesOffset + (xRatio * coords[i][0]), canvasHeight - axesOffset - (yRatio * coords[i][1]));
		}
		ctx.stroke();
	}
}	

//perform a simple linear regression on the current points
function linearRegression() {
	if(!linearClicked){
		var slope;
		var y0;
		var n = coords.length;

		//intialize sum variables
		var x = 0;
		var y = 0;
		var xy = 0;
		var xSquared = 0;
		var ySquared = 0;

		//calculate sums
		for (var i = 0; i < n; i++){
			x += coords [i][0];
			y += coords [i][1];
			xy += coords[i][0] * coords[i][1];
			xSquared += coords[i][0] * coords[i][0];
			ySquared += coords[i][1] * coords[i][i];
		}

		//calculate slope
		slope = ((n * xy) - (x * y)) / ((n * xSquared) - (x * x));

		//calculate y0
		y0 = ((y * xSquared) - (x * xy)) / ((n * xSquared) - (x * x));

		//draw the function
		drawLinearFunc(slope, y0);

		linearClicked = true;
	} else {
		paintCanvas();
	}
}

//perform a polynomial regression on the current points
function polynomialRegression() {
	//we will solve the linear system [A]t [A] [X] = [A]t [B]
	if (!polynomialClicked) {
	polynomialOrder = parseInt(document.getElementById("polyOrder").value);
	var precision = polynomialOrder + 1;
	var n = coords.length;
	var A = new Array(n);  //2D
	var B = new Array(n);  //1D
	var AtA = new Array(precision); //A transpose A 3x3
	var AtAi = new Array(precision); //inverse of A transpose A
	var AtB = new Array(precision); //A transpose B

	//initialize A
	for (var i = 0; i < n; i++) {
		A[i] = new Array(precision);
	}

	//create A
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < precision; j++) {
			A[i][j] = Math.pow(coords[i][0], precision - j - 1);
		}
	}

	//create B
	for (var i = 0; i < n; i++) {
		B[i] = coords[i][1];
	}

	//initialize and zero AtA
	for (var i = 0; i < precision; i++) {
		AtA[i] = new Array(precision);
		for (var j = 0; j < precision; j++) {
			AtA[i][j] = 0;
		}
	}

	//create A transpose A
	for (var i = 0; i < precision; i++) {
		for (var j = 0; j < precision; j++) {
			for (var k = 0; k < n; k++) {
				AtA[i][j] += A[k][i] * A[k][j];
			}
		}
	}

	//initialize and zero AtB
	for(var i = 0; i < n; i++) {
		AtB[i] = 0;
	}

	//create AtB
	for (var i = 0; i < precision; i++) {
		for (var j = 0; j < n; j++) {
			AtB[i] += A[j][i] * B[j];
		}
	}

	//gaussian elimination. adapted from rosettacode.org
	var max, temp, i, j, col;		
	n = AtA.length; //reassign n to length of AtA
	var X = new Array(n);
	for (col = 0; col < n; col++) {
		j = col;
		max = AtA[j][j];
		for (i = col + 1; i < n; i++) {
			temp = Math.abs(AtA[i][col]);
			if (temp > max){
				j = i; 
				max = temp;
			}
		}
		AtA = swapRow2D(AtA, col, j);
		AtB = swapRow1D(AtB, col, j);
		for (i = col + 1; i < n; i++) {
			temp = AtA[i][col] / AtA[col][col];
			for (j = col + 1; j < n; j++) {
				AtA[i][j] -= temp * AtA[col][j];
			}
			AtA[i][col] = 0;
			AtB[i] -= temp * AtB[col];
		}
	}
	for (col = n - 1; col >= 0; col--) {
		temp = AtB[col];
		for (j = n - 1; j > col; j--) {
			temp -= X[j] * AtA[col][j];
		}
		X[col] = temp / AtA[col][col];
	}

	drawPolynomial(X);

	polynomialClicked = true;
	} else {
		paintCanvas();
	}

}

//swap rows of a 1D array
function swapRow1D(A, row1, row2) {
	var temp = A[row1];
	A[row1] = A[row2];
	A[row2] = temp;
	return A;
}

//swap rows of an n*n 2D array
function swapRow2D(A, row1, row2) {
	tempArray = new Array(A.length);
	for (var i = 0; i < A.length; i++) {
		tempArray[i] = A[row1][i];
		A[row1][i] = A[row2][i];
		A[row2][i] = tempArray[i];
	}
	return A;
}

//export the canvas to a png image
function exportToPNG() {
	var img = c.toDataURL("image/png");
	window.open(img);
}

//save a point's location in the coords[][] array
function addPoint(x, y) {
	coords.push([x, y]);
	paintCanvas();
}
	
//plot point from form input
function addPointFromInput() {
	var x = parseFloat(document.getElementById("xCoord").value);
	var y = parseFloat(document.getElementById("yCoord").value);
	addPoint(x, y);
}	

//redraw all points
function replot() {
	var ctx = c.getContext("2d");
	ctx.fillStyle = "000000";
	ctx.font = "12px Courier";
	ctx.textAlign = "left";
	
	//sort coordinates by ascending x values
	coords.sort(compare); 
	
	//print coords to text box
	msg = "";
	for (var i = 0; i < coords.length; i++) {
		msg = msg.concat("(", + coords[i][0] + "," + coords[i][1] + ")\n");
	}
	msg += "\n";

	printMSG(msg);
	
	//ratios for points to move as axes change
	var xRatio = graphWidth / xMax;
	var yRatio = graphHeight / yMax;
	
	//draw points
	for (var i = 0; i < coords.length; i++) {
		if (showPoints) {
			ctx.fillRect(axesOffset + (xRatio * coords[i][0]) - pointSize/2, 
					 canvasHeight - axesOffset - (yRatio * coords[i][1]) - pointSize/2,
   					 pointSize, pointSize);
		}
		if (showCoords) {
			ctx.fillText("(" + coords[i][0] + ", " + coords[i][1] + ")", (xRatio * coords[i][0]) + axesOffset + pointSize/2, canvasHeight - axesOffset - (yRatio * coords[i][1]) + pointSize/2);
		}
	}
}

//redraw axes
function redrawAxes() {
	xMax = parseFloat(document.getElementById("xAxisLength").value);
	yMax = parseFloat(document.getElementById("yAxisLength").value);
	numAxisMarkers = parseInt(document.getElementById("numMarkers").value);
	paintCanvas();
}

//set labels
function setLabels() {
	title = document.getElementById("titleText").value;
	xLabel = document.getElementById("xAxisText").value;
	yLabel = document.getElementById("yAxisText").value;
	paintCanvas();
}

//set options
function setOptions() {
	showBorder = document.getElementById("borderBox").checked;
	showCoords = document.getElementById("coordBox").checked;
	showGrid = document.getElementById("gridBox").checked;
	showLines = document.getElementById("lineBox").checked;
	showPoints = document.getElementById("pointBox").checked;
	paintCanvas();
}

//reset coordinates and canvas
function reset() {
	coords = new Array();
	title = "";
	xLabel = "";
	yLabel = "";
	paintCanvas();
}

//erase console and print new message
function printMSG(msg) {
	document.getElementById("console").value = "";
	document.getElementById("console").value = document.getElementById("console").value + msg + "\n";
}