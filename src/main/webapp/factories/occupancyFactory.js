
staybloomExternalApp.factory('occupancyFactory',
		['$rootScope', '$q', '$log', '$http',
		 function($rootScope, $q, $log, $http)
{
	var factory = {};

	factory.getOccupancy = function(startingDate, endDate, inventoryStoreId) {
		var defer = $q.defer();
		$http.get(rootUrl+"/roomOccupancy/%7B%22dateRange%22:%7B%22timeStart%22:%7B%22formattedDate%22:%22"
				+startingDate+"%22%7D,%22timeEnd%22:%7B%22formattedDate%22:%22"
				+endDate+"%22%7D%7D,%22inventoryStoreId%22:%22"
				+inventoryStoreId+"%22%7D")
			.success(function(data, status, headers, config) {
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
			});
		return defer.promise;
	}

	return factory;
}]);
