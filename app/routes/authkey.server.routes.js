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
        authkey = require('../../app/controllers/authkey.server.controller');

    app.route('/api/authkey')
        .get(user.requiresLogin, user.requiresAdmin, authkey.list);

    app.route('/api/authkey/:authkeyId')
        .get(user.requiresLogin, user.requiresAdmin, authkey.read)
        .delete(user.requiresLogin, user.requiresAdmin, authkey.delete);

    app.param('authkeyId', authkey.authkeyByID);
};
