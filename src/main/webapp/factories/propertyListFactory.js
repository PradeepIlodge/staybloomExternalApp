
staybloomExternalApp.factory('propertyListFactory',
		['$q', '$rootScope', '$log', '$http',
		 function($q, $rootScope, $log, $http)
{
	var factory = {};

	factory.getPropertyList = function(userEmail) {
		var defer = $q.defer();
		var propertyListUrl = rootUrl+"/inventoryStores?query=%7B%22externalAppUser%22:%22"+userEmail+"%22%7D";
		$http.get(propertyListUrl)
			.success(function(data, status, headers, config) {
				if(data.searchSummary != undefined && data.searchSummary.totalHits == 0)
					$rootScope.popRootModal("No hotels found", "Please call support for access.");
				else if(data.searchSummary == undefined)
					$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
			});
		return defer.promise;
	}

	return factory;
}]);