var dataset;
var svgSpace;
var riverData = [];
var curRiverNum = 0;            // beginning with the first river
const svgSpace1 = '#section1';
const svgSpace2 = '#section2';
const svgSpace3 = '#section3';
const w_FullSize = 1920; // max width for my monitor

//const w_FullSize = 1860;   // working width is w_Sec1 + w_Sec2
const h_FullSize = 790;    //
const w_Sec1 = 1500;  //Top left section
const h_Sec1 = 350;
//const w_Sec2 = 800;  //Right section
const w_Sec2 = w_FullSize - 400;
const h_Sec2 = 250;

const w_Sec3 = w_FullSize - 400;
const h_Sec3 = 250;
const w_Sec4 = 200;  //Right section
const h_Sec4 = 250;


//var colors10=["Black","Blue","Purple","DarkGray","Green","Cyan","Magenta","DarkOrange","Red","Gold"];
var colors10 = ["Indigo", "Blue", "Purple", "Brown", "Green", "Cyan", "Magenta", "DarkOrange", "Red", "Gold"];
var lcolor, lcolor_saturation, lclass, lticks, lticks_x = 300, xStart_save = 0, xEnd_save = 100;
var acolor, acolor_saturation, aclass;

const extremaRiffle = -1; //
const extremaPool = -2;   //



var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
var margin = { top: 20, right: 20, bottom: 30, left: 35 };

var svg_line, svg_note;
var svg_lineArray = [];     // State lines
var secNoteSpaceActive = 1;
var svg_lineNum = 0;
var svg_lineNum2 = 0;       // Special lines, e.g. U.S.A.
var svg_lineMode = "add";   //add or subtract lines

var w_Sec;
var h_Sec;

// for resizing section 2
var w_ScaleDown = 1;
if (x < w_FullSize) {
    w_ScaleDown = (x / w_FullSize);
}





//var myButton0 = document.querySelector("#button0");
//var myButton1 = document.querySelector("#button1");
//var myButton20 = document.querySelector("#button20");
var myButton101 = document.querySelector("#button101");
var myButton102 = document.querySelector("#button102");
var myButton103 = document.querySelector("#button103");
//var myButtonClose = document.querySelector("#buttonClose");
var myDataList = document.querySelector("#dataList");
var myDataList2 = document.querySelector("#dataList2");
//
//  var sec1Heading = document.querySelector('#explain1');
//  var sec1Directions = document.querySelector('#directions1');
var sec2Heading = document.querySelector('#explain2');
var sec2Directions = document.querySelector('#directions2');
var sec3Heading = document.querySelector('#explain3');
var sec3Directions = document.querySelector('#directions3');
var sec4Heading = document.querySelector('#explain4');
var sec4Directions = document.querySelector('#directions4');

var myParagraph = document.querySelector("#explain1");
const lineChart_id = 2;
var sec_apps = [1, 3, 2, 0];   // for indicating what app is running in what section.  The default now is section 0, app 1, section 1,app 2 section 2, app 3

myButton101.onclick = function () {


    AnalyzeRiver();

}

myButton102.onclick = function () {

var  xStart = Math.max(xStart_save-lticks_x, 0);
var  xEnd = Math.min((xStart+lticks_x), riverData[curRiverNum].z_interp.length);
    console.log("xStart=" + xStart + ", xEnd=" + xEnd)
  if (xEnd===riverData[curRiverNum].z_interp.length) {
      xStart = Math.max(xEnd-lticks_x, 0);
  }

riverSection = ((xStart) + " meters to " + xEnd + " meters");
myDataList2.value = riverSection;

drawRiverSection(2, xStart, xEnd);
louisDraw(riverData[curRiverNum]);

}



myButton103.onclick = function () {

var xEnd = Math.min((xEnd_save+lticks_x), riverData[curRiverNum].z_interp.length)
var xStart = Math.max(xEnd-lticks_x, 0);
    console.log("xStart=" + xStart + ", xEnd=" + xEnd)
riverSection = ((xStart) + " meters to " + xEnd + " meters");
myDataList2.value = riverSection;

drawRiverSection(2, xStart, xEnd);
louisDraw(riverData[curRiverNum]);


}




myDataList.onclick = function () {

    var newData = myDataList.value;
    var selectionNum = myDataList.selectedIndex;

    if (selectionNum != curRiverNum) {

        curRiverNum = selectionNum;
        //console.log("list 1 = " + newData + ", curRiverNum = " + curRiverNum);

        // maintain river section selection list; fill it with data for this list
        list2Empty();
        secTextUpdate(4, "", "");   // clear header for notes section

        var riverSection = "";
        for (var i = 0; i < riverData[curRiverNum].z_interp.length; i += lticks_x) {
            riverSection = ((i) + " meters to " + Math.min((i + lticks_x), riverData[curRiverNum].z_interp.length) + " meters");
            addDataToList2(riverSection)
        }
        // Initialize to the beginning of the river
        var xStart = 0, xEnd = lticks_x;
        riverSection = ((xStart) + " meters to " + xEnd + " meters");
        myDataList2.value = riverSection;

        drawRiverSection(2, xStart, xEnd);
        louisDraw(riverData[curRiverNum]);

        //drawRiver(3, 0, riverData[curRiverNum].z_interp.length-1);


    }

}

myDataList2.onclick = function () {
    //var state_name1=myStateList.value;

    var newData = myDataList2.value;
    var num = myDataList2.selectedIndex;
    //console.log("list 2 = " + newData + ", selectedIndex = " + num);

    if (num != -1) {
        // Initialize to the beginning of the river
        var xStart = num * lticks_x, xEnd = Math.min((num * lticks_x + lticks_x), riverData[curRiverNum].z_interp.length);
        riverSection = ((xStart) + " meters to " + xEnd + " meters");
        //myDataList2.value = riverSection;

        drawRiverSection(2, xStart, xEnd);
        louisDraw(riverData[curRiverNum]);
        //drawRiver(3, 0, riverData[curRiverNum].z_interp.length-1);

    }

}



window.addEventListener('resize', refreshGraph);

function refreshGraph() {
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    if (x < w_FullSize) {
        w_ScaleDown = (x / w_FullSize);
    }
    else {
        w_ScaleDown = 1;
    }


    if (w_ScaleDown < .68) {
        secNoteSpaceActive = 0;
    }

    drawRiverSection(2, xStart_save, xEnd_save);
    louisDraw(riverData[curRiverNum]);
    //drawRiver(3, 0, riverData[curRiverNum].z_interp.length-1);


}


LoadData();  // Loads all of our application data





function LoadData() {


    d3.queue()
        .defer(d3.json, "./R0.json")
        .defer(d3.json, "./R1.json")
        .defer(d3.json, "./R2.json")
        .defer(d3.json, "./R3.json")
        .defer(d3.json, "./R4.json")
        .defer(d3.json, "./R5.json")
        .defer(d3.json, "./R6.json")
        .defer(d3.json, "./R10.json")
        .defer(d3.json, "./R11.json")
        .defer(d3.json, "./R12.json")
        .defer(d3.json, "./R13.json")
        .defer(d3.json, "./R14.json")
        .defer(d3.json, "./R16.json")
        .defer(d3.json, "./R18.json")
        //.defer(d3.json, "./us.json")
        .awaitAll(ready);


}        // End main data load routine



