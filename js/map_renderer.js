/*
///////////////////////////////////////////////////////////////////////
//
// Module           : Map Class
// Author           : Murlidhar Fichadia
// Date             : 01/11/16
// Function of code :
//	This JavaScript module implements uk map and plots university location 
//  points in D3.js It adds an svg to the targetDOMelement where it renders
//	the map. The dataset is expected to be an array of objects. Each object
//  comprising a 'key' and 'value' attributes. 
//
//  % of code written by Me                : 50%
//  % of code taken from lab examples      : 30%
//  % of code taken from bostock's examples: 20%
//
//
//  Usage:
//  render                      : renders or executes GUP_labels(), processData()
//  Load dataset                : loads data
//  mapClickCallback function   : callback function overwrite's mapClick
//  mapHoverCallback            : callback function overwrite's mapHover
//  mapTreeHoverCallback        : callback function overwrite's mapTreeHover
//
//  Credits
//  Code adapted from F20DV - Lab Examples 
//  Author of the code: Mike Chantler
//
//  Code adapted from D3js.Org website
//  Source : https://bl.ocks.org/mbostock/2206590
//  Author : Mike Bostock
///////////////////////////////////////////////////////////////////////
*/

"use strict"


function mapchart(targetDOMelement) { 

    var mapchartObject = {};
    
    //=================== PUBLIC FUNCTIONS =========================
    
    mapchartObject.render = function () {
        render();
        return mapchartObject;
    }
    
    mapchartObject.loadDataset = function (d) {
        dataset=d;
        return mapchartObject; 
    }

    mapchartObject.mapClickCallback = function (callback) {
        mapClick = callback;
        return mapchartObject;
    }

    mapchartObject.mapHoverCallback = function (callback) {
        mapHover = callback;
        return mapchartObject;
    }

    mapchartObject.mapTreeHoverCallback = function (callback) {
        mapTreeHover = callback;
        return mapchartObject;
    }
    
    //=================== PRIVATE VARIABLES =========================
    
    var dataset = [];
    var width = 530,
        height = 720,
        centered = null;

    var subunits;
    var grantOrgIDs = [];
    var GUniArr = [];
    var nGrants;
    
    var projection = d3.geo.albers();
                           
    var diagonal = d3.svg.diagonal();
                         
    var pathGen = d3.geo.path();
                        
    var map = d3.select("#mapChart")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);
    var g = map.append("g");

    //Create a tooltip for on hover infromation display
    var tooltip = d3.select('body')
                    .append('div')
                    .attr('class', 'hidden tooltip');
    
    //=================== PRIVATE FUNCTIONS ====================================
    
    var mapClick = function (d,i)
    {
        console.log(d);
    }

    var mapHover = function (d,i)
    {
        console.log(d);
    }

    var mapTreeHover = function (d,i)
    {
        console.log(d);
    }
    
    function render () 
    {   
        processData();
        GUP_labels();
    }
    
    function processData(){
            
            projection
                    .center([0, 55])
                    .rotate([4.4, 0])
                    .parallels([50, 60]).scale(700 * 5)
                    .translate([width / 2, height / 2]);
            
            diagonal
                    .projection(function(d) 
                    {
                        return [d.y, d.x];
                    });
            
            pathGen
                    .projection(projection)
                    .pointRadius(2);

            subunits = topojson.feature(dataset.UK, UK.objects.subunits);
            
            nGrants = d3.nest().key(function(d) 
            {
                return d.OrgID;
            })
            .entries(dataset.Grants);
            
            nGrants.forEach(function(d) 
            {
                if (!contains(grantOrgIDs, d.key)) grantOrgIDs.push(
                    d.key);
            });
            
            dataset.Organisations.forEach(function(d) 
            {
                if (contains(grantOrgIDs, d.OrgID)) 
                {
                    GUniArr.push(d);
                }
            });
    }


    function GUP_labels(){
            //GUP : UPDATE 1

            //GUP : ENTER
            g.append("g").attr("id", "states")
                         .selectAll("path").data(subunits.features)
                         .enter()
                         .append("path")
                         .attr("d",pathGen)
                         .attr("class", function(d) 
                         { 
                            return "subunit " + d.id; 
                         })
                         .on("mouseover", function(d,i)
                         {
                            mapHover(d,i);
                            mapTreeHover(d,i);
                         })
                         .on("mousemove",function highlight(d) 
                         {
                            d3.select(this).classed("active", true)
                         })
                         .on("mouseout",function highlight(d) 
                         {
                            d3.select(this).classed("active", false)
                         })
                         .on("click",clicked);
            
            g.selectAll(".subunit-label")
                         .data(topojson.feature(dataset.UK, UK.objects.subunits)
                         .features)
                         .enter()
                         .append("text")
                         .attr("class", function(d) 
                         {
                            return "subunit-label " + d.id;
                         }).attr("transform", function(d) 
                         {
                            return "translate(" + pathGen.centroid(d) + ")";
                         }).attr("dy", ".35em")
                         .text(function(d) 
                         {
                            return d.properties.name;
                         }).attr("fill","#fff");
            
            g.selectAll("circle")
                        .data(GUniArr)
                        .enter() 
                        .append("circle")
                        .filter(function(d) 
                        {
                            return d.Country.match(/^(Scotland|Wales|England|Northern Ireland)$/);
                        }) 
                        .attr("transform", function(d) 
                        {
                            return "translate(" + projection([parseFloat(d.Longitude),parseFloat(d.Latitude)]) + ")";
                        })
                        .attr("r", function(d){

                            var randomGrant = d.grants[Math.floor(Math.random()*d.grants.length)];
                            //return console.log("randomGrant: ",randomGrant.Value);
                            return (randomGrant.Value)/100000+"px";
                        })
                        .attr("fill", "rgba(0, 0, 0, 0.7)")
                        .on('mousemove', function(d) 
                        {
                            var mouse = d3.mouse(map.node())
                                      .map(function(d) 
                                      {
                                        return parseInt(d);
                                      });

                                tooltip.classed('hidden', false)
                                       .attr('style','left:' + (mouse[0] + 700) + 'px; top:' +(mouse[1] +15) + 'px')
                                       .html(d.Name);
                        })
                        .on('mouseout', function() 
                        {
                            tooltip.classed('hidden', true);
                        })
                        .on("click", mapClick); 
            //GUP : UPDATE 2 [=UPDATE 1 + ENTER]

            //GUP : EXIT
    }
    
    
    function contains(array, obj) 
    {
        var i = array.length;
        while (i--) {
            if (array[i] === obj) {
                return true;
            }
        }
        return false;
    }

    function clicked(d) 
    {
            var x, y, k;
            if (d && centered !== d) {
                var centroid = pathGen.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 2.2;
                centered = d;
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
            }
            g.selectAll("path").classed("active", centered && function(d) {
                return d === centered;
            });
            g.transition().duration(750).attr("transform", "translate(" + width / 2 +
                "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -
                y + ")").style("stroke-width", 1.5 / k + "px");
        }

    
    
    return mapchartObject;
    
}