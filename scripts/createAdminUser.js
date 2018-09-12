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

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config/config');
var mongoose = require('mongoose');

console.log('connecting to', config.db);
var db = mongoose.connect(config.db);

require('../app/models/user.server.model');
User = mongoose.model('User');

console.log('creating default admin user');
var auser = new User({
    username: 'administrator',
    email: 'sumandeep.banerjee@gmail.com',
    permission: 'admin',
    password: 'admin@123',
    provider: 'local'
});

auser.save(function (err) {
    if (err) {
        console.log("Error", err);
        process.exit(-1);
    } else {
        process.exit(0);
    }
});
