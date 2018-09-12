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

angular.module('tutorial').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/tutorial', {
            templateUrl: 'js/views/tutorial-menu.client.view.html'
        }).when('/tutorial/create', {
            templateUrl: 'js/views/tutorial-create.client.view.html'
        }).when('/tutorial/list', {
            templateUrl: 'js/views/tutorial-list.client.view.html'
        }).when('/tutorial/:tutorial', {
            templateUrl: 'js/views/tutorial-view.client.view.html'
        });
    }
]);