function ready(error, results) {
    //console.log("Error: " + error);
    //console.log(results);
    if (error) throw error;


    //console.log(results);

    for (var i = 0; i < results.length; i++) {

        riverData.push({
            dh_dx: [],
            dhdx_less_dzdx: [],
            dz_dx: [],
            name: "",
            wse_interp: [],
            x_interp: [],
            z_interp: [],
            x_cardinal_interp: [],
            z_cardinal_interp: [],
            x_basis_interp: [],
            z_basis_interp: [],
            waterDepth: [],
            rifflesAndPools: [],
            e: [],          // Change in elevation (b(i) - b(i+1)
            E: [],          // Change in elevation (b(i) - b(i+1)
            xBar: 0,       // Median change in elevation
            SD: 0,          // Standard deviation
            riverAnalyzed: 0, // boolean indicating calcs have already been done.
            minRBE: 0,
            maxRBE: 0,
            minDepth: 0,
            maxDepth: 0,
            maxWSE: 0
        });
        riverData[i].dh_dx = results[i].dh_dx;
        riverData[i].dhdx_less_dzdx = results[i].dhdx_less_dzdx;
        riverData[i].dz_dx = results[i].dz_dx;
        riverData[i].name = results[i].name;
        riverData[i].wse_interp = results[i].wse_interp;
        riverData[i].x_cardinal_interp = results[i].x_cardinal_interp;
        riverData[i].z_cardinal_interp = results[i].z_cardinal_interp;
        riverData[i].x_basis_interp = results[i].x_basis_interp;
        riverData[i].z_basis_interp = results[i].z_basis_interp;
        riverData[i].x_interp = results[i].x_interp;
        riverData[i].z_interp = results[i].z_interp;

        addDataToList(riverData[i].name)

        var minValue = riverData[i].z_interp[0], maxValue = 0, minDepth = riverData[i].z_interp[0], maxDepth = 0, maxWSE = 0, jDum = 0, EndOfRiver = riverData[i].z_interp.length;
        for (var j = 0; j < EndOfRiver; j++) {
            jDum = (j === EndOfRiver - 1) ? j : j + 1;
            riverData[i].waterDepth.push(riverData[i].wse_interp[j] - riverData[i].z_interp[j]);
            riverData[i].e.push(riverData[i].z_interp[j] - riverData[i].z_interp[jDum]);
            riverData[i].xBar += riverData[i].e[j];

            if (riverData[i].waterDepth[j] < minDepth) {
                minDepth = riverData[i].waterDepth[j];
            }

            if (riverData[i].waterDepth[j] > maxDepth) {
                maxDepth = riverData[i].waterDepth[j];
            }

            if (riverData[i].z_interp[j] < minValue) {
                minValue = riverData[i].z_interp[j];
            }

            if (riverData[i].z_interp[j] > maxValue) {
                maxValue = riverData[i].z_interp[j];
            }

            if (riverData[i].wse_interp[j] > maxWSE) {
                maxWSE = riverData[i].wse_interp[j];
            }

            //console.log("e[j]=" + riverData[i].e[j] + ", xBar" + riverData[i].xBar);
        }
        riverData[i].minDepth = minDepth;
        riverData[i].maxDepth = maxDepth;
        riverData[i].minRBE = minValue;
        riverData[i].maxRBE = maxValue;
        riverData[i].maxWSE = maxWSE;
        //console.log("EndOfRiver=" + EndOfRiver + ", xBar" + riverData[i].xBar);

        riverData[i].xBar /= EndOfRiver;   // Median change in elevation

        //console.log("xBar" + riverData[i].xBar);
    }

    var riverSection = "", xStart = 0, xEnd = lticks_x;
    for (var i = 0; i < riverData[curRiverNum].z_interp.length; i += lticks_x) {

        riverSection = ((i) + " meters to " + Math.min((i + lticks_x), riverData[curRiverNum].z_interp.length) + " meters");
        addDataToList2(riverSection)
    }

    drawRiverSection(2, xStart, xEnd);


    louisDraw(riverData[curRiverNum]);

    //drawRiver(3, 0, riverData[curRiverNum].z_interp.length-1);

    //drawRiverNavigation(3, xStart, xEnd);

}


function list2Empty() {
    var sel = document.getElementById("dataList2");
    var numElements = sel.length;

    //console.log("list2Empty: numElements=" + numElements);

    for (var i = numElements; i > 0; i--) {
        //console.log("list2Empty: removing element=" + i);
        sel.remove(i - 1);
    }
}


function addDataToList(inOption) {
    var sel = document.getElementById("dataList");
    var opt = document.createElement("option");
    opt.value = inOption;
    opt.text = inOption;

    sel.add(opt, null);

}

function addDataToList2(inOption) {
    var sel = document.getElementById("dataList2");
    var opt = document.createElement("option");
    opt.value = inOption;
    opt.text = inOption;

    sel.add(opt, null);

}





function drawRifflesAndPools(inSpace, lineRec, y_min, y_max, rifAndPoColors) {

    // Which svg space are we using?
    svgSpace_set(inSpace, lineChart_id);

    var margin = { top: 20, right: 20, bottom: 40, left: 30 };
    var width = w_Sec - margin.right - margin.left;
    var height = h_Sec - margin.top - margin.bottom;

    var svg = svg_line;
    var tickPadding = 8;




    var line = d3.line()
        .x(function (d) { if (!isNaN(d.x)) { return x(d.x); } })
        .y(function (d) { if (!isNaN(d.x)) { return y(d.y); } });

    var x = d3.scaleLinear().domain(d3.extent(lineRec, function (d) { return d.x; })).range([0, width]);

    var y = d3.scaleLinear().range([height, 0]).domain([y_min, y_max])


    svg.append("linearGradient")
        .attr("id", "temperature-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", x(lineRec[0].x)).attr("y1", height)
        .attr("x2", x(lineRec[lineRec.length-1].x)).attr("y2", height)
        .selectAll("stop")
        .data(rifAndPoColors)
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });


    svg.append("path")
        .datum(lineRec)
        .attr("class", lclass)
        .attr("d", line)
        .attr("transform", "translate(" + tickPadding + ",0)")
        .style("opacity", lcolor_saturation);

    return 1;
}






