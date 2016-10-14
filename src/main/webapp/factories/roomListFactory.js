
staybloomExternalApp.factory('roomListFactory',
		['$q', '$rootScope', '$log', '$http', '$cookies',
		 function($q, $rootScope, $log, $http, $cookies)
{
	var factory = {};

	var authEmail = $cookies.authEmail;
	var authEmaillicenseGroups1 = authEmail.replace(/['"]+/g, '');
	
	
		
	factory.getCompleteRoomList = function() {
		var defer = $q.defer();
		var inventoryStoreId = $rootScope.inventoryStore.id;
		var propertyId = $rootScope.inventoryStore.propertyRef.id;
		var getCompleteRoomListURL = rootUrl+'/rooms?query=%7B%22propertyId%22:%22'+propertyId+'%22%7D';
		$http.get(getCompleteRoomListURL)
			.success(function(data, status, headers, config) {
				if(data != undefined && data.searchSummary != undefined) {
				} else if(data == undefined) {
					$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
				} else {
					$rootScope.popRootModal("Oops! Something broke.", "Could not fetch room list.");
				}
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
			});
		return defer.promise;
	}

	return factory;

}]);