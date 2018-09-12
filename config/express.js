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

var config = require('./config'),
    express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session')
    multipart = require('connect-multiparty');

module.exports = function () {
    var app = express();
    var server = http.createServer(app);

    app.use(express.static('./public'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(multipart({
        uploadDir: config.uploadPath
    }));

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/user.server.routes.js')(app);
    //require('../app/routes/authkey.server.routes.js')(app);
    //require('../app/routes/workshop.server.routes.js')(app);
    require('../app/routes/tutorial.server.routes.js')(app);

    return server;
};