function drawRiverSection(inSpace, xStart, xEnd) {

    var maxValue = 0, minValue = riverData[curRiverNum].wse_interp[xStart], maxDepth = 0, minDepth = Math.round(riverData[curRiverNum].waterDepth[xStart] * 100) / 100;
    var lineRec = [], minDepthIndex = 0, maxDepthIndex = 0;
    var varHeading = "", varDirections = "";

    var margin = {top: 20, right: 20, bottom: 20, left: 30};
    var width = w_Sec - margin.right - margin.left;
    var height = h_Sec - margin.top - margin.bottom;

    xStart_save = xStart, xEnd_save = xEnd;

    lticks = 15;   // breaking the y-scale up into ltick increments

    var ticks = Math.min(xEnd - xStart, riverData[curRiverNum].z_interp.length);


    //console.log("xStart=" + xStart + ", xEnd=" + xEnd);

    //var ticks = Math.min(lticks_x, xEnd - xStart)


    for (var i = 0; i < ticks; i++) {

        //console.log("riverData[curRiverNum].wse_interp[i]=" + riverData[curRiverNum].wse_interp[i] + ", riverData[curRiverNum].z_interp[i]" + riverData[curRiverNum].z_interp[i]);

        lineRec.push({x: 0, y: 0, fill: 0});
        lineRec[i].x = parseFloat(riverData[curRiverNum].x_interp[xStart + i]);
        lineRec[i].y = parseFloat(riverData[curRiverNum].z_interp[xStart + i]);
        if (riverData[curRiverNum].wse_interp[xStart + i] > maxValue) {
            maxValue = riverData[curRiverNum].wse_interp[xStart + i];
        }

        if (riverData[curRiverNum].z_interp[xStart + i] < minValue) {
            minValue = riverData[curRiverNum].z_interp[xStart + i];
        }

        if (riverData[curRiverNum].wse_interp[xStart + i] > maxValue) {
            maxValue = riverData[curRiverNum].wse_interp[xStart + i];
        }

        if (riverData[curRiverNum].waterDepth[xStart + i] < minDepth) {
            minDepth = Math.round(riverData[curRiverNum].waterDepth[xStart + i] * 100) / 100;
            minDepthIndex = xStart + i;
        }

        if (riverData[curRiverNum].waterDepth[xStart + i] > maxDepth) {
            maxDepth = Math.round(riverData[curRiverNum].waterDepth[xStart + i] * 100) / 100;
            maxDepthIndex = xStart + i;
        }

    }

    var yScalePadding = (maxValue - minValue) / lticks;
    //minValue=minValue-yScalePadding;
    minValue = riverData[curRiverNum].minRBE - yScalePadding;
    //maxValue=maxValue+yScalePadding;
    maxValue = riverData[curRiverNum].maxWSE + yScalePadding;


    for (var i = 0; i < ticks; i++) {
        lineRec[i].fill = minValue;
    }


    //console.log("minValue, maxValue=" + minValue + ", " + maxValue);

    // make the river bed brown
    lcolor = "DarkRed";
    lcolor_saturation = 1;
    lclass = "line";

    acolor = "DarkRed";
    acolor_saturation = .5;
    aclass = "area";

    //drawLine(inSpace, lineRec, minValue, maxValue, 1, 1, 0, xStart);
    drawLine(inSpace, lineRec, minValue, maxValue, 1, 1, 10, xStart);


    for (var i = 0; i < ticks; i++) {
        lineRec[i].fill = lineRec[i].y;
        lineRec[i].y = parseFloat(riverData[curRiverNum].wse_interp[xStart + i]);
    }

    // and the river water blue
    lcolor = "steelblue";
    lcolor_saturation = 1;
    lclass = "line";

    acolor = "lightsteelblue";
    acolor_saturation = 1;
    aclass = "area";

    //drawLine(inSpace, lineRec, minValue, maxValue, 0, 2, 0, xStart);
    drawLine(inSpace, lineRec, minValue, maxValue, 0, 1, 10, xStart);

    secTextUpdate(inSpace, riverData[curRiverNum].name, "Viewing section " + (xStart + 1) + " to " + (xStart + ticks) + " meters. Deepest water is " + maxDepth + " meters at " + maxDepthIndex + " meters from starting position. Shallowest water is " + minDepth + " meters at " + minDepthIndex + " meters from the starting position.");


    // maintain notes section
    //secTextUpdate(4, "", "");                         // clear header for notes section
    d3.select("#explain5").selectAll("li").remove();  //clear away old notes


    $(".explain_1").empty();  //clear away old notes
    //var state_name1=myStateList.value;


    // draw riffles and pools
    if (riverData[curRiverNum].riverAnalyzed === 1) {

        for (var i = 0; i < ticks; i++) {
            //lineRec[i].fill=lineRec[i].y;
            lineRec[i].y = lineRec[i].fill;  // put the river bed data back in the y field of the array
            lineRec[i].fill = 0;
        }


        var rifAndPoNote = "", extrema, extremaName = "", RifAndPo1=-1, rifAndPo2=0;
        var rifAndPoColors = [], j=0, k=0;
        var jStart = 0, iOffset=0;



        console.log("Checking xStart=" + xStart + ", xEnd=" + xEnd );


        for (var i = 0; i < riverData[curRiverNum].rifflesAndPools.length; i++) {
            extrema = riverData[curRiverNum].rifflesAndPools[i];

            console.log("RiffleAndPool Data, ExName=" + extrema.name + ", i=" + i + ", extrema.Type=" + extrema.Type + ", extrema.start=" + extrema.start + ", extrema.end=" + extrema.end);


            if ( (( xStart >= extrema.start && xStart <= extrema.end) || ( xEnd >= extrema.start && xEnd <= extrema.end)) ||
                ( ( extrema.start >= xStart && extrema.start <= xEnd) || ( extrema.End >= xStart && extrema.end <= xEnd)) ) {

                console.log("We have a Rillfe or a Pool");


                        if (extrema.Type === extremaPool) {
                            extremaName = "Pool";
                            lcolor = "Blue";
                            lcolor_saturation = .4;
                            lclass = "lineDashedBold";
                        }
                        else {
                            extremaName = "Riffle";
                            lcolor = "Orange";
                            lcolor_saturation = .8;
                            lclass = "lineDashedBold";
                        }

                        /*
                         if (k===0){
                         iOffset = 0;
                         rifAndPoColors.push({offset: iOffset.toString() + "%", color: (lcolor==="Blue" ? "Yellow" : "Blue")});
                         }
                         */
                        if (extrema.start >= xStart && extrema.start <= xEnd) {
                            j=extrema.start;
                        }
                        else {
                            j=xStart;
                        }

                        iOffset = Math.round(((j-xStart) / ticks) * 100);
                        rifAndPoColors.push({offset: iOffset.toString() + "%", color: lcolor});


                        if (extrema.end<xEnd) {
                            j=extrema.end;
                        }
                        else {
                            j=xEnd;
                        }

                        iOffset = Math.round(((j-xStart) / ticks) * 100);
                        rifAndPoColors.push({offset: iOffset.toString() + "%", color: lcolor});



                        //jStart=Math.min(j+extrema.lenExtrema, ticks);
                        k = rifAndPoColors.length;

                        //rifAndPoNote = i + ") " + extrema.name + " at " + extrema.location + "m from the starting location, is " + (extrema.lenExtrema) + "m in length, " + extrema.elevation + "m in elevation, and " + extrema.waterDepth + "m below the surface. The len of Entrance is " + extrema.lenEntrance + ", and the length of exit is " + extrema.lenExit + ".";

                        var noteObject = {
                            name: extrema.name,
                            location: extrema.location,
                            lenExtrema: extrema.lenExtrema,
                            elevation: extrema.elevation,
                            waterDepth: extrema.waterDepth,
                            lenEntrance: extrema.lenEntrance,
                            lenExit: extrema.lenExit
                        };
                        secNoteSpace(noteObject, (i+1), "DarkRed", .7);
                        if (RifAndPo1===-1)
                            RifAndPo1=(i+1);
                        RifAndPo2=(i+1);


                        //console.log("We have a " + extrema.name + ", i=" + i + ", offset=" + rifAndPoColors[k - 1].offset + ", color" + rifAndPoColors[k - 1].color + ", extrema.Type=" + extrema.Type);
            }
        }


        //rifAndPoNote = (i + 1) + ") " + extremaName + " at " + extrema.location + "m from the starting location, is " + (extrema.lenExtrema) + "m wide, " + extrema.elevation + "m in elevation, and " + extrema.waterDepth + "m below the surface. The len of Entrance is " + extrema.lenEntrance + ", and the length of exit is " + extrema.lenExit + ".";

        secTextUpdate(4, riverData[curRiverNum].rifflesAndPools.length + " riffles and pools.", "Viewing "+RifAndPo1+ " through " + RifAndPo2 + "." );

        drawRifflesAndPools(inSpace, lineRec, minValue, maxValue, rifAndPoColors);
    }


}







