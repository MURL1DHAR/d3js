/*
///////////////////////////////////////////////////////////////////////
//
// Module           : processPack.js
// Author           : Murlidhar Fichadia
// Date             : 09/11/16
// Function of code :
//  Initializes Pack Chart
//  Contains methods to manipulate data for Pack Chart
//  Contains methods for Click and Hover interaction
//
//  % of code written by Me                : 40%
//  % of code taken from lab examples      : 60%
//  % of code taken from bostock's examples: 00%
//
///////////////////////////////////////////////////////////////////////
*/

"use strict" //This catches acidental global declarations

function processPack(){

	var processpack = {};
	var div = d3.select("body").append("div");

	processpack.setUpPackRenderer = function (div) 
	{

	    //function returns a customised pack renderer
	    return packRenderer(div)
	        .overideClickBehaviour(function(d) 
	        {
	            if (!d.children) d3.select("#userUpdateDIV").html(processpack.topicInfo(d.n))
	        })
	        .overideLeafLabel(function(d) 
	        {
	            //if big circle return 3 words
	            if (d.r > 25) {
	                return d.words[1] +
	                    " " + d.words[0] +
	                    " " + d.words[2];
	            }
	            //else return 1 word
	            else {
	                return d.words[0];
	            }
	        })
	        .overideParentLabel(function(d) 
	        {
	            return ""
	        })
	        .overideTooltip(function(d) 
	        {
	            if (d.words) return d.name + " " + d.words;
	            else return d.name;
	        })
	        .topicHoverNumber([]);
	}

	processpack.topicInfo = function(topicNumber) 
	{
	    var grants = hlp.getGrantObjsForATopic(topicNumber, GOP, TOPIC);
	    var all = new Array();
	    var arrayLength = grants.length;
	    for (var i = 0; i < arrayLength; i++) 
	    {
	        all[i]=grants[i].OrgID; 
	    }
	    
	    var randOrgID = all[Math.floor(Math.random() * all.length)];

	    processpack.pieOrganisation(randOrgID);
	    document.getElementById("uniTitle").innerHTML = OrgGrants[0].Name;
	    pieChart.loadDataset(OrgGrants[0].grants).render();
	    
	    packGrants = Grants.filter(function(grant) 
	    {
	            for(var i = 0; i < all.length; all++)
	            {
	                return grant.OrgID === all[i];
	            }
	    })
	    treeData = d3.nest()
	        .key(function(d) 
	        {
	            return d.PI.Surname;
	        })
	        .entries(packGrants);

	    treeChart.loadAndRenderNestDataset(treeData, "Topic: "+topicNumber);
	    
	    div.attr("class", "tooltip");

		
	    return "<h3>Topic " 
			    + topicNumber 
			    + "</h3> <p> " 
			    + hlp.wordcloud(topicNumber, TOPIC) 
			    + "</p>" 
			    + "<p>More detail of grants on console</p>";
	}


	processpack.clusterIntoGroups = function (minNumberGroups, linkageTable) 
	{
    
	    var topNode = linkageTable.length - 1;
	    nLeaves = linkageTable.length + 1;


	    function expandNodes(nodesToExpand, groups, nLeaves, linkageTable) 
	    {
	    
	        var nodesRequiringExpansion = [];
	        nodesToExpand.forEach(function(currentNode) 
	        {
	            if (currentNode >= 0) {
	                var index = groups.indexOf(currentNode);
	                groups.splice(index, 1);
	    
	                var g1 = linkageTable[currentNode].cluster1 - nLeaves;
	                var g2 = linkageTable[currentNode].cluster2 - nLeaves;
	                groups.push(g1);
	                groups.push(g2);

	                if (g1 >= 0) nodesRequiringExpansion.push(g1);
	                if (g2 >= 0) nodesRequiringExpansion.push(g2);
	            }

	        })
	        return {
	            "groups": groups,
	            "nodesRequiringExpansion": nodesRequiringExpansion
	        }
	    }

	    var expansion = {
	            "groups": [],
	            "nodesRequiringExpansion": [topNode]
	        }
	        while (expansion.groups.length < minNumberGroups) 
	        {
	        expansion = expandNodes(expansion.nodesRequiringExpansion, expansion.groups, nLeaves, linkageTable)
	    };
	    return expansion.groups;
	}

	processpack.pieOrganisation = function(org) 
    {
        OrgGrants = GOP.organisations.filter(function(organ) 
        {
            return organ.OrgID === org;
        });
    }


    return processpack;
}