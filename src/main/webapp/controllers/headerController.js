
staybloomExternalApp.controller('headerController',
		['$scope', '$rootScope', '$route', '$routeParams',
		 '$cookies', '$window', '$location', '$log',
		 function($scope, $rootScope, $route, $routeParams,
				 $cookies, $window, $location, $log)
{
	$scope.$route = $route;
	$scope.nowDate = moment().format("YYYYMMDD");
	
	$scope.propertyName = "";
	$scope.externalAppName = "";
	$rootScope.$watch("inventoryStore.id", function() {
		$scope.propertyName = $rootScope.inventoryStore.name;
	});
	$rootScope.$watch("externalAppName", function() {
		$scope.externalAppName = $rootScope.externalAppName;
	});
	$scope.isPropertySet = function() {
		if($scope.propertyName == undefined || typeof($scope.propertyName) == 'undefined' || $scope.propertyName == "") {
			return false;
		} else {
			return true;
		}
	};
	$scope.externalAppName = function() {
		if($scope.externalAppName == undefined || typeof($scope.externalAppName) == 'undefined' || $scope.externalAppName == "") {
			return false;
		} else {
			return true;
		}
	};
	$scope.reloadRoute = function() {
		$route.reload();
	};
	$scope.logout = function() {
		alert("clearing cookies-"+$cookies.authEmail);
		$cookies.authEmail = undefined;
		delete $cookies['authEmail'];
		delete $cookies['auth'];
		$scope.propertyName = "";
		$log.info("redirecting to logout");
		$location.path('/logout');
	};
	$scope.alert = function(s){
		alert(s);
	};
}]);