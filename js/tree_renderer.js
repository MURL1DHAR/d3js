/*
///////////////////////////////////////////////////////////////////////
//
// Module           : Tree Class
// Author           : Murlidhar Fichadia
// Date             : 01/11/16
// Function of code :
//	This JavaScript module implements a simple tree in D3.js
//	It adds an svg to the targetDOMelement where it renders the tree
//  The dataset is expected to be a nested hierarchy objects. Each object 
//	comprising of parent and child objects.
//
//  % of code written by Me				         : 40%
//  % of code taken from lab examples      : 30%
//  % of code taken from bostock's examples: 30%
//
//
//  Usage:
//  loadAndRenderDataset            : renders or executes data and visual element
//  loadAndRenderNestDataset        : loads and renders data but in hierarchy format.
//  treeClickCallback               : callback function overwrite's treeClick
//
//  Credits
//  Code adapted from F20DV - Lab Examples 
//  Author of the code: Mike Chantler
//
//  Code adapted from D3js.Org website
//  Source : https://bl.ocks.org/mbostock/4339083
//  Author : Mike Bostock
///////////////////////////////////////////////////////////////////////
*/

"use strict" //To catch accidental global declarations


function treechart(targetDOMelement) { 

	var treechartObject = {};
	
	//=================== PUBLIC FUNCTIONS =========================
	
	treechartObject.loadAndRenderDataset = function (d) {
		dataset=d;
		render();
    return treechartObject;
	}

  treechartObject.loadAndRenderNestDataset = function (data, rootName = "") {
    myTreeGenerator.children(function(d) {return d.values;} )
    dataset = {"key": rootName, "values": data};
    render();
    return treechartObject;
  } 

	treechartObject.treeClickCallback = function (callback) {
    treeClick=callback;
    return treechartObject;
  }
	
	//=================== PRIVATE VARIABLES =========================
	
	var dataset;
	var margin = {top: 20, right: 120, bottom: 20, left: 10},
    width = 660 - margin.right - margin.left,
    height = 662.5 - margin.top - margin.bottom;

  var formatNumber = d3.format(",d");
	var i = 0,
	    duration = 750,
	    root;

	var tree = d3.layout.tree()
	    .size([height, width]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select(targetDOMelement).append("svg")
	    .attr("width", width + margin.right + margin.left)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var myTreeGenerator = d3.layout.tree().size([width, height]);

		
	//=================== PRIVATE FUNCTIONS ====================================

  var treeClick = function (d,i)
  {
    console.log ("Tree: ",d);  
  }

	function render () 
	{	

    console.log("Tree Current Dataset: ",dataset);
    var myNodeLayout = myTreeGenerator.nodes(dataset);
      myNodeLayout.forEach(function(d) { d.y = d.depth * 200; });
  
    var myLinks = myTreeGenerator.links(myNodeLayout);  

		console.log("tree: ",dataset);
		root = dataset;
		root.x0 = height / 2;
		root.y0 = 0;

		function collapse(d) 
    {
		  if (d.children) 
      {
		    d._children = d.children;
		    d._children.forEach(collapse);
		    d.children = null;
		  }
		}

		  root.children.forEach(collapse);
		  update(root);
	}
	
function update(source) {

  //BIND DATA
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  //GUP: UPDATE 1
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  //GUP: ENTER
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("mouseover", click)
      .on("click",treeClick);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "#00ff00" : "#000"; });

  nodeEnter.filter(function(d){return d.key}).append("text")
      .attr("x", 13)
      .attr("text-anchor", "start")
      .text(function(d) {return d.key;}); 

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -7 : 7; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return  d.Name || "V: "+formatNumber(d.Value) +" (O: "+d.OrgID+")"+" (G: "+d.grant+")"; })
      .style("fill-opacity", 1e-6);

  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "#FFFFFF" : "#3B1E0E"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  //GUP: EXIT
  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) 
      {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  nodes.forEach(function(d) 
  {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

  function click(d) 
  {
    if (d.children) 
    {
      d._children = d.children;
      d.children = null;
    } else 
    {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }

	return treechartObject;
}