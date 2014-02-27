//define some global variables
var title = "My Cool Graph";
var xLabel = "Picoseconds";
var yLabel = "Cheeseburgers Eaten";
var canvasWidth = 500;
var canvasHeight = 500;
var graphWidth = 400;
var graphHeight = 400;
var axesOffset = 50;
var xMax = 400;
var yMax = 400;
var numAxisMarkers = 8;
var pointSize = 4;
var alpha = 0.2;
var showBorder = true;
var showCoords = true;
var showGrid = true;
var showLines = true;
var showPoints = true;
var coords = new Array();
var c = document.getElementById("myCanvas");
var canvOK = 1;

//main
//add some test points
addPoint(300, 175);
addPoint(400, 400);
addPoint(100, 25);
addPoint(200, 75);
addPoint(0, 0);

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

		//draw linear function
		drawLinearFunc(0.333, 100);

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
	ctx.strokeStyle = "000000";
	ctx.beginPath();
	ctx.moveTo(axesOffset, canvasHeight - axesOffset - (y0 * yRatio));
	if (slope > 0){
		var x1 = (yMax - y0) / slope;
		var y1 = (xMax * slope) + y0;
		if (x1 * xRatio <= xMax){
			ctx.lineTo(axesOffset + (x1 * xRatio), axesOffset);
		} else {
			ctx.lineTo(canvasWidth - axesOffset, canvasHeight - axesOffset - (y1 * yRatio));
		}
	} else {
		var x1 = -y0 / slope;
		var y1 = (xMax * slope) + y0;
		if (x1 * xRatio <= xMax * xRatio){
			ctx.lineTo(axesOffset + (x1 * xRatio), canvasHeight - axesOffset);
		} else {
			printMSG(y1 * yRatio);
			ctx.lineTo(canvasWidth - axesOffset, canvasHeight - axesOffset - (y1 * yRatio));
		}
	}
	ctx.stroke();
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
	var msg = "";
	for (var i = 0; i < coords.length; i++) {
		msg = msg.concat("(", + coords[i][0] + "," + coords[i][1] + ")\n");
	}
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