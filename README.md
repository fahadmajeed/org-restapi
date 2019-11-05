# Organizations API 

Organizations' CRUD REST API app built in NodeJS, Express and (MongoDB Atlas)

Reason to choose MongoDB Atlas is because it allows us to use mongoDB without having to install it on our machines, 
autoscales it automatically in a cluster and works as a cloud service. Mongo Atlas hosts our DB and we can connect 
to it from anywhere. 

## Requirements

For development, you will only need Node.js, express and a node global package, NPM, installed in your environement.


## Install

    $ git clone https://github.com/fahadmajeed/org-restapi
    $ cd org-restapi
    $ npm install


## Running the project

    $ npm start

## Deployment on AWS cloud
This project is containerized and deployed to AWS Cluster using ECR. 
You can access http://ec2-52-50-79-48.eu-west-1.compute.amazonaws.com/ as Base URL 
and get a list of all orgs as http://ec2-52-50-79-48.eu-west-1.compute.amazonaws.com/api/v1/orgs in the browser.
Subsequently you can run all end points against this base URL.

# Organizations' API End points
##List all orgs

## GET /api/v1/orgs
Gets a list of all organizations in the system
***response***
```
[
    {
        "_id": "5dbf6a131ae0370d3574188f",
        "name": "ABC",
        "founded": 1990,
        "revenue": "30000"
    },
    ...
]
```
## GET /api/v1/orgs/:orgId
Get complete detail of an organization with its parent organization and all children orgs 

**URL Parameters**
:orgId should be replaced with an id (_id) in URL with actual ID of the organization we want to see details of.
**Response**

```
{
    "data": {
        "name": "Google",
        "founded": 1995,
        "revenue": "15000",
        "parentCompany": {
            "_id": "5dbf6a131ae0370d3574188f",
            "name": "ABC",
            "founded": 1990,
            "revenue": "30000"
        },
        "children": []
    }
}
```
## GET /api/v1/orgs/:orgId/children
Get childrens of an organization provided with an ID in URL params denoted by :orgId

**URL Parameters**
:orgId should be replaced with an id (_id) in URL with actual ID of the organization we want to see details of.
**Response**

e.g, 
`GET /api/v1/orgs/5dbf6a131ae0370d3574188f/children` will yield below response in an array
```
[
    {
        "_id": "5dbf6c7960e0d20d8ba181e4",
        "name": "Google",
        "founded": 1995,
        "revenue": "15000",
        "parent": "5dbf6a131ae0370d3574188f",
        "__v": 0
    }
]
```
## GET /api/v1/orgs/:orgId/parent
Get parent organization of an organization provided with an ID in URL params

**URL Parameters**
:orgId should be replaced with an id (_id) in URL with actual ID of the organization we want to see details of.
**Response**

e.g, 
`GET /api/v1/orgs/5dbf6c7960e0d20d8ba181e4/parent` will yield below response in an array
```
{
    "_id": "5dbf6a131ae0370d3574188f",
    "name": "ABC",
    "founded": 1990,
    "revenue": "30000",
    "__v": 0
}
```
## POST /api/v1/orgs
Create a new organization resource

***Post Body***
Make sure content type is JSON in postman or in request setup of client app. Also raw should be selected in Postman
e.g,
`{"name": "Sample Org name", "founded": "2010", "revenue":"40000", "parent": null }`
You can specify parent of this org by providing _id of parent organization or you can completely skip it in 
post body

**Response**

```
{
    "message": "Organization created",
    "createdOrganization": {
        "_id": "5dc0a3f97cf07b20f3c53c1a",
        "name": "Sample Org",
        "founded": 2000,
        "revenue": "2000000",
        "__v": 0
    }
}
```
## PATCH /api/v1/orgs/:orgId
Updates an organization in patch mode
**URL Parameters**
:orgId should be replaced with an id (_id) in URL with actual ID of the organization we want to see details of.

***Patch Body***
Make sure content type is JSON in postman or in request setup of client app.
e.g,
`{"name": "Sample Org name", "founded": "2010", "revenue":"40000", "parent": null }`
You can specify parent of this org by providing _id of parent organization or you can completely skip it in 
post body

**Response**
In case of success, response like following will appear. 
```
{
    "n": 1,
    "nModified": 1,
    "opTime": {
        "ts": "6755581968575889409",
        "t": 1
    },
    "electionId": "7fffffff0000000000000001",
    "ok": 1,
    "operationTime": "6755581968575889409",
    "$clusterTime": {
        "clusterTime": "6755581968575889409",
        "signature": {
            "hash": "QS68/z85J3NYgfeWkNIMoy9aXGI=",
            "keyId": "6754009967595880450"
        }
    }
}
```
Otherwise an error with message should appear.

## DELETE /api/v1/orgs/:orgId
Deletes an organization with ID provided in URL Param
**URL Parameters**
:orgId should be replaced with an id (_id) in URL with actual ID of the organization we want to delete.

**Response**
In case of successful deletion, response like following will appear. 
For a request like 
DELETE api/v1/orgs/5dc099126ddd2a1fe41fc8dc
```
{
    "message": "Organization with id 5dc099126ddd2a1fe41fc8dc deleted"
}
```
Otherwise an error with message should appear.

