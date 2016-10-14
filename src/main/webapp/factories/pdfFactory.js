
staybloomExternalApp.factory('pdfFactory',
		['$q', '$log', '$http',
		 function($q, $log, $http)
{
	var factory = {};

	factory.getSOA = function(reservationId) {
		$http.get(rootUrl+"/soa/"+reservationId)
		.success(function(data, status, headers, config) {
			$http({
				method: 'POST',
				url: rootUrl2+"/soa/exp/"+reservationId,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: "data="+JSON.stringify(data),
				responseType: 'arraybuffer'
			}).success(function(data, status, headers, config) {
				var file = new Blob([data], { type: 'application/pdf' });
				saveAs(file, "statementOfAccount_"+reservationId);
			}).error(function(data, status, headers, config) {
				alert("failed to get pdf");
			});
		}).error(function(data, status, headers, config) {
			alert("failed to get soa");
		});
	}

	factory.closeAccountAndDownloadAndEmailInvoice = function(reservationId) {
		var defer = $q.defer();
		if(confirm('Are you sure you want to close account and download invoice?\n\nAll rooms in this reservation will be released and made availabe on the website.')) {
			$http({
				method: 'POST',
				url: rootUrl2+"/closeReservation/"+reservationId,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				responseType: 'arraybuffer'
			}).success(function(data, status, headers, config) {
				var file = new Blob([data], { type: 'application/pdf' });
				saveAs(file, "TaxInvoice_"+reservationId);
				defer.resolve(data);
			}).error(function(data, status, headers, config) {
				alert("failed to get pdf");
			});
		} else {
			defer.resolve("oops");
		}
		return defer.promise;
	}

	factory.downloadInvoice = function(reservationId) {
		$http({
			method: 'GET',
			url: rootUrl2+"/taxInvoice?query="+reservationId,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			responseType: 'arraybuffer'
		}).success(function(data, status, headers, config) {
			var file = new Blob([data], { type: 'application/pdf' });
			saveAs(file, "TaxInvoice_"+reservationId);
		}).error(function(data, status, headers, config) {
			alert("failed to get pdf");
		});
	}

	return factory;
}]);
