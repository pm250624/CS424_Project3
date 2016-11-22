
function main(river) {
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
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

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
        var slopeWSEEle = svg.append("g").attr("class","focus").style("display", "none");

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
            var wseLineFunction = d3.line().x( function(d) {return d.x; }).y(function(d) { return d.y; });
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

function incrementRiverContext(forward) {
    var node = document.getElementById("chartArea");
    while (node.firstChild) node.removeChild(node.firstChild);
    var titleElement = document.getElementById("riverTitle");
    var riverStrs = ["R0", "R1", "R2", "R3", "R4", "R5", "R6", "R10", "R11", "R12", "R13", "R14", "R16", "R18"];
    var rivers = [R0, R1, R2, R3, R4, R5, R6, R10, R11, R12, R13, R14, R16, R18];
    var index = riverStrs.indexOf(titleElement.getAttribute("data-river"));
    var nextIndex = 0;
    if (index == -1) return;
    else if (forward && index == riverStrs.length - 1) nextIndex = 0;
    else if (forward) nextIndex = index + 1;
    else if (!forward && index == 0) nextIndex = riverStrs.length - 1;
    else nextIndex = index - 1;
    titleElement.setAttribute("data-river", riverStrs[nextIndex]);
    main(rivers[nextIndex]);
    titleElement.innerHTML = rivers[nextIndex].name + " (" + riverStrs[nextIndex] + ")";
}