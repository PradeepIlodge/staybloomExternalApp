
var pendingRequestStack = [];

staybloomExternalApp.factory('httpInterceptorFactory',
		function ($q, $location, $document)
{
	return {
		request: function (config) {
			if(pendingRequestStack.length > 4) {
				//alert("rejecting");
				//config.timeout = $q.defer().promise;
			}
			pendingRequestStack.push(1);
			return config || $q.when(config);
		},
		response: function (response) {
			pendingRequestStack.pop();
			/*
			if(response.headers()['content-type'] === "application/json; charset=utf-8"){
				// Validate response, if not ok reject
				var data = examineJSONResponse(response); // assumes this function is available
				if(!data)
					return $q.reject(response);
			}*/
			return response;
		},
		responseError: function (response) {
			pendingRequestStack.pop();
			return $q.reject(response);
		}

	};
});