function drawLine(inSpace, lineRec, y_min, y_max, refresh, fillArea, inTicks_x, xStart) {

    // Which svg space are we using?
    svgSpace_set(inSpace, lineChart_id);

    var margin = { top: 20, right: 20, bottom: 40, left: 30 };
    var width = w_Sec - margin.right - margin.left;
    //var width = 840 - margin.right - margin.left;
    var height = h_Sec - margin.top - margin.bottom;

    var svg;
    var tickPadding = 8;

    if (refresh) { // Starting Fresh
        d3.select(svgSpace).select('svg').remove();  //first clear away the old graph

        svg = d3.select(svgSpace).classed('chart', true).append('svg')
            .classed('navigator', true)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")scale(" + (w_ScaleDown) + ", .9)");
    }
    else {
        svg = svg_line;
    }

    var area = d3.area()
        .x(function (d) { return x(d.x); })
        .y0(function (d) { return y(d.fill); })
        .y1(function (d) { return y(d.y); });



    var line = d3.line()
        .x(function (d, i) { return x(d.x); })
        .y(function (d, i) { return y(d.y); });



    if (refresh) { // Starting Fresh


        var numberOfTicks, numberOfDataPoints;
        if (inTicks_x === 0) {
            numberOfTicks = lineRec.length;
            numberOfDataPoints = lineRec.length;

        }
        else {
            numberOfTicks = inTicks_x;
            numberOfDataPoints = lineRec.length;
        }


        //var xScale = d3.scaleLinear().domain([0, numberOfDataPoints]).range([0, width]);
        var xScale = d3.scaleLinear().domain([0 + xStart, numberOfDataPoints + xStart]).range([0, width]);
        var xAxis = d3.axisBottom(xScale)
            .ticks(numberOfTicks)
            .tickPadding([15]);
        //.tickFormat(function(d) { return lineRec[d].substring(2); });   // Dates that are displayed at the bottom of each column


        //.attr("transform", "translate(" + (margin.left - yAxisHorizontalPadding) + ",0)");

        //console.log("In Draw Line: lticks="+ lticks );

        var yScale = d3.scaleLinear().domain([y_min, y_max]).range([height, 0]);
        var yAxis = d3.axisLeft(yScale)
            .ticks(lticks);
        //.tickPadding([1]);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + tickPadding + "," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("transform", "translate(20,5)rotate(60)")
            .attr("dx", "-.08em");
        //.attr("dy", ".45em");


        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + tickPadding + ",0)")
            .call(yAxis);
    }





    var x = d3.scaleLinear().domain(d3.extent(lineRec, function (d) { return d.x; })).range([0, width]);

    var y = d3.scaleLinear().range([height, 0]).domain([y_min, y_max])

    svg.append("path")
        .datum(lineRec)
        .attr("class", lclass)
        .attr("d", line)
        .attr("transform", "translate(" + tickPadding + ",0)")
        .style("stroke", lcolor)
        /*
         .style("stroke", function(d) { var rColor=lcolor;
         if(d.fill===extremaPool)
         {rColor="Blue";}
         else if (d.fill===extremaRiffle)
         {rColor="Gold";}
         console.log("rColor="+rColor);
         return rColor;})*/

        .style("opacity", lcolor_saturation);
    //.on("click", function(x){console.log("clicked on line, year=" + x);});

    if (fillArea != 0) {

        svg.append("path")
            .datum(lineRec)
            .attr("class", aclass)
            .attr("d", area)
            .attr("transform", "translate(" + tickPadding + ",0)")
            .style("fill", acolor)
            .style("opacity", acolor_saturation);
    }

    svg_line = svg;
    return 1;
}








function getNewExtrema() {
    //riffleAndPool={elevation: 0, locRiffle:0, lenRiffleUp:0, lenRiffleDown:0, waterDepthRiffle:0, locPool:0, lenPoolEntrance:0, lenPoolExit:0, waterDepthPool:0};
    //extrema = { elevation: 0, eleRelLastExtrema: 0, waterDepth: 0, location: 0, start: 0, end: 0, lenExtrema: 0, lenEntrance: 0, lenExit: 0, Type: -1 };
    extrema = { name: "", elevation: 0, eleRelToLastMeasure: 0, waterDepth: 0, location: 0, start: 0, end: 0, lenExtrema: 0, lenEntrance: 0, lenExit: 0, Type: -100 };
    return extrema;
}






