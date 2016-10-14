
staybloomExternalApp.controller('rootModalController',
		['$scope', '$rootScope', '$log',
		 function($scope, $rootScope, $log)
{
	
	$rootScope.popRootModal = function(header, body, refreshEnable) {
		newModal = {};
		newModal.header = header;
		newModal.body = body;
		newModal.refreshEnable = (refreshEnable == undefined || refreshEnable == null) ? true : refreshEnable;
		$scope.modalData = newModal;
		var element = angular.element('#rootModal');
		element.modal('show');
	};

}]);