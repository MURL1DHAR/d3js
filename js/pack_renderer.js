/*
///////////////////////////////////////////////////////////////////////
//
// Module           : Pack Renderer Class
// Author           : Murlidhar Fichadia
// Date             : 01/11/16
// Function of code :
//	This JavaScript module implements a simple pack layout in D3.js
//	It adds an svg to the targetDOMelement where it renders the chart
//
//  % of code written by Me				   : 40%
//  % of code taken from lab examples      : 60%
//  % of code taken from bostock's examples: 00%
//
//
//	Usage:
//	render  					: renders or executes pack chart
//	loadAndRenderDataset		: loads and render data
//  loadAndRenderNestDataset 	: loads and changes flate data to hierarchical data with parents and children
//  overideLeafLabel 			: leafLabel value is set
//  overideParentLabel 			: patentLabel value is set
//  overideTooltip  			: tooltip value is set
//  overideClickBehaviour 		: callback function overwrite's ClickBehaviour
//  topicHoverNumber 			: on hover over pie or tree, topic is highlighted with background color
//
//	Credits
//	Code adapted from F20DV - Lab Examples 
//	Author of the code: Mike Chantler
///////////////////////////////////////////////////////////////////////
*/

"use strict" //This catches acidental global declarations


function packRenderer(targetDOMelement) { 
	
	var packRendererObject = {};

	//=================== PUBLIC METHODS =========================
	
	packRendererObject.loadAndRenderDataset = function (data) {
		dataset=data;
		render();
		return packRendererObject;
	}


	packRendererObject.loadAndRenderNestDataset = function (data, rootName = "") {
	//Method to load d3.nest format hierarchy directly
		packLayoutGenerator.children(function(d) {return d.values;} )
		dataset = {"key": rootName, "values": data};
		render();
		return packRendererObject;
	}
	
	packRendererObject.overideLeafLabel = function (labelFunction) {
	
		leafLabel = labelFunction;
		return packRendererObject; 
	}	

	packRendererObject.overideParentLabel = function (labelFunction) {
	
		parentLabel = labelFunction;
		return packRendererObject; 
	}	

	packRendererObject.overideTooltip = function (tooltipFunction) {
	
		tooltip = tooltipFunction;
		return packRendererObject; 
	}	

	packRendererObject.overideClickBehaviour = function (tooltipFunction) {
	
		clickBehaviour = tooltipFunction;
		return packRendererObject; 
	}	

	packRendererObject.topicHoverNumber = function (topicNumber) {
	
		topicHover = topicNumber;
		if(rendered){
			render();
		}
		return packRendererObject; 
	}	
	
	//=================== PRIVATE VARIABLES ====================================
	
	var dataset = [];
		
	var svgWidth = 662.5; 
	var svgHeight = 662.5;
	var margin = {top: 50, right: 10, bottom: 20, left: 10},
	width = svgWidth - margin.right - margin.left,
	height = svgHeight - margin.top - margin.bottom;
	
	var topicHover = [];
	//==================== 'Constructor' code ====================

	var diameter = 662.5,
		format = d3.format(",d");

	var packLayoutGenerator = d3.layout.pack()
		.size([diameter - 4, diameter - 4])
		.value(function(d) { return d.n; })
		
	var svg = d3.select(targetDOMelement)
		.append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.append("g")
		.attr("transform", "translate(2,2)");

	var rendered = false;

	//=================== PRIVATE FUNCTIONS ====================================
	var leafLabel = function(d,i){
		//return 3 element array - one element for each label
		return ["leaf"+i, "", ""]
	}; 
	
	var parentLabel = function(d,i){return "parent "+i};
	
	var tooltip = function(d,i){return "tooltip text for "+i};
	
	var clickBehaviour = function (d,i) {console.log("clickBehaviour, d = ", d)};
	
	function render (){	

	
	console.log("topicHover in pack file: ",topicHover);
	//Mainly Bostock Code below

		//UPDATE 1


		//BIND DATA and GUP: ENTER
		//Create and transform group to hold circle and text
		var node = svg.datum(dataset)
			.selectAll(".node")
			.data(packLayoutGenerator.nodes)
			.enter()
			.append("g")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.on("click", clickBehaviour);

		node
			.append("circle")
			.attr("r", function(d) { return d.r; });

		node
			.append("title")
			.text(tooltip);

		//Filter out and process top level 0 node
		node
			.filter(function(d) { return d.depth===0; })
			.classed ("node level_0", true)
			.append("text")
				.attr("dy", function(d) {return -(d.r-10); })
				.style("text-anchor", "middle")
				.text(parentLabel);
				
		//Filter out and process level 1 nodes
		node
			.filter(function(d) { return d.depth===1; })
			.classed ("node level_1", true)
			.append("text")
				.attr("dy", function(d) {return -(d.r+5); })
				.style("text-anchor", "middle")
				.text(parentLabel);

		//Filter out and process leaf nodes
		var leaves = node
			.filter(function(d) { return !d.children; })
			.classed ("node leaf", true)
			.on("mouseover",function(d) {
				d3.select(this).classed("hover", true);
			})
			.on("mouseout",function(d) {
				d3.select(this).classed("hover", false);
			});
		
		svg.selectAll('.leaf')
			.selectAll("circle")
			.classed("hover",function(d)
			{
				//console.log("d: ",d, "topicHover: ",topicHover);
					for(var i = 0; i < topicHover.length; i++)
					{
						if(d.value === topicHover[i])
						{
							return true;
						}
						return false;
					}	 
			});
		svg.selectAll('.leaf')
			.selectAll("circle")
			.on("mouseover",function(d) {
				d3.select(this).classed("hover", true);
			})
			.on("mouseout",function(d) {
				d3.select(this).classed("hover", false);
			});

		leaves
			.append('text')
				.attr('transform', 'translate(0, -10)')
				.text(leafLabel)
				.call(wrapTextSvg, 20);

		//GUP: EXIT

		rendered = true;				
	}  
	
	return packRendererObject; 
} 