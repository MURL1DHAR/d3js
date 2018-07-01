/*
///////////////////////////////////////////////////////////////////////
//
// Module           : Pie Renderer Class
// Author           : Murlidhar Fichadia
// Date             : 01/11/16
// Function of code :
//	This JavaScript module implements a simple donut Chart in D3.js
//	It adds an svg to the targetDOMelement where it renders the chart
//  The dataset is expected to be an array of objects. Each object 
//	comprising a 'key' and 'value' attributes.
//
//  % of code written by Me				   : 70%
//  % of code taken from lab examples      : 30%
//  % of code taken from bostock's examples: 00%
//
//
//	Usage:
//	render  					: renders or executes updateScales(), GUP_bars(), Tooltip()
//	Load dataset 				: loads data
//  layoutData 					: generates arc layout data
//	pieClickCallback function 	: callback function overwrite's pieClick
//  pieHoverCallback function 	: callback function overwrite's pieOverPack
//
//	Credits
//	Code adapted from F20DV - Lab Examples 
//	Author of the code: Mike Chantler
///////////////////////////////////////////////////////////////////////
*/

"use strict"


function piechart(targetDOMelement) { 

	var piechartObject = {};
	
	//=================== PUBLIC FUNCTIONS =========================
	
	piechartObject.render = function () {
		render();
		return piechartObject;
	}
	
	piechartObject.loadDataset = function (d) {
		dataset=d;
		return piechartObject;
	}

	piechartObject.layoutData = function () {
		return arcLayoutData;
	}	

	piechartObject.pieClickCallback = function (callback) {
		pieClicked = callback;
		return piechartObject;
	}

	piechartObject.pieHoverCallback = function (callback) {
		pieOverPack = callback;
		return piechartObject;
	}

	//=================== PRIVATE VARIABLES ====================================
		//Width and height of svg canvas
	var w = 270;
	var h = 270;
	
	var dataset = [];
			
	var outerRadius;
	var innerRadius;

	var formatNumber = d3.format(",d");
	var arcShapeGenerator = d3.svg.arc();
	
	var pieLayoutGenerator = d3.layout.pie();
		

	var color = d3.scale.ordinal()
		.range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd",
			    "#ccebc5","#bfdbdb","#67c063","#240c12","#34ee30","#35bab2","#345496","#e69941","#cc73e2","#ad4b50",
				"#984024","#94fd2e","#f98cac","#8abd16","#17e866","#abf63d","#78658c","#3d63f7","#e87af9","#1edcb2",
				"#3351fa","#aa19df","#919772","#3dbd0a","#6b29f9","#d0b214","#d10550","#7b2943","#845ec6","#f4a7cf",
				"#cd6e57","#67d4bf"  
			   ]);

	var svg = d3
		.select(targetDOMelement)
		.append("svg");
		
	var grp = svg	
		.append("g");
	
	var arcLayoutData;

	
	//=================== PRIVATE FUNCTIONS ====================================

	var pieOverText = function (d,i)
	{
		console.log(d.data);
		d3.select(this).classed("active", true);

		document.getElementById("grantTitle").innerHTML = d.data.Title;
		document.getElementById("grantValue").innerHTML = formatNumber(d.data.Value);
		document.getElementById("rArea").innerHTML = d.data.ResearchArea;
		document.getElementById("pInvestigator").innerHTML = d.data.PI.Surname;

	}
	
	var pieOverPack = function (d,i)
	{
		console.log("pie to Pack: ", d);
	}

	var pieClicked = function (d,i)
	{
		console.log("clicked by pie");
	}

	function render()
	{
		
		arcLayoutData=pieLayoutGenerator(dataset);

		pieLayoutGenerator.value(function(d) {
			return d.Value; 
		});
		GUP_Arcs(arcLayoutData, grp);	
	}
	

	function resize(){
		outerRadius = w/2;
		innerRadius = w/5;

		arcShapeGenerator
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);		
		svg
			.attr("width", w)
			.attr("height", h);			
		grp 
			.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
			
		render();
	}	

	function GUP_Arcs (layoutData, _grp){
		

		//BIND DATA
		var arcs = _grp.selectAll("path")
			.data(layoutData);
		
		//GUP: UPDATE 1
		
		//GUP: ENTER: Add paths for new arcs
		arcs
			.enter()
			.append("path")
			.style("opacity",0.0);
		
		//GUP: UPDATE 2 [= UPDATE 1 + ENTER] 
		//Define shape and colour
		arcs
			.transition()
			.duration(3000)
			.attr("d", arcShapeGenerator)
			.style("opacity",1.0)
			.attr("fill", 
				function(d, i) 
				{
					return color(i)
				});
		
		arcs
			.on('mouseover', function(d,i){
			pieOverText(d,i);
			pieOverPack(d,i);
			d3.select(this).classed("active", true)
		})
		.on("mouseout",function highlight(d) 
        {
        	d3.select(this).classed("active", false)
        })
        .on("click",pieClicked);
		
		
		//GUP: EXIT: Remove old arcs
		arcs.exit()
			.remove()
			.transition()
			.duration(2000)
			.style("opacity",0.0);
	}	

	resize();	
		
	return piechartObject;
	
}