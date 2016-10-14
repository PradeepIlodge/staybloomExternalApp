
staybloomExternalApp.factory('exportLoyaltyReportFactory',
		['$http', '$log', '$q', '$rootScope',
		 function($http, $log, $q, $rootScope)
{
	var factory = {};

	factory.getLoyaltyGraphData = function(profileId) {
		var defer = $q.defer();
			
		var reservationUrl = rootUrl+"/export/loyaltyInfo/"+profileId;
		$http.get(reservationUrl)
			.success(function(data, status, headers, config) {
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				defer.resolve(data);
				$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
			});
		return defer.promise;
	};

	return factory;
}]);