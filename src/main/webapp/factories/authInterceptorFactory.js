
staybloomExternalApp.factory('authInterceptorFactory',
		['$q', '$rootScope', '$location', '$window', '$document', '$cookies', '$log',
		 function ($q, $rootScope, $location, $window, $document, $cookies, $log)
{
	var cheapTrickForLocalhost = function() {
		if($window.location.hostname == "localhost" && !$window.location.pathname.indexOf(rootUrl2) > -1)
			return "%2FexternalApp";
		else
			return "";
	};
	var tempString = cheapTrickForLocalhost();
	var loginRedirect = $window.location.origin+"/pmsServerSB/login?realm="+$window.location.origin+"&loginUri=/pmsServerSB/login&redirectUri=/"+tempString+"%2Fhome.html";
	var exemptViews = ["views/info.html","views/logout.html"];
	
	var canceler = $q.defer();
	return {
		'request': function(config) {
			config.timeout = canceler.promise;
			var authEmail = $cookies.authEmail;
			if(!($.inArray(config.url, exemptViews) > -1)) {
				if(typeof(authEmail) == 'undefined' && authEmail == undefined || authEmail == '' || authEmail == '""') {
					config.url = loginRedirect;
					canceler.resolve(); //un comment to cancel request
					$window.location.href = loginRedirect;
				} else {
					if(typeof($rootScope.userEmail) == 'undefined' || $rootScope.userEmail == undefined || $rootScope.userEmail == "") {
						$rootScope.userEmail = authEmail.replace(/['"]+/g, '');
					}
					if(typeof($rootScope.inventoryStore) == 'undefined' || $rootScope.inventoryStore.id == undefined || $rootScope.inventoryStore.id == ""){
						$location.path("/");
					}
				}
				return config || $q.when(config);
			} else {
				return config || $q.when(config);
			}
		}
	};
}]);