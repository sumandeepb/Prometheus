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

angular.module('user').controller('UserController', ['$scope', '$routeParams', '$location', '$http', 'Authentication', 'UserAPI',
    function ($scope, $routeParams, $location, $http, Authentication, UserAPI) {
        $scope.authentication = Authentication;

        $scope.find = function () {
            console.log("in user.client.controller::find");
            $scope.users = UserAPI.query();
            console.log($scope.users);
        };

        $scope.findOne = function () {
            console.log("in user.client.controller::findOne");
            $scope.user = UserAPI.get({
                userId: $routeParams.userId
            });
        };

        $scope.update = function (user, approved) {
            console.log("in user.client.controller::update");
            if (user) {
                user.approvedReq = approved;
                user.$update(function () {
                    user.approved = approved;
                    $location.path('user/list');
                }, function (errorResponse) {
                    $scope.errorMsg = errorResponse.data.message;
                });
            } else {
                $scope.user.$update(function () {
                    $location.path('user/list');
                }, function (errorResponse) {
                    $scope.errorMsg = errorResponse.data.message;
                });
            }
        };

        $scope.delete = function (user) {
            console.log("in user.client.controller::delete");
            if (user) {
                user.$remove(function () {
                    for (var i in $scope.users) {
                        if ($scope.users[i] === user) {
                            $scope.users.splice(i, 1);
                        }
                    }
                    $location.path('user/list');
                });
            } else {
                $scope.user.$remove(function () {
                    $location.path('user/list');
                });
            }
        };
    }
]);
