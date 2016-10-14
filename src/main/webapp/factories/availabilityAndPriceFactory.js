
staybloomExternalApp.factory('availabilityAndPriceFactory',
		['$http', '$q', '$log', '$rootScope', function($http, $q, $log, $rootScope)
{
	var factory = {};
	
	function makeAvailabilityDateMap(data, range) {
		availabilityDataMap =  new Object();
		availabilityDataMap.get = function(k) {
			return availabilityDataMap[k];
		}
		var dateStartForAvailabilityMap = moment(data.bookedProducts[0].timeRange.timeStart.formattedDate, "YYYYMMDD");
		for(var i = 0; i < range; i++) {
			var dateStart = moment(dateStartForAvailabilityMap);
			var currDate = moment(dateStart.add(i, 'days'));
			if(i < data.bookedProducts[0].bookedQuantity.length) {
				availabilityDataMap[currDate.format("YYYYMMDD")] =
					{
						availability : data.bookedProducts[0].bookedQuantity[i].quantity,
						requestSatisfied: data.bookedProducts[0].bookedQuantity[i].requestSatisfied
					};
			}
		}
		return availabilityDataMap;
	};
	
	function getAvailabilityForRoomForRangeDefered(roomId, startDate, range, defer) {
		if(defer == null){
			defer = $q.defer();
		}
		var availabilityUrl = rootUrl+'/bookings/{"products":{"products":[{"baseProduct":"'+roomId
			+'","timeRange":{"timeStart":{"formattedDate":"'+startDate.format("YYYYMMDD")
			+'"},"timeEnd":{"formattedDate":"'+moment(startDate, "YYYYDDMM").add(range-1, 'days').format("YYYYMMDD")+'"}}}]}}';
		
		if(typeof($rootScope.roomTypeIdNameMap.get(roomId)) != 'undefined' 
				&& $rootScope.roomTypeIdNameMap.get(roomId) != undefined 
				&& $rootScope.roomTypeIdNameMap.get(roomId) != '') {
			$http.get(availabilityUrl)
				.success(function(data, status, config, header) {
					defer.resolve(makeAvailabilityDateMap(data, range));
				})
				.error(function(data, status, config, header) {
					if(false/*range > 1*/) {
						getAvailabilityForRoomForRangeDefered(roomId, startDate, range-1, defer);
					} else {
						$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
					}
				});
			return defer.promise;
		} else {
			return defer.promise;
		}
	};
	
	factory.getAvailabilityForRoomForRange = function(roomId, startDate, range) {
		return getAvailabilityForRoomForRangeDefered(roomId, startDate, range, null);
	};
	
	
	
	
	//TODO: Rishabh looping can be made more efficient - read dates one after the other instead of starting a new loop
	function makePriceDateMap(data, startDateOrg, range) {
		priceDataMap =  new Object();
		priceDataMap.get = function(k) {
			return priceDataMap[k];
		}
		for(var i = 0; i < range; i++) {
			var dateStart = moment(startDateOrg, "YYYYMMDD");
			var currDate = moment(dateStart.add(i, 'days'));
			for(var j=0; j<data.priceTable.length; j++) {
				var startDate = moment(data.priceTable[j].timeRange.timeStart.formattedDate, "YYYYMMDD");
				var endDate   = moment(data.priceTable[j].timeRange.timeEnd.formattedDate,   "YYYYMMDD");
				if(currDate >= startDate && currDate <= endDate) {
					priceDataMap[currDate.format("YYYYMMDD")] = data.priceTable[j].price.priceFloat;
					break;
				}
			}
		}
		return priceDataMap;
	};
	
	factory.getPricingForRoom = function(roomId, startDate, range) {
		var defer = $q.defer();
		var priceUrl = rootUrl+'/barPrice/egc/'+roomId;
		$http.get(priceUrl)
			.success(function(data, status, headers, config) {
				defer.resolve(makePriceDateMap(data, startDate, range));
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
			});
		return defer.promise;
	};
	
	return factory;
}]);
