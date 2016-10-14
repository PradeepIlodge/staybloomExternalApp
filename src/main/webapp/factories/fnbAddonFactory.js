
staybloomExternalApp.factory('fnbAddonFactory',
		['$q', '$rootScope', '$log', '$http', '$cookies',
		 function($q, $rootScope, $log, $http, $cookies)
{
	var factory = {};

	var authEmail = $cookies.authEmail;
	var authEmail1 = authEmail.replace(/['"]+/g, '');
	factory.getCheckedInReservationList = function(roomNumber) {
		var defer = $q.defer();
		var inventoryStoreId = $rootScope.inventoryStore.id;
		var checkedInRoomSearchURL = rootUrl+'/search/licenseGroups?query={"roomCode":"'+roomNumber+
			'","lineStates":["BASE_PRODUCT_LINE_ACTIVE"],"productTypes":["ROOM"],'+
			'"deliveryStatus":["DELIVERY_STARTED"],'+
			'"reservationType":["SELL"],"inventoryStoreId":"'+inventoryStoreId+'"}';
		$http.get(checkedInRoomSearchURL)
			.success(function(data, status, headers, config) {
				if(data != undefined && data.licenses != undefined) {
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

	factory.getFnbExpenseAddon = function() {
		var defer = $q.defer();
		var fnbAddonFound = false;
		var inventoryStoreId = $rootScope.inventoryStore.id;
		var addonSearchURL = rootUrl+'/products?query={"inventoryStoreId":"'+inventoryStoreId+
			'","productType":["EXPENSE"],"code":"'+appGlobal.fnbExpense+'"}';
		$http.get(addonSearchURL)
			.success(function(data, status, headers, config) {
				if(data != undefined && data.products != undefined) {
					data.products.forEach(function(product) {
						if(product.code == appGlobal.fnbExpense) {
							fnbAddonFound = true;
							defer.resolve(product);
						}
					});
				} 
				if(data == undefined) {
					$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
				} 
				if((data.products != undefined && !fnbAddonFound)  || data.products == undefined) {
					$rootScope.popRootModal("Oops! Something broke.", "FNB Expense addon not found, please contact frontdesk.");
				}
			}).error(function(data, status, headers, config) {
				$rootScope.popRootModal("Oops! Something broke.", "Please check your internet connection and refresh.");
			});
		return defer.promise;
	}


	factory.submitFnbAddon = function(expense, addon) {
		var defer = $q.defer();
		var timeNow = moment().format('MMM Do YYYY, h:mm:ss a');
		var createPmsOrderURL = rootUrl+'/pmsOrder';
		var createPmsOrderMsg = '{"orderId":"","bookingAccountId":"'+expense.bookingId+'","newBookingAccountInfo":{},"bookingOrderState":"CONFIRMED","products":{"changedBaseProductLines":[{"changeType":"PRODUCT_LINES_CHANGE_NEW","baseProductLineState":"BASE_PRODUCT_LINE_ACTIVE","productReference":{"productId":"'+addon.id+'"},"count":1,"licensesDiff":{"licenseChanges":{"commonProductLineLicenseChange":{"commonChangeType":"NEW"}},"chargeInfoDiffs":{"commonProductLineDiff":{"commonDiff":{"newCharge":{"chargeType":"PRICE","chargeOverride":{"basePrice":{"price":{"priceFloat":'+expense.amount+'}}},"chargeInfo":{"basePrice":{"price":{"priceFloat":'+expense.amount+'}},"taxes":{"tax":[{"taxType":"NO_TAX","percentage":0,"price":{"currency":"INR","priceFloat":0}}],"totalTax":{"priceFloat":0},"taxModel":"NO_TAX_MODEL"},"finalPrice":{"currency":"INR","priceFloat":'+expense.amount+'},"priceExcludingTax":{"currency":"INR","priceFloat":'+expense.amount+'},"origBasePrice":{}}}}}}},"extraInfos":{"commonInfo":{"infoType":"NOTES","infoNotes":{"notes":"'+expense.extraInfo+'","externalNote":"'+expense.checkNumber+" - "+expense.roomNumber+" - "+authEmail1+" - "+ timeNow +'"}}}}]},"sendConfirmationEmail":false,"isNoBusinessLogicValidation":false}';
		$http.post(createPmsOrderURL, createPmsOrderMsg)
		.success(function(data, status, header, config) {
			if(data != undefined && data.products != undefined) {
				data.products.changedBaseProductLines.forEach(function(changedBaseProductLine) {
					//alert(changedBaseProductLines.extraInfos.commonInfo.infoNotes.externalNote);
					if(changedBaseProductLine.extraInfos.commonInfo.infoNotes != undefined
						&& changedBaseProductLine.extraInfos.commonInfo.infoNotes.externalNote != undefined
						&& changedBaseProductLine.extraInfos.commonInfo.infoNotes.externalNote == expense.checkNumber
						&& changedBaseProductLine.licensesDiff.chargeInfoDiffs.individualProductLineDiff[0].individualDiff[0].newCharge.chargeInfo.finalPrice.priceFloat == expense.amount){
						$rootScope.popRootModal("Added","added successfully");
					} 
				});
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