
staybloomExternalApp.controller('updateProductController',
		['$routeParams', '$scope', '$rootScope', '$http',
		 function($routeParams, $scope, $rootScope, $http)
{
	//alert($routeParams.roomId);
	$scope.roomId = $routeParams.roomId;
	$scope.forDate = $routeParams.forDate;
	
	var roomInfoURL = rootUrl+'/products?query={"inventoryStoreId":"'+inventoryStoreId+
		'","productType":"ROOM","productId":"'+$routeParams.roomId+'"}';
	$http.get(roomInfoURL)
		.success(function(data, status, header, config) {
			$scope.message = data;
			$scope.data = data;
		}).error(function(data, status, header, config) {
			$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
		});
}]);