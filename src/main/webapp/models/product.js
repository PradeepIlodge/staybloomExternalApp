staybloomExternalApp.factory('product', ['$http', function($http) {
	
	function product(productData) {
		if (productData) {
			this.setData(productData);
		}
	};
	
	product.prototype = {
		setData: function(productData) {
			angular.extend(this, productData);
		},
		load: function(id) {
			var scope = this;
			$http.get(rootUrl+'/pmsServer/debugServer/{"entityType":"PRODUCT","id":"'+id+'"}').success(function(productData) {
				scope.setData(productData);
			});
		}
	};
	
	return product;
}]);
