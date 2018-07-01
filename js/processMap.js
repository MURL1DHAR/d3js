/*
///////////////////////////////////////////////////////////////////////
//
// Module           : processMap.js
// Author           : Murlidhar Fichadia
// Date             : 09/11/16
// Function of code :
//  Contains methods to manipulate data for Map Chart
//  Contains methods for Click and Hover interaction
//
//  % of code written by Me                : 100%
//  % of code taken from lab examples      : 00%
//  % of code taken from bostock's examples: 00%
//
///////////////////////////////////////////////////////////////////////
*/

"use strict" //This catches acidental global declarations

function processMap(){

	var processmap = {};

	processmap.mapClick = function(d, i) 
	{
	    processmap.pieOrganisation(d.OrgID);
	    document.getElementById("uniTitle").innerHTML = OrgGrants[0].Name;
	    pieChart.loadDataset(OrgGrants[0].grants).render();
	    console.log("orgGrants: ",OrgGrants[0].grants);
    	
	    var org = sunHelper.initializeSun(OrgGrants[0].grants,Grants);
    	console.log("org: ",org);
    	sunChart.loadDataset(org).render();

	}

	processmap.mapHover = function(d, i) 
	{
		console.log("d: ",d);
	    barHelper.barOrgGrants(d.properties.name);
	    barHelper.calOrgVal(d.properties.name);
	    barChart.loadDataset(OrgVal);
	    barChart.render();
	}

	processmap.mapTreeHover = function(d, i) 
	{
	    processmap.updateTree(d.properties.name);
	    treeChart.loadAndRenderNestDataset(treeData, d.properties.name);
	}

	processmap.updateTree = function (country)
	{
	    var countryData = BarOrgGrants;
	    
	    treeData = d3.nest()
	        .key(function(d) {
	            return d.City;
	        })
	        .entries(countryData);
	}

    processmap.pieOrganisation = function(org) 
    {
        OrgGrants = GOP.organisations.filter(function(organ) {
            return organ.OrgID === org;
        });
    }

    return processmap;
}