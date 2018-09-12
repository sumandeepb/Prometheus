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
    var user = require('../controllers/user.server.controller'),
        tutorial = require('../../app/controllers/tutorial.server.controller');

    var multiparty = require('connect-multiparty'),
        multipartyMiddleware = multiparty();

    app.route('/api/tutorial')
        .get(user.requiresLogin, tutorial.list)
        .post(user.requiresLogin, user.requiresEditor, multipartyMiddleware, tutorial.create);

    app.route('/api/tutorial/:tutorialId')
        .get(user.requiresLogin, tutorial.read)
        .put(user.requiresLogin, user.requiresEditor, tutorial.hasAuthorization, tutorial.update)
        .delete(user.requiresLogin, user.requiresEditor, tutorial.hasAuthorization, tutorial.delete);

    app.param('tutorialId', tutorial.tutorialByID);
};
