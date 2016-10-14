
staybloomExternalApp.factory('loyaltyVoucherFactory',
		['$q', '$rootScope', '$log', '$http', '$cookies',
		 function($q, $rootScope, $log, $http, $cookies)
{
	var factory = {};
	var authEmail = $cookies.authEmail;
	var authEmail1 = authEmail.replace(/['"]+/g, '');
	var inventoryStoreId = $rootScope.inventoryStore.id;
	factory.checkProfileId = function(profileId) {
		var defer = $q.defer();
		var checkProfileIdURL = rootUrl+'/loyaltyInfo/'+profileId;
		$http.get(checkProfileIdURL)
			.success(function(data, status, headers, config) {
				if(data != undefined) {
					//alert("found checked in people - "+data.licenses.length);
				} else if(data == undefined) {
					$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
				} else if(data.licenses != undefined) {
					$rootScope.popRootModal("Oops! Something broke.", "No one is checked-in in room "+roomNumber);
				}
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
			});
		return defer.promise;
	}
	
	factory.submitLoyaltyVoucher = function(loyaltyData) {
		var defer = $q.defer();
		var createLoyaltyVoucherURL = rootUrl+'/loyaltyVoucher';
		var validity='';
		if(loyaltyData.valid == true){
			validity = "VALID";
		} else {
			validity = "INVALID";
		}
		var createLoyaltyVoucherMsg = '{"profieId":"'+loyaltyData.profileId+'","name":"'+loyaltyData.voucherTag+'","inventoryStoreId":"'+inventoryStoreId+'","approverEmail":"'+authEmail1+'","points":{"priceFloat":'+loyaltyData.voucherPoints+'},"message":"'+loyaltyData.description+'","voucherState":"'+validity+'"}';
		$http.post(createLoyaltyVoucherURL, createLoyaltyVoucherMsg)
		.success(function(data, status, header, config) {
			if(data != undefined) {
				//alert("Inserted");
			} else {
				$rootScope.popRootModal("Internet connection broke","Please check internet connection and try again!");
			}
			defer.resolve(data);
		})
		.error(function(data, status, header, config){
			$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh. If it still does not work, contact frontdesk.");
		});
		return defer.promise;
	}

	factory.checkLoyaltyVoucher = function(loyaltyVoucher) {
		var defer = $q.defer();
		var checkLoyaltyVoucherURL = rootUrl+'/loyaltyVoucher/'+loyaltyVoucher;
		$http.get(checkLoyaltyVoucherURL)
			.success(function(data, status, headers, config) {
				if(data != undefined) {
					//alert("found checked in people - "+data.licenses.length);
				} else if(data == undefined) {
					$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
				} else if(data.licenses != undefined) {
					$rootScope.popRootModal("Oops! Something broke.", "No one is checked-in in room "+roomNumber);
				}
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
			});
		return defer.promise;
	}

	factory.updateLoyaltyVoucherData = function(updateLoyaltyVoucher) {
		var defer = $q.defer();
		var updateLoyaltyVoucherURL = rootUrl+'/loyaltyVoucher/'+updateLoyaltyVoucher.voucherId;
		var updateValidity='';
		var currentDate = new Date();
    		var currentTimeInMiliSecounds = currentDate.getTime();
		if(updateLoyaltyVoucher.valid == true){
			updateValidity = "VALID";
		} else {
			updateValidity = "INVALID";
		}
		var updateLoyaltyVoucherMsg = '{"id":"'+updateLoyaltyVoucher.voucherId+'","profieId":"'+updateLoyaltyVoucher.profileId+'","name":"'+updateLoyaltyVoucher.voucherTag+'","voucherCreationTime":{"milliSeconds":'+currentTimeInMiliSecounds+'},"inventoryStoreId":"'+inventoryStoreId+'","approverEmail":"'+authEmail1+'","points":{"priceFloat":'+updateLoyaltyVoucher.voucherPoints+'},"message":"'+updateLoyaltyVoucher.description+'","voucherState":"'+updateValidity+'"}';
		$http.put(updateLoyaltyVoucherURL, updateLoyaltyVoucherMsg)
		.success(function(data, status, header, config) {
			if(data != undefined) {
				//alert("Inserted");
			} else {
				$rootScope.popRootModal("Internet connection broke","Please check internet connection and try again!");
			}
			defer.resolve(data);
		})
		.error(function(data, status, header, config){
			$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh. If it still does not work, contact frontdesk.");
		});
		return defer.promise;
	}

	
	return factory;
}]);