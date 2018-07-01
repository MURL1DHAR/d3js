/*
///////////////////////////////////////////////////////////////////////
//
// Module           : processTree.js
// Author           : Murlidhar Fichadia
// Date             : 09/11/16
// Function of code :
//  Initializes Tree Chart
//  Contains methods to manipulate data for Tree Chart
//  Contains methods for Click and Hover interaction
//
//  % of code written by Me                : 100%
//  % of code taken from lab examples      : 00%
//  % of code taken from bostock's examples: 00%
//
///////////////////////////////////////////////////////////////////////
*/

"use strict" //This catches acidental global declarations

function processTree(){

	var processtree = {};

	processtree.initializeTree = function () 
    {
    	treeData = d3.nest()
        .key(function(d) 
        {
            return d.Country;
        })
        .key(function(d) 
        {
            return d.City;
        })
        .entries(Organisations);
    	treeChart.loadAndRenderNestDataset(treeData, "Countries");
        
    }

    processtree.treeClick = function(d, i) 
    {
	    processtree.pieOrganisation(d.OrgID);
	    console.log(d.OrgID);
	    document.getElementById("uniTitle").innerHTML = OrgGrants[0].Name;
	    console.log(OrgGrants);
	    pieChart.loadDataset(OrgGrants[0].grants).render();
	    processtree.getTopicNumber(d.ID);
	    packChart.topicHoverNumber(topicArr);
	    topicArr = [];
   
	}

	processtree.getTopicNumber = function (grantID) 
	{
        TopicDist.forEach(function(topic) 
        {
            for(var i=0; i < topic.length; i++)
            {
                if(topic[i].docID === grantID)
                {
                    topicArr.push(i);
                }
            }
           return topicArr;
        });

    }

    processtree.pieOrganisation = function(org) 
    {
	    OrgGrants = GOP.organisations.filter(function(organ) 
        {
	        return organ.OrgID === org;
	    });
	}

    return processtree;
}