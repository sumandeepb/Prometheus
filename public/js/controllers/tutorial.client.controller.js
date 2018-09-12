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

angular.module('tutorial').controller('TutorialController', ['$scope', '$route', '$routeParams', '$location', '$timeout', 'Authentication', 'Upload', 'TutorialAPI',
    function ($scope, $route, $routeParams, $location, $timeout, Authentication, Upload, TutorialAPI) {
        $scope.authentication = Authentication;

        $scope.create = function () {
            console.log("in tutorial.client.controller::create");
            title = $scope.title;
            file = $scope.zipfile;
            file.upload = Upload.upload({
                url: '/api/tutorial',
                method: 'POST',
                data: { title: title },
                file: file
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    if (file.result) {
                        $location.path('tutorial/list');
                    }
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };

        $scope.view = function (tutorial) {
            console.log("in tutorial.client.controller::view");
            $location.path('tutorial/' + tutorial._id);
        };

        $scope.find = function () {
            console.log("in tutorial.client.controller::find");
            $scope.tutorials = TutorialAPI.query();
        };

        $scope.findOne = function () {
            console.log("in tutorial.client.controller::findOne");
            $scope.tutorial = TutorialAPI.get({
                tutorialId: $routeParams.tutorialId
            });
        };

        $scope.update = function (tutorial) {
            console.log("in tutorial.client.controller::update");
            if (tutorial) {
                tutorial.$update(function () {
                }, function (errorResponse) {
                    $scope.errorMsg = errorResponse.data.message;
                });
            } else {
                $scope.tutorial.$update(function () {
                }, function (errorResponse) {
                    $scope.errorMsg = errorResponse.data.message;
                });
            }
        };

        $scope.delete = function (tutorial) {
            console.log("in tutorial.client.controller::delete");
            if (tutorial) {
                tutorial.$remove(function () {
                    for (var i in $scope.tutorials) {
                        if ($scope.tutorials[i] === tutorial) {
                            $scope.tutorials.splice(i, 1);
                        }
                    }
                    $location.path('tutorial/list');
                });
            } else {
                $scope.tutorial.$remove(function () {
                    $location.path('tutorial/list');
                });
            }
        };
    }
]);
