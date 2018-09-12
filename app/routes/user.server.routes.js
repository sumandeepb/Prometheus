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

module.exports = function (app) {
    var user = require('../../app/controllers/user.server.controller'),
        passport = require('passport');

    app.route('/api/user')
        .post(user.create)
        .get(user.requiresLogin, user.requiresAdmin, user.list);

    /*app.route('/api/user/profile')
        .get(user.requiresLogin, user.profile);*/

    app.route('/api/user/:userId')
        .get(user.read)
        .put(user.requiresLogin, user.requiresAdmin, user.update)
        .delete(user.requiresLogin, user.requiresAdmin, user.delete);

    app.param('userId', user.userByID);

    app.route('/register')
        .get(user.renderRegister)
        .post(user.register);

    app.route('/login')
        .get(user.renderLogin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/logout', user.logout);
};
