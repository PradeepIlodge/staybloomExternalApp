var loc = window.location.href;
var loc2 = window.location.hostname;
loc = loc.substring(0, loc.lastIndexOf("/"));

if(loc.lastIndexOf("/#") > -1) {
	loc = loc.substring(0, loc.lastIndexOf("/#"));
}
//enable to run on localhost, disable to run on hosted server
//loc = loc.substring(0, loc.lastIndexOf("/"));
var rootUrl = loc+"/pmsServerSB";
var rootUrl2= "http://"+loc2+"/pmsServerSB";
var inventoryStoreId = "";
var userEmail = "";
var checkedInRoom = "";

var staybloomExternalApp = angular.module('staybloomExternalApp', 
		['ngRoute', 'angular-loading-bar', 
         'ngAnimate', 'ngCookies', 'ui.bootstrap', 'ui.router'])
.run(function($rootScope) {
	$rootScope.inventoryStore = {};
	$rootScope.inventoryStore.id = inventoryStoreId;
	$rootScope.userEmail = userEmail;
	$rootScope.checkedInRoom = checkedInRoom;
});


//Define Routing for app
staybloomExternalApp.config( function ($httpProvider, $routeProvider, $stateProvider, $urlRouterProvider) {
	$httpProvider.interceptors.push('authInterceptorFactory');
	$httpProvider.interceptors.push('httpInterceptorFactory');
	$routeProvider
		.when('/', {
			templateUrl: 'views/propertyList.html',
			controller : 'propertyListController',
			activetab  : 'none'
		})
		.when('/externalAppTypes', {
			templateUrl: 'views/externalAppList.html',
			controller : 'externalAppListController',
			activetab  : 'dashboard'
		})
		.when('/getApplicationView/F&B CHARGES', {
			templateUrl: 'views/fnbAddon.html',
			controller : 'fnbAddonController',
			activetab  : 'F&B CHARGES'
		})
		.when('/getApplicationView/GIFT VOUCHERS', {
			templateUrl: 'views/loyaltyVoucher.html',
			controller : 'loyaltyVoucherController',
			activetab  : 'GIFT VOUCHERS'
		})
		.when('/getApplicationView/PRODUCTIVITY REPORT', {
			templateUrl: 'views/productivityReport.html',
			controller : 'productivityReportController',
			activetab  : 'PRODUCTIVITY REPORT'
		})
		.when('/getApplicationView/LOYALTY REPORT/:profileId', {
			templateUrl: 'views/loyaltyReport.html',
			controller : 'loyaltyReportController',
			activetab  : 'LOYALTY REPORT'
		})
		.when('/logout', {
			templateUrl: 'views/logout.html'
		})
		.otherwise({
			redirectTo: '/'
		});
});