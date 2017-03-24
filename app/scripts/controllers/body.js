'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:BodyCtrl
 * @description
 * # BodyCtrl
 * Controller of the botbloqItsFrontendApp
 */
botBloqApp.controller('BodyCtrl', function($scope, common, $log, userApi,lomsApi, $location) {
        $log.log('body ctrl start');
        $scope.userApi = userApi;
        $scope.lomsApi = lomsApi;

        $scope.isActive =  function(currentPath){
       		return currentPath === $location.path();
  		}
    });