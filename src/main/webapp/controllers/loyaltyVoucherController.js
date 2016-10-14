
staybloomExternalApp.controller('loyaltyVoucherController',
		['$log', '$rootScope', '$scope', '$location', '$http', '$routeParams',
		 'loyaltyVoucherFactory', 'pdfFactory',
		 function($log, $rootScope, $scope, $location, $http, $routeParams,
				 loyaltyVoucherFactory, pdfFactory)
{
			$scope.updateLoyaltyVoucher = {};
			$scope.addLoyaltyVoucher = function (loyaltyData) {
				loyaltyVoucherFactory.checkProfileId(loyaltyData.profileId).then(function(data) {
					if(data != undefined){
						if(data.bookerProfile.details.subscriptionStatus != undefined &&
								data.bookerProfile.details.subscriptionStatus.loyaltyProgramSignup != undefined &&
								data.bookerProfile.details.subscriptionStatus.loyaltyProgramSignup == true ) {
							loyaltyVoucherFactory.submitLoyaltyVoucher(loyaltyData).then(function(data) {
								$rootScope.popRootModal("Gift voucher details.", "Gift voucher id : "+ data.id);
							});
						} else {
							$rootScope.popRootModal("Oops! Error.", "Voucher data not inserted.");
						}
					} else {
						$rootScope.popRootModal("Oops! Error.", "Profile id not found.");
					}
				});
			};
			
			$scope.checkLoyaltyVoucher = function (loyaltyVoucher) {
				loyaltyVoucherFactory.checkLoyaltyVoucher(loyaltyVoucher).then(function(data) {
					$scope.updateLoyaltyVoucher = setLoyaltyVoucherDate(data);
				});
			}

			function setLoyaltyVoucherDate(data) {
				var obj = {};
				obj.voucherId = data.id;
				obj.profileId = data.profieId;
				obj.voucherTag = data.name;
				obj.description = data.message;
				obj.valid = data.voucherState == "VALID" ? true : false;
				obj.voucherPoints = data.points.priceFloat;
				return obj;
			}

			$scope.updateLoyaltyVoucherData = function (updateLoyaltyVoucher) {
				loyaltyVoucherFactory.updateLoyaltyVoucherData(updateLoyaltyVoucher).then(function(data) {
					$rootScope.popRootModal("Voucher updated.", "Voucher updated with voucher id : "+data.id);
				});
			};
			
}]);