function AnalyzeRiver() {



    if (riverData[curRiverNum].riverAnalyzed === 1) {
        return
    }

    //Refresh Analyzer Window;
    secTextUpdate(4, "", "");                         // clear header
    d3.select("#explain5").selectAll("li").remove();  //clear away old notes

    var SD = 0, T = 0, eDum = 0, rifAndPoType=-1;

    // Calculate T - tolerance value = minimum elevation for new riffle or pool
    for (var i = 0; i < riverData[curRiverNum].e.length; i++) {
        SD += Math.pow((riverData[curRiverNum].e[i] - riverData[curRiverNum].xBar), 2);
    }
    riverData[curRiverNum].SD = Math.sqrt(SD / (riverData[curRiverNum].e.length - 1));
    //T=riverData[curRiverNum].SD*.75;
    T = riverData[curRiverNum].SD * 7;

    //console.log("xBar="+riverData[curRiverNum].xBar + ", SD=" + riverData[curRiverNum].SD)
    //console.log("Analyzing River: " + riverData[curRiverNum].name + ", z_interp.length=" + riverData[curRiverNum].z_interp.length);

    // Initialize
    var rifAndPoNote = "", rifAndPoCount = 0, extremaName = "";
    var extrema = getNewExtrema();

    // identify the riffles and pools
    for (var i = 0; i < riverData[curRiverNum].e.length; i++) {
        eDum += riverData[curRiverNum].e[i];

        if (Math.abs(eDum) > T) {

            if ((eDum < 0 && extrema.Type === extremaRiffle) ||
                (eDum > 0 && extrema.Type === extremaPool)) {              // we have a new extrema of the same type, old one was local.
                extrema.location = i;
                extrema.eleRelLastExtrema += eDum;
                //console.log("Adding to "+extrema.name + ", eDum=" + eDum);

            }
            else {

                rifAndPoType= (eDum > 0) ? extremaPool : extremaRiffle;   // type of new landform

                if (rifAndPoCount===0) {

                    extrema.Type= (rifAndPoType===extremaRiffle) ? extremaPool : extremaRiffle;
                    extrema.name = (extrema.Type===extremaPool) ? "Pool" : "Riffle";
                    extrema.location=0;
                    extrema.elevation = riverData[curRiverNum].z_interp[0];
                }

                var OldLandForm=extrema.location;
                for (var j = OldLandForm; j<i; j++) {
                    if ((riverData[curRiverNum].e[j] > 0 && rifAndPoType === extremaRiffle) ||          //If our new landform is a riffle (or pool) and we were going down (or up) initially, then move those first measurements to old landform
                        (riverData[curRiverNum].e[j] < 0 && rifAndPoType === extremaPool)) {
                        extrema.location++;
                        eDum-=riverData[curRiverNum].e[j];
                    }
                    else {
                        break;
                    }
                }
                extrema.waterDepth = Math.round(riverData[curRiverNum].waterDepth[extrema.location] * 1000) / 1000;

                // File away the previous landform
                riverData[curRiverNum].rifflesAndPools.push(extrema);
                rifAndPoCount=riverData[curRiverNum].rifflesAndPools.length;



                // Begin processing the new one
                extrema = getNewExtrema();                            // we have a new extrema of a different kind

                extrema.Type = rifAndPoType;
                extrema.name = (extrema.Type===extremaPool) ? "Pool" : "Riffle";
                extrema.location = i;
                extrema.elevation = riverData[curRiverNum].z_interp[i];
                extrema.eleRelToLastMeasure = extrema.elevation-riverData[curRiverNum].rifflesAndPools[rifAndPoCount-1].elevation;
                //extrema.eleRelToLastMeasure = eDum;
                extrema.waterDepth = Math.round(riverData[curRiverNum].waterDepth[i] * 1000) / 1000;
                extrema.eleRelToLastMeasure = Math.round(extrema.eleRelToLastMeasure * 1000) / 1000;


            }

            eDum = 0;
        }

    }

    if (extrema.location != 0) {    // we have one more left that needs to be saved

        rifAndPoType= (extrema.eleRelLastExtrema > 0) ? extremaPool : extremaRiffle;   // type of new landform

        if (rifAndPoCount===0) {

            extrema.Type= (rifAndPoType===extremaRiffle) ? extremaPool : extremaRiffle;
            extrema.name = (extrema.Type===extremaPool) ? "Pool" : "Riffle";
            extrema.location=0;
            extrema.elevation = riverData[curRiverNum].z_interp[0];
        }

        extrema.waterDepth = Math.round(riverData[curRiverNum].waterDepth[extrema.location] * 1000) / 1000;

        // File away
        riverData[curRiverNum].rifflesAndPools.push(extrema);
        rifAndPoCount=riverData[curRiverNum].rifflesAndPools.length;
    }



        // fine tune the data
        var i = 0;
        for (i = 0; i < riverData[curRiverNum].rifflesAndPools.length; i++) {


            if (i > 0) {
                riverData[curRiverNum].rifflesAndPools[i].lenEntrance = riverData[curRiverNum].rifflesAndPools[i].location - riverData[curRiverNum].rifflesAndPools[i - 1].location;
            }
            else {
                riverData[curRiverNum].rifflesAndPools[i].lenEntrance = riverData[curRiverNum].rifflesAndPools[i].location;
            }

            riverData[curRiverNum].rifflesAndPools[i].start = Math.round(riverData[curRiverNum].rifflesAndPools[i].location - (riverData[curRiverNum].rifflesAndPools[i].lenEntrance / 2));


            if (i > 0) {
                riverData[curRiverNum].rifflesAndPools[i - 1].lenExit = riverData[curRiverNum].rifflesAndPools[i].lenEntrance;
                riverData[curRiverNum].rifflesAndPools[i - 1].end = Math.round(riverData[curRiverNum].rifflesAndPools[i - 1].location + (riverData[curRiverNum].rifflesAndPools[i - 1].lenExit / 2));
                riverData[curRiverNum].rifflesAndPools[i - 1].lenExtrema = (riverData[curRiverNum].rifflesAndPools[i - 1].lenEntrance / 2) + (riverData[curRiverNum].rifflesAndPools[i - 1].lenExit / 2);

                extrema = riverData[curRiverNum].rifflesAndPools[i - 1];
            }

        }

        i=riverData[curRiverNum].rifflesAndPools.length-1;
        riverData[curRiverNum].rifflesAndPools[i].lenExit = (riverData[curRiverNum].e.length-riverData[curRiverNum].rifflesAndPools[i].location);
        riverData[curRiverNum].rifflesAndPools[i].end = Math.round(riverData[curRiverNum].rifflesAndPools[i].location + (riverData[curRiverNum].rifflesAndPools[i].lenExit));
        riverData[curRiverNum].rifflesAndPools[i].lenExtrema = (riverData[curRiverNum].rifflesAndPools[i].lenEntrance / 2) + (riverData[curRiverNum].rifflesAndPools[i].lenExit);



    // Report
    for (i = 0; i < riverData[curRiverNum].rifflesAndPools.length; i++) {


        extrema = riverData[curRiverNum].rifflesAndPools[i];



        rifAndPoNote = i + ") " + extrema.name + " at " + extrema.location + "m from the starting location, is " + (extrema.lenExtrema) + "m in length, " + extrema.elevation + "m in elevation, and " + extrema.waterDepth + "m below the surface. The len of Entrance is " + extrema.lenEntrance + ", and the length of exit is " + extrema.lenExit + ".";

            var noteObject = {
                name: extrema.name,
                location: extrema.location,
                lenExtrema: extrema.lenExtrema,
                elevation: extrema.elevation,
                waterDepth: extrema.waterDepth,
                lenEntrance: extrema.lenEntrance,
                lenExit: extrema.lenExit
            };
            secNoteSpace(noteObject, (i+1), "DarkRed", .7);


            //console.log(rifAndPoNote);
    }


    //riverData[curRiverNum].rifflesAndPools.splice(0, 1);  // remove that first element


    //console.log("Finished Analyzing River: i=" + i);

    riverData[curRiverNum].riverAnalyzed = 1;
    secTextUpdate(4, "Notes for river " + (curRiverNum + 1), "We found " + riverData[curRiverNum].rifflesAndPools.length + " riffles and pools");
    drawRiverSection(2, xStart_save, xEnd_save);
    louisDraw(riverData[curRiverNum]);

}








function svgSpace_set(inSpace, inApp_id) {

    // Which svg space are we using?
    for (var i = 0; i < sec_apps.length; i++) {
        if (sec_apps[i] === inSpace) {
            sec_apps[i] = 0;
            break;
        }
    }
    sec_apps[inApp_id] = inSpace;

    var i = 0;
    // sec_apps=[1,2,3,0];
    if (inSpace === 1) {
        svgSpace = svgSpace1;
        w_Sec = w_Sec1;
        h_Sec = h_Sec1;
    }
    else if (inSpace === 2) {
        svgSpace = svgSpace2;
        w_Sec = w_Sec2;
        h_Sec = h_Sec2;

        if (w_ScaleDown < 1) {
            i = w_FullSize - w_ScaleDown * w_FullSize;  // width that needs to be removed from w_Sec2

            if ((w_Sec2 - parseInt(i)) < 600) {
                secNoteSpaceActive = 0;
            }
            else {
                secNoteSpaceActive = 1;
            }
            //w_Sec = w_Sec2 - parseInt(i) - ((secNoteSpaceActive === 1) ? (w_Sec4+40) : 60);
            w_Sec = w_Sec2 - parseInt(i);

        }
        //console.log("window x=" + x + ", window y=" + y  + ", w_ScaleDown=" + w_ScaleDown  + ", w_Sec2=" + w_Sec2  + ", w_Sec=" + w_Sec + ", w_Sec4=" + w_Sec4 + ", i=" + i)


    }
    else if (inSpace === 3) {
        svgSpace = svgSpace3;
        w_Sec = w_Sec3;
        h_Sec = h_Sec3;


        if (w_ScaleDown < 1) {
            i = w_FullSize - w_ScaleDown * w_FullSize;  // width that needs to be removed from w_Sec2

            if ((w_Sec3 - parseInt(i)) < 600) {
                secNoteSpaceActive = 0;
            }
            else {
                secNoteSpaceActive = 1;
            }
            //w_Sec = w_Sec2 - parseInt(i) - ((secNoteSpaceActive === 1) ? (w_Sec4+40) : 60);
            w_Sec = w_Sec3 - parseInt(i);

        }


    }

}



