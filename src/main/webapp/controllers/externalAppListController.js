
staybloomExternalApp.controller('externalAppListController',
		['$scope', '$rootScope', '$http', '$location', 'externalAppListFactory', '$log',
		 function($scope, $rootScope, $http, $location, externalAppListFactory, $log)
{
	
	externalAppListFactory.getExternalAppListFactory($rootScope.propertyId).then(function(data) {
		var accessIndex = data.includedArea[0].index;
		$rootScope.isExternalAppVisible = false;
		for (var app in externalApplications) {
			accessMap[app] = accessIndex[externalApplications[app]];
		}
	});
	
	$scope.data = accessMap;

	$scope.fire = function(externalAppName) {
		$rootScope.isExternalAppVisible = true;
		$rootScope.externalAppName = externalAppName;
		$location.path("/getApplicationView/"+externalAppName);
	}
}]);