/*
///////////////////////////////////////////////////////////////////////
//
// Module           : processBar.js
// Author           : Murlidhar Fichadia
// Date             : 09/11/16
// Function of code :
//  Initializes Bar Chart
//  Contains methods to manipulate data for Bar Chart
//  Contains methods for Click and Hover interaction
//
//  % of code written by Me                : 100%
//  % of code taken from lab examples      : 00%
//  % of code taken from bostock's examples: 00%
//
///////////////////////////////////////////////////////////////////////
*/

"use strict" //This catches acidental global declarations

function processBar()
{

	var processbar = {};


	processbar.initializeBar = function ()
    {

	var res = {};

    res = Object.keys(Grants.reduce((res, curr) => {
        res[curr.organisation.OrgID] = res[curr.organisation.OrgID] || {
            OrgID: curr.organisation.OrgID,
            Name: curr.organisation.Name,
            Country: curr.organisation.Country,
            Value: 0
        };
        res[curr.organisation.OrgID].Value += parseInt(curr.Value);
        return res;
    }, res)).map(key => res[key]);


    function isBigEnough(element, index, array) 
    {
        return (element.Country >= "Scotland");
    }

    OrgVal = res.filter(isBigEnough);
    barChart.loadDataset(OrgVal).render();
    document.getElementById("uniTitle").innerHTML = "Heriot-Watt University";

	}

    processbar.barClick = function(d, i) 
    {

        processbar.pieOrganisation(d.OrgID);
        document.getElementById("uniTitle").innerHTML = OrgGrants[0].Name;
        pieChart.loadDataset(OrgGrants[0].grants).render();

    }

    processbar.barOrgGrants = function (country) 
    {
        BarOrgGrants = Organisations.filter(function(organ) 
        {
            if(country === "N. Ireland" || country === "Ireland")
            {
                return organ.Country === "Northern Ireland";
            }
            else
            {
                return organ.Country === country;
            }
        });
    }

    processbar.calOrgVal = function (country) 
    {

        var res = {};

        res = Object.keys(Grants.reduce((res, curr) => {
            res[curr.organisation.OrgID] = res[curr.organisation.OrgID] || {
                OrgID: curr.organisation.OrgID,
                Name: curr.organisation.Name,
                Country: curr.organisation.Country,
                Value: 0
            };
        res[curr.organisation.OrgID].Value += parseInt(curr.Value);
            return res;
        }, res)).map(key => res[key]);

        function isBigEnough(element, index, array) 
        {
            return (element.Country >= country);
        }

        OrgVal = res.filter(isBigEnough);
    }

    processbar.pieOrganisation = function(org) 
    {
        OrgGrants = GOP.organisations.filter(function(organ) 
        {
            return organ.OrgID === org;
        });
    }

    
	return processbar;

}