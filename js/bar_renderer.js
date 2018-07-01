/*
///////////////////////////////////////////////////////////////////////
//
// Module           : BarChart Class
// Author           : Murlidhar Fichadia
// Date             : 01/11/16
// Function of code :
//	This JavaScript module implements a simple barchart in D3.js
//	It adds an svg to the targetDOMelement where it renders the chart
//  The dataset expected to be an array of objects. Each object 
//	comprising a 'key' and 'value' attributes.
//
//  % of code written by Me				   : 70%
//  % of code taken from lab examples      : 30%
//  % of code taken from bostock's examples: 00%
//
//	Usage:
//	render  					: renders or executes updateScales(), GUP_bars(), Tooltip()
//	Load dataset 				: loads data
//	barClickCallBack function 	: callback function overwrite's barClick
//
//	Credits
//	Code adapted from F20DV - Lab Examples 
//	Author of the code: Mike Chantler
///////////////////////////////////////////////////////////////////////
*/

"use strict"


function barchart(targetDOMelement) { 

	var barchartObject = {};
	
	//=================== PUBLIC FUNCTIONS =========================
	
	barchartObject.render = function () {
		render();
		return barchartObject;
	}
	
	barchartObject.loadDataset = function (d) {
		dataset=d;
		return barchartObject; 
	}
	
	barchartObject.barClickCallBack = function (callback) {
		barClick=callback;
		return barchartObject;
	}

	//=================== PRIVATE VARIABLES =========================
	
	
	var margin = {left:20, top:20, right:20, bottom:20};
	var svgWidth = 700 - margin.left - margin.right;
	var svgHeight = 400 - margin.top - margin.bottom;
	
	var dataset = [];	
	var xScale = d3.scale.ordinal();
	var yScale = d3.scale.linear();

	var xAxis = d3.svg.axis()
	                    .scale(xScale)
	                    .orient("bottom");

	var yAxis = d3.svg.axis()
	                    .scale(yScale)
	                    .orient("left");	

	//SVG element
	var svg = d3.select(targetDOMelement)
				.append("svg")
				.attr("width", 760)
				.attr("height", svgHeight);
	var selection;

	var xAxisDOM = svg.append("g").attr("class","axis x-axis");
	var yAxisDOM = svg.append("g").attr("class","axis y-axis");

	var div = d3.select("body").append("div");

	var formatNumber = d3.format(",d");

	//=================== PRIVATE FUNCTIONS ====================================

	var barClick = function (d,i){
		console.log ("click call, current datum d="+JSON.stringify(d),", current index i="+i+", current DOM element this=",this);	
	}

	function render () 
	{	
		updateScales();
		GUP_bars();
		Tooltip();
	}
	
	function updateScales(){
		
		//Set scales to reflect any change in svgWidth, svgHeight or the dataset size or max value
		var maxValue=d3.max(dataset, function(d) { return d.Value; });
		var minValue=d3.min(dataset, function(d) { return d.Value; });
		
		xScale
			.domain(dataset.map(function(d){return d.OrgID}))
			.rangeRoundBands([0, svgWidth], 0.05);
		
		yScale
			.domain([0, maxValue])
			.range([svgHeight-40,0]);
		
		xAxis.scale(xScale);
		xAxisDOM.attr("transform", "translate(0,320)")
            .call(xAxis);

        yAxis.scale(yScale);
        yAxisDOM
            .call(yAxis);	
	};
			
	function GUP_bars(){

		 
		//BIND DATA
		selection = svg
			
			.attr("class", "bars")
			.attr("transform", "translate(10,0)")
			.selectAll("rect")	
			.data(dataset);		
			
		//GUP UPDATE 1 
		selection
			.style("fill", "#0000ff")
			.transition()
			.duration(3000);	   

		//GUP: ENTER
		selection.enter()
			.append("rect")
			.style("fill", "#00ff00")
			.transition()
			.duration(3000);
		
		//GUP UPDATE 2 [= UPDATE 1 + ENTER] 
		//Updates all selected visual elements on page
		selection
		   .transition()
		   .delay(function(d, i) 
		   {
			   return i / dataset.length * 2000;
		   })
		   .attr("x", function(d, i) 
		   {
				return xScale(d.OrgID);
		   })
		   .attr("y", function(d) 
		   {
				return yScale(d.Value);
		   })  
		   .attr("width", xScale.rangeBand())
		   .attr("height", function(d, i) 
		   {
				return (yScale(0) - yScale(d.Value));
		   })
		   .style("fill", "#ccc")
		  
		//GUP EXIT 
		selection.exit()
				 .style("fill", "#ff0000")
				 .transition()
				 .duration(1000)
				 .attr("y",0)
				 .remove();

	};

	function Tooltip()
	{
		div.attr("class", "tooltip");

		selection
		.on("mouseover", function(d) 
		{
			d3.select(this).classed("active", true);
			div	.html(d.Name+"<br/>"+"Total Value: "+formatNumber(d.Value))	
                .style("left", (d3.event.pageX - 50) + "px")		
                .style("top", (d3.event.pageY - 70) + "px");	
         	div.attr("class", "tooltip");
        })
        .on("mouseout", function() 
        {	
           d3.select(this).classed("active", false);
           div.attr("class", "hidden");
        })	
		.on("click", barClick);

	}

	return barchartObject;
}