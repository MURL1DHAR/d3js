/*
///////////////////////////////////////////////////////////////////////
//
// Module           : processPie.js
// Author           : Murlidhar Fichadia
// Date             : 09/11/16
// Function of code :
//  Initializes Pie Chart
//  Contains methods to manipulate data for Pie Chart
//  Contains methods for Click and Hover interaction
//
//  % of code written by Me                : 100%
//  % of code taken from lab examples      : 00%
//  % of code taken from bostock's examples: 00%
//
///////////////////////////////////////////////////////////////////////
*/

"use strict" //This catches acidental global declarations

function processPie(){

	var processpie = {};


	processpie.initializePie = function () 
    {
        OrgGrants = GOP.organisations.filter(function(organ) 
        {
            return organ.OrgID === "40";
        });

        pieChart.loadDataset(OrgGrants[0].grants).render();
    }

    processpie.pieClick = function(d, i) 
    {
        processpie.updateTree(d.data.ResearchArea);
        treeChart.loadAndRenderNestDataset(treeData, d.data.ResearchArea);
        
    }

    processpie.pieHoverPack = function(d, i) 
    {
        console.log("hover from pie for Pack: ",d.data.ID);
        processpie.getTopicNumber(d.data.ID);
        console.log("topicArr from pie before: ",topicArr);
        packChart.topicHoverNumber(topicArr);
        topicArr = [];
    }

    processpie.updateTree = function (researchArea)
    {
        var researchTreeData =  Grants.filter(function(grant) 
        {
            return grant.ResearchArea === researchArea;
        });
        treeData = d3.nest().entries(researchTreeData);
    }

    processpie.getTopicNumber = function (grantID) 
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
    
	return processpie;

}