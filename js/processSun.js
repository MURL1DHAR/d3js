/*
///////////////////////////////////////////////////////////////////////
//
// Module           : processSun.js
// Author           : Murlidhar Fichadia
// Date             : 09/11/16
// Function of code :
//  Initializes Sun Chart
//  Contains methods to manipulate data for Sun Chart
//  Contains methods for Click and Hover interaction
//
//  % of code written by Me                : 100%
//  % of code taken from lab examples      : 00%
//  % of code taken from bostock's examples: 00%
//
///////////////////////////////////////////////////////////////////////
*/

"use strict" //This catches acidental global declarations

function processSun(){

	var processsun = {};


	processsun.initializeSun = function (orgGrants,allGrants) 
    {
    	
        var treeData=
        d3.nest()
            .key(function(d){ return d.ResearchArea})
            .key(function(d){return d.Scheme})
            .key(function(d){return d.Department})
            .entries(orgGrants);
        
        var treeData2=
        d3.nest()
            .key(function(d){ if(d.ResearchArea == treeData[0].key) return d.ResearchArea})
            .key(function(d){return d.Scheme})
            .key(function(d){return d.Department})
            .entries(allGrants);
        
        console.log("tree2: ",treeData2);
        if(treeData2[0].key=="undefined") 
        {
            treeData2.reverse();
        }
        treeData2.pop();
        
        return treeData2;
    }

    return processsun;
}