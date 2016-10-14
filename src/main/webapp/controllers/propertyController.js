
staybloomExternalApp.controller('propertyController',
		function($scope, $rootScope, $http, $location)
{
	$scope.message = 'This is property screen';
	$http.get(rootUrl+"/inventoryStores/"+inventoryStoreId)
		.success(function(data, status, headers, config) {
			$scope.message = data;
		}).error(function(data, status, headers, config) {
			$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
		});
});
