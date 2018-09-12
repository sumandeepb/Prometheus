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
        targz = require('targz'),
        rimraf = require('rimraf'),
        pythonshell = require('python-shell'),
        mongoose = require('mongoose'),
        AuthKey = mongoose.model('AuthKey');

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
    console.log("authkey.server.controller::render");
    res.render('upload', {
        title: 'Prometheus Online Tutorial Portal',
        user: JSON.stringify(req.user)
    });
};

exports.create = function (user, setName, recordCount) {
    console.log("authkey.server.controller::create");

    var imgPath = [__dirname, '..', '..', config.imagesPath].join('/');
    var rawPath = [__dirname, '..', '..', config.rawDataPath].join('/');
    var authkeyPath = [__dirname, '..', '..', config.authkeyPath].join('/');
    var setPath = [rawPath, setName].join('/');
    var tarName = setName + '.tar.gz';
    var tarPath = [authkeyPath, tarName].join('/');

    // code to call face cropping python script
    try {
        var options = {
            args: [imgPath, rawPath, setName]
        };
        pythonshell.run('./pylib/cropFaces.py', options, createExportTAR);
    } catch (err) {
        return console.log('PythonShell(cropFaces)', err);
    }

    function createExportTAR(err, data) {
        console.log("authkey.server.controller::create.createExportTAR");
        if (err) {
            return console.log(err);
        }

        result = data.toString();
        console.log(result);

        // create tar ball for the export folder (annotaion json + cropped images)
        targz.compress({
            src: setPath,
            dest: tarPath
        }, removeTempDir);
    }

    function removeTempDir(err) {
        console.log("authkey.server.controller::create.removeTempDir");
        if (err) {
            return console.log(err);
        }

        // write our tar ball location
        console.log("exported data to data/raw/" + tarName);

        // delete temp raw directory
        rimraf(setPath, saveRecord);
    }

    function saveRecord(err) {
        console.log("authkey.server.controller::create.saveRecord");
        if (err) {
            return console.log(err);
        }

        var authkey = new AuthKey();
        authkey.tarfile = tarName;
        authkey.creator = user;
        authkey.recordcount = recordCount;
        console.log('authkey', authkey);
        authkey.save(function (err) {
            if (err) {
                return console.log(err);
            }
            console.log('saved tar');
        });
    }
};

exports.list = function (req, res) {
    console.log("authkey.server.controller::list");
    AuthKey.find().sort('-created').populate('creator', 'name username email').exec(function (err, authkeys) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(authkeys);
        }
    });
};

exports.read = function (req, res) {
    console.log("authkey.server.controller::read");

    // get tar file for authkey record
    var authkey = req.authkey;
    var authkeyPath = [__dirname, '..', '..', config.authkeyPath].join('/');
    var tarName = authkey.tarfile;
    var tarPath = [authkeyPath, tarName].join('/');

    // return tar ball as file download
    res.download(tarPath, tarName, function (err) {
        if (err) {
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
};

exports.authkeyByID = function (req, res, next, id) {
    console.log("authkey.server.controller::uploadByID");
    AuthKey.findById(id).populate('creator', 'name username email').exec(function (err, authkey) {
        if (err)
            return next(err);

        if (!authkey)
            return next(new Error('Failed to load authkey ' + id));

        req.authkey = authkey;
        next();
    });
};

exports.delete = function (req, res) {
    console.log("authkey.server.controller::delete");
    var authkey = req.authkey;
    var tarPath = [__dirname, '..', '..', config.authkeyPath, authkey.tarfile].join('/');
    fs.unlink(tarPath, function (err) {
        if (err) {
            console.log('failed deleting ', tarPath);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            console.log('successfully deleted ', tarPath);
            authkey.remove(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.json(authkey);
                }
            });
        }
    });
};

exports.hasAuthorization = function (req, res, next) {
    console.log("authkey.server.controller::hasAuthorization");
    if (req.authkey.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
