const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Organization = require('../models/organizations')

router.get('/', (req, res) => {
    Organization.find()
    .select('_id name founded revenue parent')
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    })
});

router.post('/', (req, res) => {

    if(req.body.founded < 1800 || req.body.founded > new Date().getFullYear()) {
        res.status(400).json({
            message: 'Bad request. Founded year can not be less than 1800 or greater than current year'
        });
    } else {
        Organization.find({name: req.body.name}).exec()
        .then(found => {
            if (found.length) {
                res.status(500).json({
                    message: 'Organization with name ' + req.body.name + ' already exists'
                })
            }
            else {
                const organization = new Organization({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    founded: req.body.founded,
                    revenue: req.body.revenue,
                    parent: req.body.parent
                });
                organization.save()
                .then((result) => {
                    res.status(201).json({
                        message: 'Organization created',
                        createdOrganization: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: err.message
                    })
                })
            }
            
        })
        .catch(err=> {
            console.log('error in non dup', err.message);
            res.status(500).json({
                message: err.message
            })
        })
        
    }
    
});

router.get('/:orgId', (req, res) => {
    const id = req.params.orgId;
    let response = {'data': {} };
    Organization.findById(id).select('_id name founded revenue parent').exec()
    .then(result => {
        if(result) {
            //collect parent object if any
            const parentId = result.parent;
            const filteredKeys = {name: result.name, founded: result.founded, revenue: result.revenue }
            response['data'] = {...filteredKeys};
            return Organization.findById(parentId).select('_id name founded revenue parent').exec()
        } else {
            res.status(404).json({
                message: 'No organization found with this id ' + id
            })
        }
    })
    .then(parent => {
        if (parent) {
            response['data']['parentCompany'] = parent;
        }
        return Organization.find({parent: id}).select('_id name founded revenue parent').exec()
    })
    .then(kids => {
        response['data']['children'] = kids;
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    })
});
router.get('/:orgId/parent', (req, res) => {
    const id = req.params.orgId;
    Organization.findById(id).exec()
    .then(result => {
        if(result) {
            const parentId = result.parent;
            Organization.findById(parentId).exec()
            .then(parentOrg => {
                if(parentOrg) {
                    res.status(200).json(parentOrg);
                }
                else {
                    res.status(404).json({
                        message: 'No parent found for id ' + id
                    })
                }
            })
            .catch(err => {
                res.status = 500;
                res.json({
                    message: err.message
                })
            });
        } else {
            res.status(404).json({
                message: 'No organization found for id ' + id
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    })
});
router.get('/:orgId/children', (req, res) => {
    const id = req.params.orgId;
    Organization.findById(id).exec()
    .then(result => {
        if (result) {
            return Organization.find({parent: id}).exec()
        } else {
            res.status(404).json({
                message: 'No organization with id' + id + ' was found'
            })
        }
    })
    .then(kids => {
        if (kids.length >= 0) {
            res.status(200).json(kids)
        } else {
            res.status = 404;
            res.status(404).json({
                message: 'No child organizations found for id ' + id
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Something went wrong finding child organizations of id ' + id
        })
    });
});

router.delete('/:orgId', (req, res, next) => {
    const id = req.params.orgId;
    //first delete child organizations
    Organization.remove({parent: id}).exec()
    .then(kids => {
        Organization.remove({_id: id}).exec()
        .then(result => {
            res.status(200).json({
                message: 'Organization with id ' + id + ' deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        });
    })
    
});
router.patch('/:orgId', (req, res) => {
    const id = req.params.orgId;
    const updateParts = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateParts[key] = value;
    }
    Organization.update({_id: id}, {$set: updateParts})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        });
    })
});
module.exports = router;