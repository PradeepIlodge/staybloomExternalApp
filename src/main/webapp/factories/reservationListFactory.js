
staybloomExternalApp.factory('reservationListFactory',
		['$http', '$log', '$q', '$rootScope',
		 function($http, $log, $q, $rootScope)
{
	var factory = {};

	/* individual reservation */
	factory.getReservation = function(resId) {
		var defer = $q.defer();
		var reservationUrl = rootUrl+"/bookingAccounts/" + resId;
		$http.get(reservationUrl)
			.success(function(data, status, headers, config) {
				defer.resolve(convertReservationForView(data));
			}).error(function(data, status, headers, config) {
				defer.resolve(data);
				$rootScope.popRootModal("Oops! Something broke.", "Please try to refresh.");
			});
		return defer.promise;
	};

	
	function convertReservationForView(rawReservation) {
		var reservation = {};
		if(rawReservation.inventoryStore.inventoryStoreId != $rootScope.inventoryStore.id)
			return reservation;
		reservation.bookingId = rawReservation.id;
		reservation.state = rawReservation.state == "BOOKING_ACCOUNT_OPEN" ? "open" : "closed";
		reservation.addonRes = (rawReservation.addonRes != undefined && rawReservation.addonRes != "") ? rawReservation.addonRes : "";
		reservation.address = {};
		reservation.address.locality = rawReservation.inventoryStore.propertyRef.addressBasic.locality;
		reservation.address.address = rawReservation.inventoryStore.propertyRef.addressBasic.address;
		reservation.address.city = rawReservation.inventoryStore.propertyRef.addressBasic.city;
		reservation.address.state = rawReservation.inventoryStore.propertyRef.addressBasic.state;
		
		reservation.inventoryStoreId = rawReservation.inventoryStore.inventoryStoreId;

		reservation.hotel = {};
		reservation.hotel.shortName = rawReservation.inventoryStore.propertyRef.name;
		reservation.hotel.fullName = rawReservation.inventoryStore.propertyRef.fullName;

		reservation.comDetail = {};
		if(rawReservation.comDetail != undefined && rawReservation.comDetai != "") {
			reservation.comDetail = rawReservation.comDetail;
		}
		reservation.bookings = [];
		reservation.cancellations = [];
		reservation.addons = [];
		var totalPriceForReservation = 0;
		var roomNights = 0;
		var roomCount = 0;
		var totalTax = 0;
		var lastCheckout;
		var firstCheckIn;
		if(rawReservation.products.baseProductLines != undefined) {
			rawReservation.products.baseProductLines.forEach(function (product) {
				if(product.productReference.productType == "ROOM") {
					var booking = {};
					booking.lineState = product.baseProductLineState == 'BASE_PRODUCT_LINE_ACTIVE' ?
						"active" :  "cancelled";
					booking.productName = product.productReference.productName;
					booking.productId = product.productReference.productId;
					booking.checkIn = product.timeRange.timeStart.formattedDate;
					booking.checkOut = product.timeRange.timeEnd.formattedDate;
					booking.nights = moment(booking.checkOut, "YYYYMMDD").add(1, "days")
						.diff(moment(booking.checkIn, "YYYYMMDD"), "days");
					if(booking.lineState == "active") {
						lastCheckout = (typeof lastChekout == 'undefined' || typeof(lastChekout) == undefined || lastChekout == 'undefined') ? 
							moment(booking.checkOut, "YYYYMMDD") :
							(moment(booking.checkOut, "YYYYMMDD").isAfter(lastCheckout) ?
							 moment(booking.checkOut, "YYYYMMDD") : lastCheckout);
						firstCheckIn = (typeof firstCheckIn == 'undefined' || typeof(firstCheckIn) == undefined || firstCheckIn == 'undefined') ? 
							moment(booking.checkIn, "YYYYMMDD") :
							(moment(booking.checkIn, "YYYYMMDD").isBefore(firstCheckIn) ?
							 moment(booking.checkIn, "YYYYMMDD") : firstCheckIn);
					}
					booking.info = (typeof product.extraInfos.commonInfo.infoNotes != undefined
									&& typeof product.extraInfos.commonInfo.infoNotes != "undefined")
										? product.extraInfos.commonInfo.infoNotes.notes : "";
					booking.count = product.count;
					roomCount = roomCount + booking.count;
					roomNights = roomNights + (getDifferenceBetweenDates(booking.checkIn, booking.checkOut) * booking.count);
					var totalPriceForRoom = 0;
					product.licenses.chargesForPLs.individualChargesForPL.forEach(function (charges){
						charges.individualCharges.forEach(function (charge){
							totalPriceForRoom = totalPriceForRoom +
								charge.currentCharges.charge.chargeInfo.basePrice.price.priceFloat;
							totalTax = totalTax + charge.currentCharges.charge.chargeInfo.taxes.totalTax.priceFloat;
						});
					});
					booking.charge = totalPriceForRoom;
					totalPriceForReservation = totalPriceForReservation + totalPriceForRoom;
					if(booking.lineState == "active") {
						reservation.bookings.push(booking);
					} else {
						reservation.cancellations.push(booking);
					}
				} else if ((product.productReference.productType == "ADD_ON" || product.productReference.productType == "EXPENSE") &&
						product.productReference.productName != "OTA Tax") {
					var addon = {};
					addon.lineState = product.baseProductLineState == 'BASE_PRODUCT_LINE_ACTIVE' ?
						"active" :  "cancelled";
					addon.productName = product.productReference.productName;
					addon.productCode = product.productReference.productCode;
					addon.productId = product.productReference.productId;
					addon.info = (typeof product.extraInfos.commonInfo.infoNotes != undefined
							&& typeof product.extraInfos.commonInfo.infoNotes != "undefined")
							? product.extraInfos.commonInfo.infoNotes.notes : "";
					addon.externalNote = (typeof product.extraInfos.commonInfo.infoNotes != undefined
							&& typeof product.extraInfos.commonInfo.infoNotes != "undefined")
							? product.extraInfos.commonInfo.infoNotes.externalNote : "";
					addon.count = product.count;
					var totalPriceForAddon = 0;
					product.licenses.chargesForPLs.individualChargesForPL.forEach(function (charges){
						charges.individualCharges.forEach(function (charge){
							totalPriceForAddon = totalPriceForAddon +
								charge.currentCharges.charge.chargeInfo.basePrice.price.priceFloat;
							totalTax = totalTax + charge.currentCharges.charge.chargeInfo.taxes.totalTax.priceFloat;
						});
					});
					addon.charge = totalPriceForAddon;
					totalPriceForReservation = totalPriceForReservation + totalPriceForAddon;
					reservation.addons.push(addon);
				} else if (product.productReference.productType == "ADD_ON" &&
						product.productReference.productName == "OTA Tax") {
					product.licenses.chargesForPLs.individualChargesForPL.forEach(function (charges){
						charges.individualCharges.forEach(function (charge){
							totalTax = totalTax + charge.currentCharges.charge.chargeInfo.basePrice.price.priceFloat;
						});
					});
				}
			});
		}
		reservation.lastCheckout= (typeof lastCheckout != "undefined" && lastCheckout != "undefined" && lastCheckout != "") ? lastCheckout.format("YYYYMMDD") : "-";
		reservation.firstCheckIn= (typeof firstCheckIn != "undefined" && firstCheckIn != "undefined" && firstCheckIn != "") ? firstCheckIn.format("YYYYMMDD") : "-";
		reservation.roomCount	= roomCount;
		reservation.nights	= roomNights;
		reservation.charge	= totalPriceForReservation;
		reservation.tax		= totalTax;
		reservation.booker	= "";
		if(rawReservation.buyerAccountId.customerUser.name != undefined) {
			reservation.booker = rawReservation.buyerAccountId.customerUser.name.firstName + " " +
				rawReservation.buyerAccountId.customerUser.name.lastName;
		}
		reservation.guests = [];
		if(typeof rawReservation.guestListInfo != undefined && rawReservation.guestListInfo != undefined 
				&& typeof rawReservation.guestListInfo.masterGuest != undefined 
				&& rawReservation.guestListInfo.masterGuest != undefined) {
			rawReservation.guestListInfo.masterGuest.forEach(function (guest){
				var guestDetail = {};
				guestDetail.name = guest.details.username.firstName + " " +
						guest.details.username.lastName;
			
				reservation.guests.push(guestDetail);
			});
		}
		
		reservation.payments = [];
		var totalPayment = 0;
		if(typeof rawReservation.billingAccount != 'undefined' && rawReservation.billingAccount != 'undefined'
			&& rawReservation.billingAccount.containedBillingAccount != undefined
			&& rawReservation.billingAccount.containedBillingAccount.payments != undefined
			&& rawReservation.billingAccount.containedBillingAccount.payments.payment != undefined) {
			rawReservation.billingAccount.containedBillingAccount.payments.payment.forEach(function(payment){
				var paymentDetail = {};
				paymentDetail.modeOfPayment = payment.modeOfPayment;
				paymentDetail.state = payment.paymentState;
				paymentDetail.paymentTime = payment.paymentTime.milliSeconds;
				paymentDetail.amount = payment.amount.priceFloat;
				if(paymentDetail.state == "ACTIVE") {
					totalPayment = totalPayment + paymentDetail.amount;
				}
				reservation.payments.push(paymentDetail);
			});
		}
		reservation.payment = totalPayment;
		return reservation;
	}
	/* individual reservation */




	function makeReservationArrayForView(data) {
		var reservationList = [];
		if(data.searchSummary.totalHits > 0) {
			data.licenses.forEach( function(res) {
				var reservation = new Object();
				reservation.bookingId = res.bookingId;
				reservation.reservationType = res.reservationType;
				reservation.comDetail = {};
				if(res.comDetail != undefined) {
					reservation.comDetail = res.comDetail;
				}
				reservation.isBTC = res.billingAccRef.billingAccountScope == "LONG_TERM" ? true : false;
				reservation.state = res.state == "BOOKING_ACCOUNT_OPEN" ? "open" : "closed";
				reservation.product = res.product.productReference.productName;
				reservation.productId = res.product.productReference.productId;
				reservation.status = res.product.lineUsage.delivery.deliveryStatus;
				reservation.lineState = res.product.lineState == 'BASE_PRODUCT_LINE_ACTIVE' ? 'active' : 'cancelled';
				if(res.product.fulfillment != undefined && res.product.fulfillment.individualFulfillment != undefined)
					reservation.room = res.product.fulfillment.individualFulfillment[0].roomReference.roomName;
				reservation.checkIn = res.product.timeRange.timeStart.formattedDate;
				reservation.checkIn = res.product.timeRange.timeStart.formattedDate;
				reservation.checkOut = res.product.timeRange.timeEnd.formattedDate;
				reservation.nights = moment(reservation.checkOut, "YYYYMMDD").add(1, "days")
					.diff(moment(reservation.checkIn, "YYYYMMDD"), "days");
				var totalPrice = 0;
				res.product.chargeAndBill.individualCharges.forEach(function(charge) {
					totalPrice = totalPrice + charge.currentCharges.charge.chargeInfo.basePrice.price.priceFloat;
				});
				reservation.charge = totalPrice;
				if(typeof res.buyerAccountId != undefined && res.buyerAccountId != undefined
						&& typeof res.buyerAccountId.customerUser != undefined && res.buyerAccountId.customerUser != undefined 
						&& typeof res.buyerAccountId.customerUser.name != undefined && res.buyerAccountId.customerUser.name != undefined) {
					reservation.booker = res.buyerAccountId.customerUser.name.firstName + " " +
						(res.buyerAccountId.customerUser.name.lastName != undefined ?
						 res.buyerAccountId.customerUser.name.lastName : "");
				} else {
					reservation.booker = "";
				}
				if(typeof res.primaryGuest != undefined && res.primaryGuest != undefined 
						&& typeof res.primaryGuest.details != undefined && res.primaryGuest.details != undefined
						&& res.primaryGuest.details.username != undefined) {
					reservation.guest = res.primaryGuest.details.username.firstName + " " +
						(res.primaryGuest.details.username.lastName != undefined ?
						 res.primaryGuest.details.username.lastName : "");
				} else {
					reservation.guest = "";
				}
				reservationList.push(reservation);
			});
		}
		return reservationList;
	}
	factory.makeReservationArrayForView = makeReservationArrayForView;

	factory.getSearchByBookersNameReservationList = function(inventoryStoreId, bookersName) {
		var defer = $q.defer();
		var dailyReservationURL = rootUrl+'/search/licenseGroups?query={'+
			'"nameOrCode":"'+bookersName+'",'+
			'"lineStates":["BASE_PRODUCT_LINE_ACTIVE","BASE_PRODUCT_LINE_CANCELLED"],'+
			'"productTypes":["ROOM"],"reservationType":["SELL"],"inventoryStoreId":"'+inventoryStoreId+'"}';
		$http.get(dailyReservationURL)
		.success(function(data, status, header, config){
			defer.resolve(makeReservationArrayForView(data));
		})
		.error(function(data, status, header, config){
		});
		return defer.promise;
	};
	
	factory.getSearchByReservationReservationList = function(inventoryStoreId, resId) {
		var defer = $q.defer();
		var dailyReservationURL = rootUrl+'/search/licenseGroups?query={'+
			'"bookingId":"'+resId+'",'+
			'"lineStates":["BASE_PRODUCT_LINE_ACTIVE","BASE_PRODUCT_LINE_CANCELLED"],'+
			'"productTypes":["ROOM"],"reservationType":["SELL"],"inventoryStoreId":"'+inventoryStoreId+'"}';
		$http.get(dailyReservationURL)
		.success(function(data, status, header, config){
			defer.resolve(makeReservationArrayForView(data));
		})
		.error(function(data, status, header, config){
		});
		return defer.promise;
	};

	factory.getDailyStayReservationList = function(inventoryStoreId, roomId, dateStart, dateEnd) {
		var defer = $q.defer();
		var dailyReservationURL = rootUrl+'/search/licenseGroups?query={'+
			'"consumptionDates":{"timeStart":{"formattedDate":"'+dateStart+'"},"timeEnd":{"formattedDate":"'+dateEnd+'"}},'+
			'"lineStates":["BASE_PRODUCT_LINE_ACTIVE","BASE_PRODUCT_LINE_CANCELLED"],"productId":"'+roomId+'",'+
			'"productTypes":["ROOM"],"reservationType":["SELL"],"inventoryStoreId":"'+inventoryStoreId+'"}';
		$http.get(dailyReservationURL)
		.success(function(data, status, header, config){
			defer.resolve(makeReservationArrayForView(data));
		})
		.error(function(data, status, header, config){
		});
		return defer.promise;
	};

	factory.getDailyCheckinReservationList = function(inventoryStoreId, roomId, dateStart, dateEnd) {
		var defer = $q.defer();
		var dailyReservationURL = rootUrl+'/search/licenseGroups?query={'+
			'"checkinDates":{"timeStart":{"formattedDate":"'+dateStart+'"},"timeEnd":{"formattedDate":"'+dateEnd+'"}},'+
			'"lineStates":["BASE_PRODUCT_LINE_ACTIVE"],"productId":"'+roomId+'",'+
			'"productTypes":["ROOM"],"reservationType":["SELL"],"inventoryStoreId":"'+inventoryStoreId+'"}';
		$http.get(dailyReservationURL)
		.success(function(data, status, header, config){
			defer.resolve(makeReservationArrayForView(data));
		})
		.error(function(data, status, header, config){
		});
		return defer.promise;
	};

	factory.getDailyCheckoutReservationList = function(inventoryStoreId, roomId, dateStart, dateEnd) {
		var defer = $q.defer();
		var dailyReservationURL = rootUrl+'/search/licenseGroups?query={'+
			'"checkoutDates":{"timeStart":{"formattedDate":"'+dateStart+'"},"timeEnd":{"formattedDate":"'+dateEnd+'"}},'+
			'"lineStates":["BASE_PRODUCT_LINE_ACTIVE"],"productId":"'+roomId+'",'+
			'"productTypes":["ROOM"],"reservationType":["SELL"],"inventoryStoreId":"'+inventoryStoreId+'"}';
		$http.get(dailyReservationURL)
		.success(function(data, status, header, config){
			defer.resolve(makeReservationArrayForView(data));
		})
		.error(function(data, status, header, config){
		});
		return defer.promise;
	};

	factory.getDailyOOOReservationList = function(inventoryStoreId, roomId, dateStart, dateEnd) {
		var defer = $q.defer();
		var dailyReservationURL = rootUrl+'/search/licenseGroups?query={"checkinDates":{"timeStart":'+
			'{"formattedDate":"'+dateStart+'"},"timeEnd":{"formattedDate":"'+dateStart+'"}},"checkoutDates":'+
			'{"timeStart":{"formattedDate":"'+dateEnd+'"},"timeEnd":{"formattedDate":"'+dateEnd+'"}},'+
			'"lineStates":["BASE_PRODUCT_LINE_ACTIVE"],"productTypes":["ROOM"],'+
			'"reservationType":["OUT_OF_ORDER"],"inventoryStoreId":"'+inventoryStoreId+'"}';
		$http.get(dailyReservationURL)
		.success(function(data, status, header, config){
			defer.resolve(makeReservationArrayForView(data));
		})
		.error(function(data, status, header, config){
		});
		return defer.promise;
	};


	factory.cancelReservation = function(bookingIdToCancel) {
		var defer = $q.defer();
		var cancelReservationURL = rootUrl+'/pmsOrder';
		var cancelReservationMsg = '{"orderId":"","bookingAccountId":"'+bookingIdToCancel+
			'","bookingOrderState":"CONFIRMED","cancelReservation":true,'+
			'"isDryRun":false,"isNoBusinessLogicValidation":false}';
		$http.post(cancelReservationURL, cancelReservationMsg)
		.success(function(data, status, header, config){
			defer.resolve(data.reservationType);
		})
		.error(function(data, status, header, config){
			alert("could not decrease inventory : "+bookingIdToCancel);
		});
		return defer.promise;
	};


	factory.makeOOOReservation = function(inventoryStore, roomId, startDate, endDate, count) {
		var defer = $q.defer();
		var makeOOOReservationURL = rootUrl+'/pmsOrder';
		var makeOOOReservationMsg = '{"orderId":"","bookingOrderState":"CONFIRMED","pendingOrderBlockPolicy"'+
			':{"blockTypeEnum":"NO_BLOCK_ON_PENDING_CONFIRMATION"},"products":{"changedBaseProductLines"'+
			':[{"changeType":"PRODUCT_LINES_CHANGE_NEW","productReference":{'+
			'"productId":"'+roomId+'","productType":"ROOM","infoType":"NOTES",'+
			'"productGroupId":"'+inventoryStore+'_ROOM","inventoryStore":{"inventoryStoreId":'+
			'"'+inventoryStore+'"},"currency":"ANYCURRENCY"},"timeRange":{"timeStart"'+
			':{"formattedDate":"'+startDate+'"},"timeEnd":{"formattedDate":"'+endDate+'"}},"count":'+count+'}'+
			']},"isNoBusinessLogicValidation":false,"reservationType":"OUT_OF_ORDER",'+
			'"inventoryStore":{"inventoryStoreId":"'+inventoryStore+'"}}';
		$http.post(makeOOOReservationURL, makeOOOReservationMsg)
		.success(function(data, status, header, config){
			defer.resolve(data.reservationType);
		})
		.error(function(data, status, header, config){
			defer.resolve("error");
		});
		return defer.promise;
	};


	return factory;
}]);