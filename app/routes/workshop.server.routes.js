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
        workshop = require('../../app/controllers/workshop.server.controller');

    app.route('/api/workshop/')
        .get(user.requiresLogin, workshop.list)
        .post(user.requiresLogin, user.requiresAdmin, workshop.create);

    app.route('/api/workshop/:workshopId')
        .get(user.requiresLogin, workshop.read)
        .put(user.requiresLogin, workshop.update)
        .delete(user.requiresLogin, user.requiresAdmin, workshop.delete);

    app.param('workshopId', workshop.workshopByID);
};