function secTextUpdate(inSpace, inHeading, inDirections) {

    // Which svg space are we using?

    if (inSpace === 1) {
        sec1Heading.innerHTML = inHeading;
        sec1Directions.innerHTML = inDirections;
    }
    else if (inSpace === 2) {
        sec2Heading.innerHTML = inHeading;
        sec2Directions.innerHTML = inDirections;
    }
    else if (inSpace === 3) {
        sec3Heading.innerHTML = inHeading;
        sec3Directions.innerHTML = inDirections;
    }
    else if (inSpace === 4) {
        sec4Heading.innerHTML = inHeading;
        sec4Directions.innerHTML = inDirections;
    }

}



function secNoteSpace(inNote, inNoteId, inColor, inColor_saturation) {

    var svg_colorNum, lcolor, lcolor_saturation, id1;

    id1 = inNoteId;

    if(inNote.name === "Pool")
        lcolor = "blue";
    else
        lcolor = "orange";



    var formInfo = d3.select("#explain5").style("border", "4px solid black").style("border-radius", "6px").style("font-size", "120%")
        .append("form").append("fieldset").attr("disabled","true").style("border","4px solid " + lcolor).style("border-radius","6px").style("font-size","120%")
        .attr("id", ("dum" + id1));
    //.append("li")
    //.attr("id", ("dum" + id1));

    formInfo.append("legend").text(id1);
    formInfo.append("label").text("Type:").style("color", "black");
    formInfo.append("label").text(inNote.name).style("color", lcolor);
    formInfo.append("br");
    formInfo.append("label").text("xPos:").style("color", "black");
    formInfo.append("label").text(inNote.location).style("color", "green");
    formInfo.append("br");
    formInfo.append("label").text("Length:").style("color", "black");
    formInfo.append("label").text(inNote.lenExtrema).style("color", "purple");
    formInfo.append("br");
    formInfo.append("label").text("Elevation:").style("color", "black");
    formInfo.append("label").text(inNote.elevation).style("color", "indigo");
    formInfo.append("br");
    formInfo.append("label").text("Depth:").style("color", "black");
    formInfo.append("label").text(inNote.waterDepth).style("color", "lightseagreen");
    formInfo.append("br");
    formInfo.append("label").text("Entr Len:").style("color", "black");
    formInfo.append("label").text(inNote.lenEntrance).style("color", "tomato");
    formInfo.append("br");
    formInfo.append("label").text("Exit Len:").style("color", "black");
    formInfo.append("label").text(inNote.lenExit).style("color", "slateblue");

    // var rifAndPoNote = inNoteId + ") " + inNote.name + " at " + inNote.location + "m from the starting location, is " + (inNote.lenExtrema) + "m wide, " + inNote.elevation + "m in elevation, and " + inNote.waterDepth + "m below the surface. The len of Entrance is " + inNote.lenEntrance + ", and the length of exit is " + inNote.lenExit + ".";




    //var elem = document.getElementById(("dum" + id1));
    //elem.innerHTML = rifAndPoNote;
    //elem.style.color = inColor;
    //elem.style.opacity = inColor_saturation;


}


function secNoteSpace_refresh() {
    //Refresh;

    // I need to work on scaling down the note section!!!
    w_sec = w_ScaleDown * 240;
    h_sec = 340;

    var margin = { top: 20, right: 10, bottom: 20, left: 10 };
    var width = w_Sec - margin.right - margin.left;
    var height = h_Sec - margin.top - margin.bottom;


    secTextUpdate(4, "", "");                         // clear header
    d3.select("#explain5").selectAll("li").remove();  //clear away old notes

    d3.select("#explain5")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);





    if (secNoteSpaceActive === 1) {
        setCurrentState(0);
        srec_fill(state_name);
        secTextUpdate(4, "Notes for " + curYear, "");
        secNoteSpace("The " + state_name + " incarceration rate was " + incarcerationRate + " per 100,000.  The population was " + population.toLocaleString('en-US') + ". There were " + inmates.toLocaleString('en-US') + " people behind bars.", 60);


        for (var i = svg_lineArray.length - 1; i >= 0; i--) {
            //svg_lineNum=i;
            setCurrentState(svg_lineArray[i].state_id);
            srec_fill(state_name);
            secTextUpdate(4, "Notes for " + curYear, "");
            secNoteSpace(state_name + "'s incarceration rate was " + incarcerationRate + " per 100,000.  The population was " + population.toLocaleString('en-US') + ". There were " + inmates.toLocaleString('en-US') + " people behind bars.", i);

        }

    }
}


