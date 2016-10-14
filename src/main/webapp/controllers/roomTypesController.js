
staybloomExternalApp.controller('roomTypesController',
		['$scope', '$rootScope', 'roomTypeFactory', '$log',
		 function($scope, $rootScope, roomTypeFactory, $log)
{

	$rootScope.$watch("inventoryStore.id", function() {
		if(typeof(inventoryStoreId) != undefined && inventoryStoreId != undefined && inventoryStoreId != "") {
			roomTypeFactory.getRoomTypes(inventoryStoreId).then(function(data) {
				$scope.data = data;
				$rootScope.roomTypeIdNameMap = roomTypeFactory.getRoomTypeIdNameMap(data);
			});
		}
	});

}]);