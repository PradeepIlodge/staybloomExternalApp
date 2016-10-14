
staybloomExternalApp.factory('externalAppListFactory',
		['$q', '$rootScope', '$log', '$http', '$cookies',
		 function($q, $rootScope, $log, $http, $cookies)
{
	var factory = {};

	factory.getExternalAppListFactory = function(appId) {
		var defer = $q.defer();
		var authEmail = $rootScope.userEmail;
		var propertyListUrl = rootUrl+"/access/egc/%7B%22user%22%3A%22"+authEmail+"%22%2C%22app%22%3A%7B%22appId%22%3A%22PMS_EXT%22%2C%22topLevelEntityId%22%3A%22"+$rootScope.inventoryStore.id+"%22%7D%7D";
		$http.get(propertyListUrl)
			.success(function(data, status, headers, config) {
				if(data != undefined){
					
				}
				else if(data == undefined)
					$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
			});
		return defer.promise;
	}
	return factory;
}]);