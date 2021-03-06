//fnbAddonController
staybloomExternalApp.controller('fnbAddonController',
		['$rootScope', '$scope', '$log', '$location', '$http', '$route',
		 '$routeParams', 'fnbAddonFactory', 'reservationListFactory', 'roomListFactory',
		 function($rootScope, $scope, $log, $location, $http, $route,
				 $routeParams, fnbAddonFactory, reservationListFactory, roomListFactory)
{
			$scope.roomNo = '';
      			$scope.states = ['Alabama', 'Alaska'];
			$scope.expenseCode = appGlobal.fnbExpense;
			$scope.selectedRoomNumber = '';
			$scope.addDataStatus = '';
			$scope.busy = false;
			$scope.searchReservationsByRoomNumber = function (room) {
				$scope.showExpenseDiv = false;
				$scope.reservationList = '';
				$scope.expense = '';
				$scope.booking = '';
				fnbAddonFactory.getCheckedInReservationList(room).then(function(data) {
					$scope.reservationList = reservationListFactory.makeReservationArrayForView(data);
				});
			};

			$scope.roomNumbers = [];
			roomListFactory.getCompleteRoomList().then(function(data) {
				if(data.rooms) {
					data.rooms.forEach(function (room) {
						$scope.roomNumbers.push(room.code);
					});
				} else {
					$rootScope.popRootModal("Warning.", "Room list was empty.", false);
				}
			});
			
			$scope.activateBookingAndLoadExpenseDiv = function (license) {
				$scope.booking = undefined;
				$scope.showExpenseDiv = false;
				reservationListFactory.getReservation(license.bookingId).then(function(booking) {
					$scope.chargeMessage = "charge will be posted to Guest bill reservation";
					$scope.active = license;
					var expense = {};
					$scope.expense = expense;
					$scope.expense.isBTC = license.isBTC;
					$scope.expense.roomNumber = license.room;
					if(license.isBTC && (booking.addonRes != "")) {
						reservationListFactory.getReservation(booking.addonRes).then(function(bookingBill) {
							$scope.booking = bookingBill;
							$scope.expense.bookingId = booking.addonRes;
							$scope.expense.booker = bookingBill.booker;
							$scope.showExpenseDiv = true;
							$scope.busy = false;
						});
					} else {
						$scope.chargeMessage = "";
						$scope.booking = booking;
						$scope.expense.bookingId = license.bookingId;
						$scope.expense.booker = license.booker;
						$scope.showExpenseDiv = true;
						$scope.busy = false;
					}
				});
			};
			
			function clearForm() {
				$scope.expense.roomNumber = "";
				$scope.expense.bookingId = "";
				$scope.expense.booker = "";
				$scope.expense.checkNumber = "";
				$scope.expense.amount = "";
				$scope.expense.extraInfo = "";
			}

			$scope.submitFnbAddon = function(expense) {
				$scope.busy = true;
				fnbAddonFactory.getFnbExpenseAddon().then(function(addon) {
					fnbAddonFactory.submitFnbAddon(expense, addon).then(function(reservation) {
						if(reservation != undefined && reservation.orderId != undefined && reservation.orderId != "") {
							clearForm();
							$rootScope.popRootModal("Success.", "Addon was successfully added.", false);
						} else {
							$scope.busy = false;
							$rootScope.popRootModal("Error.", "Please try again or contact frontdesk.", false);
						}
					});
				});
			};
			
			$scope.isDataAdded = function() {
				if($scope.addDataStatus == undefined || typeof($scope.addDataStatus) == 'undefined' || $scope.addDataStatus == "") {
					return false;
				} else {
					return true;
				}
			};
			
}]);