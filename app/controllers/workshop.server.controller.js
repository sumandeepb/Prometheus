/*
    Copyright (C) 2018 Sumandeep Banerjee
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* 
 * Prometheus: Online Tutorial Portal
 * Author: sumandeep.banerjee@gmail.com
 */

var config = require('../../config/config'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    mongoose = require('mongoose'),
    Workshop = mongoose.model('Workshop'),
    Promise = require('bluebird');

var getErrorMessage = function (err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

exports.render = function (req, res) {
    console.log("workshop.server.controller::render");
    res.render('workshop', {
        title: 'Prometheus Online Tutorial Portal',
        user: JSON.stringify(req.user)
    });
};

exports.create = function (req, res) {
    console.log("workshop.server.controller::create");
    var workshop = new Workshop(req.body);
    workshop.imgfile = req.body.imgfile;
    workshop.creator = req.user;
    console.log('workshop', workshop);
    workshop.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(workshop);
        }
    });
};

exports.list = function (req, res) {
    console.log("workshop.server.controller::list");
    Workshop.find().sort('-created')
        .populate('creator', 'name username email')
        .exec(function (err, workshop) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.json(workshop);
            }
        });
};

exports.read = function (req, res) {
    console.log("workshop.server.controller::read");
    res.json(req.workshop);
};

exports.workshopByID = function (req, res, next, id) {
    console.log("workshop.server.controller::workshopByID");
    Workshop.findById(id)
        .populate('creator', 'name username email')
        .exec(function (err, workshop) {
            if (err)
                return next(err);

            if (!workshop)
                return next(new Error('Failed to load workshop ' + id));

            req.workshop = workshop;
            next();
        });
};

exports.update = function (req, res) {
    console.log("workshop.server.controller::update");

    var workshop = req.workshop;

    //console.log('workshop', workshop);
    workshop.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(workshop);
        }
    });
};

exports.delete = function (req, res) {
    console.log("workshop.server.controller::delete");
    var workshop = req.workshop;
    var imgPath = [__dirname, '..', '..', config.workshopsPath, workshop.imgfile].join('/');
    fs.unlink(imgPath, function (err) {
        if (err) {
            console.log('failed deleting ', imgPath);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            console.log('successfully deleted ', imgPath);
            workshop.remove(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.json(workshop);
                }
            });
        }
    });
};
