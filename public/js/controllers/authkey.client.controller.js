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

angular.module('expdata').controller('ExpdataController', ['$scope', '$routeParams', '$location', '$http', '$window', 'Authentication', 'ExpdataAPI',
    function ($scope, $routeParams, $location, $http, $window, Authentication, ExpdataAPI) {
        $scope.authentication = Authentication;

        $scope.create = function () {
            console.log("in expdata.client.controller::create");
            $http({
                method: "GET",
                url: '/api/image/export'
            }).then(function (response) {
                console.log(response.data);
                $scope.errorMsg = response.data.message;
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                console.log($scope.errorMsg);
            });
        };

        $scope.find = function () {
            console.log("in expdata.client.controller::find");
            $scope.expdatas = ExpdataAPI.query();
        };

        $scope.findOne = function () {
            console.log("in expdata.client.controller::findOne");
            $scope.expdata = ExpdataAPI.get({
                expdataId: $routeParams.expdataId
            });
        };

        $scope.view = function (expdata) {
            console.log("in expdata.client.controller::view");
            $location.path('expdata/' + expdata._id);
        };

        $scope.update = function (expdata) {
            console.log("in expdata.client.controller::update");
        };

        $scope.download = function (expdata) {
            console.log("in expdata.client.controller::update");
            // opens download tab for exported TAR file
            $window.open('/api/expdata/' + expdata._id);
        };

        $scope.delete = function (expdata) {
            console.log("in expdata.client.controller::delete");
            if (expdata) {
                expdata.$remove(function () {
                    for (var i in $scope.expdatas) {
                        if ($scope.expdatas[i] === expdata) {
                            $scope.expdatas.splice(i, 1);
                        }
                    }
                    $location.path('expdata/list');
                });
            } else {
                $scope.expdata.$remove(function () {
                    $location.path('expdata/list');
                });
            }
        };
    }
]);
