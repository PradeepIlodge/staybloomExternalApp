
staybloomExternalApp.controller('propertyListController',
		['$scope', '$rootScope', '$http', '$location', 'propertyListFactory', '$log',
		 function($scope, $rootScope, $http, $location, propertyListFactory, $log)
{

	propertyListFactory.getPropertyList($rootScope.userEmail).then(function(data) {
		$scope.data = data;
		if(data.inventoryStore.length == 1) {
			$scope.fire(data.inventoryStore[0]);
		}
	});

	$scope.fire = function(inventoryStore) {
		$rootScope.inventoryStore.id = inventoryStore.id;
		$rootScope.inventoryStore.name = inventoryStore.propertyRef.name;
		$rootScope.inventoryStore.propertyRef = {};
		$rootScope.inventoryStore.propertyRef.id = inventoryStore.propertyRef.id;
		$location.path("/externalAppTypes/");
	}
}]);