function louisDraw(river) {
    // d3.select("#explain5").selectAll("li").remove();  //clear away old notes
    $(".fullChartSVG").remove();
    var fullDataset = [];
    for (var index = 0; index < river.x_interp.length ; index++) {
        var prevIndex;
        (index == 0) ? prevIndex = 0 : prevIndex = index - 1;
        var slopeZ = (river.z_interp[prevIndex + 1] - river.z_interp[prevIndex]) / (river.x_interp[prevIndex + 1] - river.x_interp[prevIndex]);
        var slopeWSE = (river.wse_interp[prevIndex + 1] - river.wse_interp[prevIndex]) / (river.x_interp[prevIndex + 1] - river.x_interp[prevIndex]);
        fullDataset.push({ x_interp: river.x_interp[index], z_interp: river.z_interp[index], wse_interp: river.wse_interp[index], slopeZ: slopeZ.toFixed(8), slopeWSE: slopeWSE.toFixed(8) });
    }

    var linearDataset = fullDataset;
    linearDataset.color = "220,20,60"; linearDataset.idStr = "linearPoint";
    var cardinalDataset = [];
    for (var index = 0; index < river.x_interp.length ; index++) {
        var prevIndex;
        (index == 0) ? prevIndex = 0 : prevIndex = index - 1;
        var slopeZ = (river.z_cardinal_interp[prevIndex + 1] - river.z_cardinal_interp[prevIndex]) / (river.x_cardinal_interp[prevIndex + 1] - river.x_cardinal_interp[prevIndex]);
        cardinalDataset.push({ x_interp: river.x_cardinal_interp[index], z_interp: river.z_cardinal_interp[index], slopeZ: slopeZ.toFixed(8) });
    }
    cardinalDataset.color = "153,50,204"; cardinalDataset.idStr = "cardinalPoint";
    var basisDataset = [];
    for (var index = 0; index < river.x_interp.length ; index++) {
        var prevIndex;
        (index == 0) ? prevIndex = 0 : prevIndex = index - 1;
        var slopeZ = (river.z_basis_interp[prevIndex + 1] - river.z_basis_interp[prevIndex]) / (river.x_basis_interp[prevIndex + 1] - river.x_basis_interp[prevIndex]);
        basisDataset.push({ x_interp: river.x_basis_interp[index], z_interp: river.z_basis_interp[index], slopeZ: slopeZ.toFixed(8) });
    }
    basisDataset.color = "50,205,50"; basisDataset.idStr = "basisPoint";

    var extremaDataset = [];
    extremaDataset.push(fullDataset[0]);
    for (var index = 1; index < fullDataset.length - 1; index++) {
        var slope1 = river.dz_dx[index - 1];
        var slope2 = river.dz_dx[index];
        //If slope changes sign or a slope is 0:
        if ((slope1 < 0 && slope2 > 0) || (slope1 > 0 && slope2 < 0) || slope2 == 0 || (slope1 == 0 && index == 1)) {
            extremaDataset.push(fullDataset[index]);
        }
    }
    extremaDataset.push(fullDataset[fullDataset.length - 1]);

    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var xScale = d3.scaleLinear()
        .domain([d3.min(river.x_interp), d3.max(river.x_interp)])
        .range([0, width]);

    var xScaleInverted = d3.scaleLinear()
        .range([d3.min(river.x_interp), d3.max(river.x_interp)])
        .domain([0, width]);

    var yAxisRange = d3.max(river.wse_interp) - d3.min(river.z_interp);

    var yScale = d3.scaleLinear()
        .domain([d3.min(river.z_interp) - yAxisRange / 10.0, d3.max(river.wse_interp) + yAxisRange / 10.0])
        .range([height, 0]);

    var yScaleInverted = d3.scaleLinear()
        .range([d3.min(river.z_interp) - yAxisRange / 10.0, d3.max(river.wse_interp) + yAxisRange / 10.0])
        .domain([height, 0]);

    // Adds the svg canvas
    var svg = d3.select("#chartArea")
        .append("svg").attr("class","fullChartSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

       svg.on("click", function() {
           var coords = d3.mouse(this);

           // Normally we go from data to pixels, but here we're doing pixels to data
           var newData = {
               x: Math.round(xScale.invert(coords[0])),  // Takes the pixel number to convert to number
               y: Math.round(yScale.invert(coords[1]))
           };

           var xStart = Math.max(newData.x - (lticks_x / 2), 0), xEnd = Math.min(newData.x + (lticks_x / 2), riverData[curRiverNum].z_interp.length-1);
           riverSection = ((xStart) + " meters to " + xEnd + " meters");
           myDataList2.value = riverSection;

           drawRiverSection(2, xStart, xEnd);

       });

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    //drawLine(fullDataset, "70,130,180", d3.curveLinear, true, true);
    var linearD = findD(fullDataset, d3.curveLinear, false);
    var cardinalD = findD(extremaDataset, d3.curveCardinal, false);
    var basisD = findD(extremaDataset, d3.curveBasis, false);

    var recheckLines = function () {
        $('.chartLine').remove();
        $('.focus').remove();
        //document.getElementsByClassName("chartLine").
        drawLine(findD(fullDataset, d3.curveLinear, true), "70,130,180", true);
        if (document.getElementById("linearCheckbox").checked) {
            //var line = drawLine(fullDataset, "220,20,60", d3.curveLinear, document.getElementById("linearRadio").checked, false).attr("id", "linearLine");
            var line = drawLine(linearD, "220,20,60", document.getElementById("linearRadio").checked).attr("id", "linearLine");
            //  var linearDataset = makeNewDatasetFromLine(document.getElementById("linearLine"));
            //   linearDataset.color = "220,20,60"; linearDataset.idStr = "linearPoint";
        }
        if (document.getElementById("cardinalCheckbox").checked) {
            //var line = drawLine(extremaDataset, "153,50,204", d3.curveCardinal, document.getElementById("cardinalRadio").checked, false).attr("id", "cardinalLine");
            var line = drawLine(cardinalD, "153,50,204", document.getElementById("cardinalRadio").checked).attr("id", "cardinalLine");
            //var cardinalDataset = makeNewDatasetFromLine(document.getElementById("cardinalLine"));
            //cardinalDataset.color = "153,50,204"; cardinalDataset.idStr = "cardinalPoint";
        }
        if (document.getElementById("basisCheckbox").checked) {
            //var line = drawLine(extremaDataset, "50,205,50", d3.curveBasis, document.getElementById("basisRadio").checked, false).attr("id", "basisLine");
            var line = drawLine(basisD, "50,205,50", document.getElementById("basisRadio").checked).attr("id", "basisLine");
            //var basisDataset = makeNewDatasetFromLine(document.getElementById("basisLine"));
            //basisDataset.color = "50,205,50"; basisDataset.idStr = "basisPoint";
        }
        var curveDatasets = [];
        if (document.getElementById("linearCheckbox").checked)
            curveDatasets.push(linearDataset);
        if (document.getElementById("cardinalCheckbox").checked)
            curveDatasets.push(cardinalDataset);
        if (document.getElementById("basisCheckbox").checked)
            curveDatasets.push(basisDataset);
        mouseoverForData(curveDatasets);
        /*cardinalDataset.forEach(function (d) {
         d3.select("#linearReportPoint").append("p").html(d.x_interp.toFixed(0) + ",");
         })
         cardinalDataset.forEach(function (d) {
         d3.select("#cardinalReportPoint").append("p").html(d.z_interp.toFixed(4) + ",");
         })
         basisDataset.forEach(function (d) {
         d3.select("#basisReportPoint").append("p").html(d.x_interp.toFixed(0) + ",");
         })
         basisDataset.forEach(function (d) {
         d3.select("#wseReportPoint").append("p").html(d.z_interp.toFixed(4) + ",");
         })*/
    }

    document.getElementById("linearCheckbox").onclick = recheckLines;
    document.getElementById("cardinalCheckbox").onclick = recheckLines;
    document.getElementById("basisCheckbox").onclick = recheckLines;
    document.getElementById("linearRadio").onclick = recheckLines;
    document.getElementById("cardinalRadio").onclick = recheckLines;
    document.getElementById("basisRadio").onclick = recheckLines;

    recheckLines();

    function makeNewDatasetFromLine(line) {
        var lineLen = line.getTotalLength();
        var lineStep = fullDataset.length / (10 * lineLen);
        var lenCurrent = 0;
        var newDataset = [];
        while (lenCurrent < lineLen) {
            var point = line.getPointAtLength(lenCurrent);
            var xIn = point.x * (fullDataset.length - 1) / (width);
            if (Math.ceil(xIn) > newDataset.length || point.x == 0) {
                newDataset.push({ x_interp: xIn, z_interp: yScaleInverted(point.y) });
            }
            /*xCurrent += xStep;*/ lenCurrent += lineStep;
        }
        var lastPoint = line.getPointAtLength(lineLen);
        newDataset.push({ x_interp: fullDataset.length - 1, z_interp: yScaleInverted(point.y) });
        return newDataset;
    }

    function mouseoverForData(datasets) {
        var focusZ = []; var slopesEle = [];

        datasets.forEach(function (d) {
            focusZ.push(svg.append("g")
                .attr("class", "focus")
                .style("display", "none"));
            slopesEle.push(svg.append("g").attr("class", "focus").style("display", "none"));
        });

        var focusWSE = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");
        var slopeWSEEle = svg.append("g").attr("class", "focus").style("display", "none");

        focusZ.forEach(function (d, i) {
            d.append("circle").attr("r", 4.5).style("fill", "rgb(" + datasets[i].color + ")").attr("id", datasets[i].idStr);

            slopesEle[i].attr("id", datasets[i].idStr + "Slope");
        });

        focusWSE.append("circle").attr("id", "wsePoint")
            .attr("r", 4.5).style("fill", "rgb(70,130,180)");

        slopeWSEEle.attr("id", "wsePointSlope");

        svg.append("rect")
            .attr("class", "overlay").style("fill", "none").style("pointer-events", "all")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () {
                focusZ.forEach(function (d) {
                    d.style("display", null);
                });
                focusWSE.style("display", null);
            })
            .on("mouseout", function () {
                focusZ.forEach(function (d) {
                    d.style("display", "none");
                });
                focusWSE.style("display", "none");
            })
            .on("mousemove", mousemove);





        function mousemove() {
            var xVal = Math.floor(xScale.invert(d3.mouse(this)[0]));
            datasets.forEach(function (d, i) {
                //var zVal = d[xVal].z_interp;
                var zVal; var zSlope;
                for (var index = 0; index < d.length; index++) {
                    if (d[index].x_interp >= xVal) {
                        var bestDatapoint = d[index];
                        zVal = bestDatapoint.z_interp;
                        zSlope = bestDatapoint.slopeZ.toString(); break;
                    }
                }
                focusZ[i].attr("transform", "translate(" + xScale(xVal) + "," + yScale(zVal) + ")");
                //focusZ[i].select("text").text(zVal.toFixed(4));
                focusZ[i].select("circle").attr("data-x", xVal).attr("data-z", zVal);
                slopesEle[i].attr("data-z", zSlope);
            });
            var wseVal = fullDataset[xVal].wse_interp;
            var wseSlope = fullDataset[xVal].slopeWSE.toString();
            focusWSE.attr("transform", "translate(" + xScale(xVal) + "," + yScale(wseVal) + ")");
            //focusWSE.select("text").text(wseVal.toFixed(4));
            focusWSE.select("circle").attr("data-x", xVal).attr("data-z", wseVal);
            slopeWSEEle.attr("data-z", wseSlope);
        }
    }




function findD(lineDataset, curve, isWSE) {
        var line;
        if (isWSE) {
            line = d3.line()
                .x(function (d) {
                    return xScale(d.x_interp);
                })
                .y(function (d) {
                    return yScale(d.wse_interp);
                })
                .curve(curve);
            return line(lineDataset);
        } else {
            line = d3.line()
                .x(function (d) {
                    return xScale(d.x_interp);
                })
                .y(function (d) {
                    return yScale(d.z_interp);
                })
                .curve(curve);
            return line(lineDataset);
        }
    }

    //Color goes in as "r,g,b"
    function drawLine(linePos, color, primacy) {
        var alpha;
        primacy ? alpha = 1.0 : alpha = 0.3;
        return svg.append("path")
            .attr("class", "chartLine").style("fill", "none").style("stroke", "rgba(" + color + "," + alpha + ")").style("stroke-width", "2px")
            .attr("d", linePos);


    }

    d3.timer(function (elapsed) {
        $(".slopeLine").remove();
        var linearReport = "("; var linearColor = "rgb(220,20,60)"; var linearLine = [{ x: 10, y: 100 }];
        var cardinalReport = "("; var cardinalColor = "rgb(153,50,204)"; var cardinalLine = [{ x: 10, y: 100 }];
        var basisReport = "("; var basisColor = "rgb(50,205,50)"; var basisLine = [{ x: 10, y: 100 }];
        var wseReport = "("; var wseColor = "rgb(70,130,180)"; var wseLine = [{ x: 10, y: 100 }];
        try {
            var wsePoint = document.getElementById("wsePoint"); wsePoint.getAttribute("data-z");
            var wseSlope = document.getElementById("wsePointSlope").getAttribute("data-z");
            document.getElementById("wseReportPoint").innerHTML = "Point: (" + wsePoint.getAttribute("data-x") + ", " + wsePoint.getAttribute("data-z") + ")";
            document.getElementById("wseReportSlope").innerHTML = "Slope: (" + wseSlope + ")";
            var wseLineDest = 5 * -parseFloat(wseSlope) * (200) + 100;
            wseLine.push({ x: 210, y: wseLineDest });
            var wseLineFunction = d3.line().x(function (d) { return d.x; }).y(function (d) { return d.y; });
            d3.select("#wseSlopeVisual").append("path").style("fill", "none").style("stroke", wseColor).style("stroke-width", "4px").attr("class", "slopeLine").attr("d", wseLineFunction(wseLine));
            if (document.getElementById("linearCheckbox").checked) {
                var linearPoint = document.getElementById("linearPoint");
                var linearX = linearPoint.getAttribute("data-x");
                var linearZ = fullDataset[linearX].z_interp;
                var linearSlope = fullDataset[linearX].slopeZ;
                document.getElementById("linearReportPoint").innerHTML = "Point: (" + linearX + ", " + linearZ + ")";
                document.getElementById("linearReportSlope").innerHTML = "Slope: (" + linearSlope + ")";
                var linearLineDest = 5 * -parseFloat(linearSlope) * (200) + 100;
                linearLine.push({ x: 210, y: linearLineDest });
                var linearLineFunction = d3.line().x(function (d) { return d.x; }).y(function (d) { return d.y; });
                d3.select("#linearSlopeVisual").append("path").style("fill", "none").style("stroke", linearColor).style("stroke-width", "4px").attr("class", "slopeLine").attr("d", linearLineFunction(linearLine));
            }
            if (document.getElementById("cardinalCheckbox").checked) {
                var cardinalPoint = document.getElementById("cardinalPoint");
                var cardinalX = Math.round(cardinalPoint.getAttribute("data-x"));
                var cardinalZ = parseFloat(cardinalPoint.getAttribute("data-z")).toFixed(4);
                var cardinalSlope = document.getElementById("cardinalPointSlope").getAttribute("data-z");
                document.getElementById("cardinalReportPoint").innerHTML = "Point: (" + cardinalX + ", " + cardinalZ + ")";
                document.getElementById("cardinalReportSlope").innerHTML = "Slope: (" + cardinalSlope + ")";
                var cardinalLineDest = 5 * -parseFloat(cardinalSlope) * (200) + 100;
                cardinalLine.push({ x: 210, y: cardinalLineDest });
                var cardinalLineFunction = d3.line().x(function (d) { return d.x; }).y(function (d) { return d.y; });
                d3.select("#cardinalSlopeVisual").append("path").style("fill", "none").style("stroke", cardinalColor).style("stroke-width", "4px").attr("class", "slopeLine").attr("d", cardinalLineFunction(cardinalLine));
            }
            if (document.getElementById("basisCheckbox").checked) {
                var basisPoint = document.getElementById("basisPoint");
                var basisX = Math.round(basisPoint.getAttribute("data-x"));
                var basisZ = parseFloat(basisPoint.getAttribute("data-z")).toFixed(4);
                var basisSlope = document.getElementById("basisPointSlope").getAttribute("data-z");
                document.getElementById("basisReportPoint").innerHTML = "Point: (" + basisX + ", " + basisZ + ")";
                document.getElementById("basisReportSlope").innerHTML = "Slope: (" + basisSlope + ")";
                var basisLineDest = 5 * -parseFloat(basisSlope) * (200) + 100;
                basisLine.push({ x: 210, y: basisLineDest });
                var basisLineFunction = d3.line().x(function (d) { return d.x; }).y(function (d) { return d.y; });
                d3.select("#basisSlopeVisual").append("path").style("fill", "none").style("stroke", basisColor).style("stroke-width", "4px").attr("class", "slopeLine").attr("d", basisLineFunction(basisLine));
            }
        } catch (e) {
            document.getElementById("linearReportPoint").innerHTML = "N/A";
            document.getElementById("cardinalReportPoint").innerHTML = "N/A";
            document.getElementById("basisReportPoint").innerHTML = "N/A";
            document.getElementById("wseReportPoint").innerHTML = "N/A";
            document.getElementById("linearReportSlope").innerHTML = "N/A";
            document.getElementById("cardinalReportSlope").innerHTML = "N/A";
            document.getElementById("basisReportSlope").innerHTML = "N/A";
            document.getElementById("wseReportSlope").innerHTML = "N/A";
        }
    });
}


