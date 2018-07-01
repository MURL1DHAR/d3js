/*
///////////////////////////////////////////////////////////////////////
//
// Module           : grantAndTopicDataHelperFunctions.js
// Author           : Mike Chantler
// Date             : 01/11/16
// Function of code :
//	Collected bunch of methods that join some of the tables in the
//  grants and topics datasets together etc
//
//
//  % of code written by Me                : 00%
//  % of code taken from lab examples      : 100%
//  % of code taken from bostock's examples: 00%
//
///////////////////////////////////////////////////////////////////////
*/

"use strict" //This catches acidental global declarations

function grantAndTopicDataHelperFunctions(){

	var helpers = {};

	helpers.insertOrganisationsIntoGrantsTable = function (grantsData)
	{
		//Function to combine organisations into grants table
		//It inserts 'organisation' ref to a grant's organisation obj
		//in each grant obj		
		function getOrgByID(ID)
		{
			var organisation=grantsData.organisations.find(function(org)
			{
				return org.OrgID === ID
			})
			return organisation
		}		

		grantsData.grants.forEach(function(grant)
		{
			grant.organisation = getOrgByID(grant.OrgID)
		})	

	}

	helpers.insertPIpersonsIntoGrantsTable = function (grantsData)
	{
		//Function to combine person records into grants table
		//It inserts ref to persons obj coresponding to The PIID number in the grant
		//(this is the ID of the person who is the Principle Investigator on the grant)
		//in each grant obj	as a "PI" attribute	
		function getPersonByID(ID)
		{
			var person=grantsData.persons.find(function(person)
			{
				return person.ID === ID
			})
			return person;
		}		

		grantsData.grants.forEach(function(grant)
		{
			grant.PI = getPersonByID(grant.PIID)
		})	

	}

	helpers.insertGrantListsIntoPersonsTable = function (grantData)
	{
		//Link persons back to grants by providing a 
		//'grants' field in each persons record that contains 
		//a array of grant objects (strictly an array of references to grant objects)
		
		persons=grantData.persons;
		grants=grantData.grants;		
		persons.forEach(function(person)
		{
			person.grants=grants.filter(function(grant)
			{
				
				function personIsInvestigator(investigator)
				{
					return investigator.ID === person.ID
				}	
				return (grant.Investigators.some(personIsInvestigator));
			})
			person.nGrants = person.grants.length;	
		}) 
		console.log(persons)	
	}


	helpers.getGrantObjsByID = function (arrayOfIDs, grantsData)
	{
		//Given an array of grant object 'ID' 
		//returns array of those grant objects
		var grants = grantsData.grants;
		function grantInIdList(grant)
		{
			//console.log(grant)
			return arrayOfIDs.some(function(id)
			{
				return grant.ID === id
			})
		}
		return grants.filter(grantInIdList);
	}

	helpers.getGrantObjsForATopic = function  (topicNumber, grantsData, topicData )
	{
		//Given a topic's number, return an array of the topic's grant objects
		var grantIds = helpers.getGrantsIdsForATopic(topicNumber, topicData);
		return helpers.getGrantObjsByID(grantIds, grantsData);
	}
		
	helpers.getGrantsIdsForATopic = function (topicNumber, topicData)
	{
		var grantIdList = topicData.topicsDocsDistrib[topicNumber]
			.map(function(topicDist){
						return topicDist.docID 
				})
		return grantIdList;	
	}

	helpers.wordcloud = function (topicNumber, topicData)
	{
		return topicData.topics[topicNumber].map(function(word){return word.label})
	}


	return helpers;

}



















