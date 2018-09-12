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

var mongoose = require('mongoose'),
    //Image = mongoose.model('Image'),
    User = mongoose.model('User'),
    Promise = require('bluebird');

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

exports.renderLogin = function (req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Prometheus Log-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderRegister = function (req, res, next) {
    if (!req.user) {
        res.render('register', {
            title: 'Prometheus Register Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};

// need to add key based authentication before creating user
exports.register = function (req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        /* verify key here */

        user.save(function (err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/register');
            }

            req.login(user, function (err) {
                if (err)
                    return next(err);

                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.requiresLogin = function (req, res, next) {
    console.log("user.server.controller::requiresLogin");
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }
    next();
};

exports.requiresAdmin = function (req, res, next) {
    console.log("user.server.controller::requiresAdmin");
    if (!(req.user.permission === 'admin')) {
        return res.status(401).send({
            message: 'User is not an admin'
        });
    }
    next();
};

exports.requiresEditor = function (req, res, next) {
    console.log("user.server.controller::requiresEditor");
    if (!(req.user.permission === 'editor' || req.user.permission === 'admin')) {
        return res.status(401).send({
            message: 'User is not an editor'
        });
    }
    next();
};

exports.create = function (req, res, next) {
    console.log("user.server.controller::create");
    var auser = new User(req.body);
    auser.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(auser);
        }
    });
};

exports.list = function (req, res, next) {
    console.log("user.server.controller::list");
    User.find({}, function (err, ausers) {
        if (err) {
            return next(err);
        } else {
            res.json(ausers);
        }
    });
};

exports.read = function (req, res, next) {
    console.log("user.server.controller::read");
    res.json(req.auser);
};

exports.userByID = function (req, res, next, id) {
    console.log("user.server.controller::userByID");
    User.findOne(
        {
            _id: id
        },
        function (err, auser) {
            if (err) {
                return next(err);
            } else {
                req.auser = auser;
                next();
            }
        }
    );
};

exports.update = function (req, res, next) {
    console.log("user.server.controller::update");
    req.body.approved = req.body.approvedReq;
    User.findByIdAndUpdate(req.auser.id, req.body,
        function (err, auser) {
            if (err) {
                return next(err);
            } else {
                res.json(auser);
            }
        }
    );
};

exports.delete = function (req, res, next) {
    console.log("user.server.controller::delete");
    req.auser.remove(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.auser);
        }
    });
};
