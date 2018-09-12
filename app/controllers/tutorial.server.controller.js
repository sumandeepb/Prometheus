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
    path = require('path'),
    uuid = require('node-uuid'),
    targz = require('targz'),
    rimraf = require('rimraf'),
    mongoose = require('mongoose'),
    Tutorial = mongoose.model('Tutorial'),
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
    console.log("tutorial.server.controller::render");
    res.render('tutorial', {
        title: 'Prometheus Online Tutorial Portal',
        user: JSON.stringify(req.user)
    });
};

exports.create = function (req, res) {
    console.log("tutorial.server.controller::create");

    var file = req.files.file;
    console.log('req.files', req.files)
    var separator = '/';
    var uniqueFileName = uuid.v4() + '-' + file.name.replace(/\s/g, '');
    var oldPath = [__dirname, '..', '..', file.path].join(separator);
    var newPath = [__dirname, '..', '..', config.zipDataPath, uniqueFileName].join(separator);

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            console.log('failed creating ', newPath);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            var tutorial = new Tutorial(req.body);
            console.log('req.body', req.body)
            tutorial.zipFile = uniqueFileName;
            tutorial.origFile = file.name;
            tutorial.creator = req.user;
            tutorial.title = req.body.title;
            console.log('tutorial', tutorial);
            tutorial.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.json(tutorial);
                }
            });
        }
    });
};

exports.list = function (req, res) {
    console.log("tutorial.server.controller::list");
    Tutorial.find().sort('-created').populate('creator', 'name username email').exec(function (err, tutorials) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(tutorials);
        }
    });
};

exports.read = function (req, res) {
    console.log("tutorial.server.controller::read");
    res.json(req.tutorial);
};

exports.tutorialByID = function (req, res, next, id) {
    console.log("tutorial.server.controller::tutorialByID");
    Tutorial.findById(id).populate('creator', 'name username email').exec(function (err, tutorial) {
        if (err)
            return next(err);

        if (!tutorial)
            return next(new Error('Failed to load tutorial ' + id));

        req.tutorial = tutorial;
        next();
    });
};

exports.update = function (req, res) {
    console.log("tutorial.server.controller::update");
    console.log(req.tutorial);
    var tutorial = req.tutorial;
    var randId = uuid.v4();
    var tarPath = [__dirname, '..', '..', config.zipDataPath, tutorial.zipfile].join('/');
    var rawPath = [__dirname, '..', '..', config.rawDataPath, randId].join('/');

    // create temp raw directory
    console.log('creating', rawPath);
    fs.mkdir(rawPath, untarTutorial);

    function untarTutorial(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }

        console.log('untaring', tarPath);

        // decompress file
        targz.decompress({
            src: tarPath,
            dest: rawPath
        }, complete);
    }

    function complete() {
        rimraf(rawPath, function (err) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }

            tutorial.processed = true;
            tutorial.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.json(tutorial);
                }
            });
        });
    }
};

exports.delete = function (req, res) {
    console.log("tutorial.server.controller::delete");
    var tutorial = req.tutorial;
    var tarPath = [__dirname, '..', '..', config.zipDataPath, tutorial.zipfile].join('/');
    fs.unlink(tarPath, function (err) {
        if (err) {
            console.log('failed deleting ', tarPath);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            console.log('successfully deleted ', tarPath);
            tutorial.remove(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.json(tutorial);
                }
            });
        }
    });
};

exports.hasAuthorization = function (req, res, next) {
    console.log("tutorial.server.controller::hasAuthorization");
    if (req.tutorial.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
