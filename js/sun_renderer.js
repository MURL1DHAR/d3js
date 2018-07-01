/*
////////////////////////////////////////////////////////////////////////
//
// Module           : Sun Renderer Class
// Author           : Murlidhar Fichadia
// Date             : 01/11/16
// Function of code :
//	This JavaScript module implements a sunchart in D3.js
//	It adds an svg to the targetDOMelement where it renders the chart
//  The dataset is expected to be a nested hierarchy objects. Each object 
//	comprising of parent and child objects.
//
//  % of code written by Me				   : 80%
//  % of code taken from lab examples      : 00%
//  % of code taken from bostock's examples: 20%
//
//
//	Usage:
//	render  					: renders or executes partition, scalesAndArc and d3Svg
//	Load dataset 				: loads data
//
//	Credits
//  Code adapted from D3js.Org website
//  Source : https://bl.ocks.org/mbostock/4348373
//  Author : Mike Bostock
///////////////////////////////////////////////////////////////////////
*/

"use strict"


function sunchart(targetDOMelement) { 

	var sunchartObject = {};
	
	//=================== PUBLIC FUNCTIONS =========================
	
	sunchartObject.render = function () {
		render();
		return sunchartObject;
	}
	
	sunchartObject.loadDataset = function (d) {
		dataset=d;
		return sunchartObject; 
	}
	
	

	//=================== PRIVATE VARIABLES =========================
	var dataset = [];

	var width = 960,
	    height = 500,
	    radius = (Math.min(width, height) / 2) - 10;

	var formatNumber = d3.format(",d");

	var x = d3.scale.linear();

	var y = d3.scale.sqrt();
	    
	var partition = d3.layout.partition();

	var color = d3.scale.category20c();

	var arc = d3.svg.arc();

	var svg = d3.select(targetDOMelement).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

	var hierarchy, gs, g, path;
	
	var div = d3.select("body").append("div");

	//=================== PRIVATE FUNCTIONS ====================================

	function render () 
	{	

	    hierarchy = { "key": "All Grants", "values": dataset};

		partition
    		.value(function(d) { return d.Value;})
			.children(function(d) {  return d.values; });

		scalesAndArc();

		d3Svg();

	}
	
	function scalesAndArc(){
		x
	    	.range([0, 2 * Math.PI]);
	    y
	    	.range([0, radius]);

		arc
		    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
		    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
		    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
		    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

	}

	

	function d3Svg()
	{
		//BIND DATA
		gs = svg
				.selectAll("g")
				.data(partition.nodes(hierarchy));

		//GUP: UPDATE 1

		//GUP: ENTER
		g = gs
			.enter()
			.append("g")
			.on("click", click);

		
      	div.attr("class", "tooltip");

		g
		.on("mouseover", function(d) {
			d3.select(this).classed("active", true);
			div	.html(d.key+"<br/>"+"Value: "+formatNumber(d.value))	
                .style("left", (d3.event.pageX - 50) + "px")		
                .style("top", (d3.event.pageY - 70) + "px");	
         	div.attr("class", "tooltip");
        })
        .on("mouseout", function() {	
           d3.select(this).classed("active", false);
           div.attr("class", "hidden");
        });

      	 
		
		//UPDATE 2 [=UPDATE 1 + ENTER]
		path = g
				.append("path");

		 gs
		  .select('path')
		  .style("fill", function(d) {
		      return color(d.value);
		  })
		  .each(function(d) {
		      this.x0 = d.x;
		      this.dx0 = d.dx;
		  })
		  .transition()
		  .duration(1000)
		  .attr("d", arc);

		  //GUP: EXIT 
		  gs
		  	.exit()
		  	.transition()
		  	.duration(500)
		  	.style("fill-opacity", 1e-6)
		  	.remove();
	}

	function click(d) {
	  	svg.transition()
	      .duration(750)
	      .tween("scale", function() {
	        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
	            yd = d3.interpolate(y.domain(), [d.y, 1]),
	            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
	        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
	      })
	    .selectAll("path")
	    .attrTween("d", function(d) { return function() { return arc(d); }; });
	}

	return sunchartObject;
}