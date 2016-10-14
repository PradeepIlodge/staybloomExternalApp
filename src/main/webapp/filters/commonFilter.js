
staybloomExternalApp.filter('cmdate', [
	'$filter', function($filter) {
		return function(input, format) {
			return (moment(input, "YYYYMMDD").format(format));
		};
	}
]);
staybloomExternalApp.filter('cmdateIncrement', [
	'$filter', function($filter) {
		return function(input, format) {
			return (moment(input, "YYYYMMDD").add(1, 'days').format(format));
		};
	}
]);
staybloomExternalApp.filter('formatedDate', [
	'$filter', function($filter) {
		return function(dateString, inputFormat, outputFormat) {
			return (moment(dateString, inputFormat).format(outputFormat));
		};
	}
]);
staybloomExternalApp.filter('formatedDateIncrement', [
	'$filter', function($filter) {
		return function(dateString, inputFormat, outputFormat) {
			return (moment(dateString, inputFormat).add(1, 'days').format(outputFormat));
		};
	}
]);
staybloomExternalApp.filter('uiStatus', [
	'$filter', function($filter) {
		return function(input) {
			uiStatus = "";
			switch (input) {
			case "DELIVERY_NOT_REQUESTED":
				uiStatus = "";
				break;
			case "DELIVERY_STARTED":
				uiStatus = "Checked-in";
				break;
			case "DELIVERY_STOPPED":
				uiStatus = "Checked-out";
				break;
			case "DELIVERED":
				uiStatus = "Used";
				break;
			case "DELIVERY_EXPIRED":
				uiStatus = "No-show";
				break;
			}
			return uiStatus;
		};
	}
]);
staybloomExternalApp.filter('milliToDate', [
	'$filter', function($filter) {
		return function(input, format) {
			return (moment(input).add(1, 'days').format(format));
		};
	}
]);
staybloomExternalApp.filter('paymentType', [
 	'$filter', function($filter) {
 		return function(input) {
 			if(input == "POSTPAID")
 				return "PAY AT HOTEL";
 			else
 				return input;
 		};
 	}
 ]);
staybloomExternalApp.filter('cutString', [
	'$filter', function ($filter) {
		return function (value, wordwise, max, tail) {
			if (!value) return '';

			max = parseInt(max, 10);
			if (!max) return value;
			if (value.length <= max) return value;

			value = value.substr(0, max);
			if (wordwise) {
				var lastspace = value.lastIndexOf(' ');
				if (lastspace != -1) {
					value = value.substr(0, lastspace);
				}
			}

			return value + (tail || ' …');
		};
	}
]);
staybloomExternalApp.filter('commissionedPrice', [
	'$filter', function ($filter) {
		return function (value, comDetail) {
			if (!value || value == 0) {
				return 0;
			}
			else if(!comDetail) {
				return value;
			}

			iLodgeCom = !comDetail.iLodgeCom ? 100 : comDetail.iLodgeCom;
			OTACom = !comDetail.OTACom ? 0 : comDetail.OTACom;
			n = 0;
			if (comDetail.payType == "PREPAID") {
				n = 100 * ( iLodgeCom - OTACom ) / ( 100 - OTACom );
			}
			calculatedPrice = value - (value * n / 100);
			return calculatedPrice;
		};
	}
]);