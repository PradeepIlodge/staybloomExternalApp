
staybloomExternalApp.factory('exportReservationListFactory',
		['$http', '$log', '$q', '$rootScope',
		 function($http, $log, $q, $rootScope)
{
	var factory = {};

	factory.getReservationList = function(invId, tagId, startDateStr, endDateStr) {
		var defer = $q.defer();
			
		var reservationUrl = rootUrl+"/export/search/licenseGroups?" +
		"query=%7B%22consumptionDates%22:%7B%22timeStart%22:%7B%22formattedDate%22:%22"+startDateStr+"%22%7D," +
		"%22timeEnd%22:%7B%22formattedDate%22:%22"+endDateStr+"%22%7D%7D," +
		"%22lineStates%22:%5B%22BASE_PRODUCT_LINE_ACTIVE%22%5D,%22productTypes%22:%5B%22ROOM%22%5D," +
		"%22reservationType%22:%5B%22SELL%22%5D,%22inventoryStoreId%22:%22"+invId+"%22,%22tagId%22:%5B%22Pp/"+tagId+"%22%5D%7D";
		$http.get(reservationUrl)
			.success(function(data, status, headers, config) {
				defer.resolve(data.productivityData);
			}).error(function(data, status, headers, config) {
				defer.resolve(data);
				$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
			});
		return defer.promise;
	};

	factory.getProductivitySummary = function(reservationList) {
		var sum = [];
		reservationList.forEach(function (reservation) {
			var exists = false;
			var item = {};
			for (i = 0; i < sum.length; i++) {
				if(sum[i].booker == reservation.booker) {
					item = sum[i];
					item.monthRevenue += reservation.monthRevenue;
					item.monthNights += reservation.monthNights;
					exists = true;
					break
				}
			}
			if(exists == false) {
				item.booker = reservation.booker;
				item.monthRevenue = reservation.monthRevenue;
				item.monthNights = reservation.monthNights;
				item.bookerId = reservation.bookerId;
				sum.push(item);
			}
		});
		return sum;
	};

	return factory;
}]);