
staybloomExternalApp.factory('roomTypeFactory',
		['$q', '$http', '$log', '$rootScope',
		 function($q, $http, $log, $rootScope)
{
	var factory = {};
	
	factory.getRoomTypes = function(invStoreId) {
		var defer = $q.defer();
		roomTypeUrl = rootUrl+'/products?query={"inventoryStoreId":"'+invStoreId+'","productType":"ROOM"}';
		$http.get(roomTypeUrl)
			.success(function(data, status, headers, config) {
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
			});
		return defer.promise;
	};

	factory.getRoomTypeIdNameMap = function(data) {
		roomTypeIdNameMap = new Object();
		roomTypeIdNameMap.get = function(k) {
			return roomTypeIdNameMap[k];
		};
		for(var i=0; i<data.products.length; i++) {
			if(i==0) $rootScope.defaultRoomId = data.products[i].id;
			roomTypeIdNameMap[data.products[i].id] = data.products[i].name;
			//alert(data.products[i].id +" - "+ data.products[i].name);
		}
		return roomTypeIdNameMap;
	}
	
	return factory;
}]);
