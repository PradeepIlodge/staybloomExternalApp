
staybloomExternalApp.controller('productivityReportController',
		['$log', '$rootScope', '$scope', '$location', '$http', '$routeParams',
		 'exportReservationListFactory', 'occupancyFactory', 'pdfFactory',
		 function($log, $rootScope, $scope, $location, $http, $routeParams,
				 exportReservationListFactory, occupancyFactory, pdfFactory)
{
	$scope.tags = pmsTagId;
	$scope.tag;
	var getSOM = function() {
		return moment($scope.forDate).startOf('month').format("YYYYMMDD");
	};
	var getEOM = function() {
		return moment($scope.forDate).endOf('month').format("YYYYMMDD");
	};
	$scope.populateView = function() {
		exportReservationListFactory.getReservationList($rootScope.inventoryStore.id, $scope.tag, getSOM(), getEOM()).then(function(data) {
			$scope.reservationList = data;
			$scope.productivitySummary = exportReservationListFactory.getProductivitySummary($scope.reservationList);
			loadAverages($scope.productivitySummary);
			$scope.loadNightsBars($scope.productivitySummary);
		});
	};
	/*$scope.$watch("forDate", function() {
		if(typeof($scope.forDate) != undefined && $scope.forDate != undefined && $scope.forDate != "") {
			forDate = moment($scope.forDate).format("YYYYMMDD");
			$scope.populateView();
		}
	});*/
	$scope.showLoyaltySummary = function(profileId){
		$location.path("/getApplicationView/LOYALTY REPORT/"+profileId);
        }
	loadAverages = function(productivitySummary) {
		var totalRevenue = 0;
		var totalNights = 0;
		for(i=0; i<productivitySummary.length; i++) {
			totalRevenue += productivitySummary[i].monthRevenue;
			totalNights += productivitySummary[i].monthNights;
		}
		$scope.totalRevenue = totalRevenue;
		$scope.totalNights = totalNights;
		$scope.avgAdr = totalRevenue/totalNights;
	}

	var universalGraphHeight = 400;
	//bar graph start
	var loadBars = function(array) {
		document.getElementById("magicBox").innerHTML = "";
		var dataArray;
		dataArray = [{"label":"20140301", "value":20}, {"label":"20140302", "value":30},
					{"label":"20140303", "value":38},
					{"label":"20140304", "value":10}, {"label":"20140305", "value":16},
					{"label":"20140306", "value":32}, {"label":"20140307", "value":0}];
		if(array != "a") {
			dataArray = array;
		}
		dataArray.sort(function(a, b){
			return b.value - a.value;
		});
		var top10BarData = [];
		for(i=0; i<barData.length && i<10; i++) {
			top10BarData[i] = dataArray[i];
		}
		dataArray = top10BarData;
		var width = 500;
		var height = universalGraphHeight;
		var getMaxValue = function(dataArray) {
			var max = 1;
			for(var i=0; i<dataArray.length; i++) {
				if(dataArray[i].value > max)
					max = dataArray[i].value;
			}
			return max + (max/10);
		}
		var dataScale = d3.scale.linear()
					.domain([0, getMaxValue(dataArray)])
					.range([0, height - 45]);
		var color = d3.scale.linear()
			.domain([0, getMaxValue(dataArray)])
			.range(["#E02E2E", "#3c7cbe"]);

		var canvas = d3.select('#magicBox')
					.append('svg')
					.attr("width", width)
					.attr("height", height);

		var barsOcc = canvas.selectAll("rect")
					.data(dataArray)
					.enter();

		var someItem = barsOcc.append("rect")
					.attr("width", 40)
					.attr("height", function(d) {return 0;})
					.attr("x", function(d, i) { return ((i)*50)+8; })
					.attr("y", function(d, i) { return height; })
					.attr("fill", function(d) {
						return color(d.value);
					})
					.style("stroke", "black")
					.style("stroke-width", 1)
					.transition()
					.delay(function(d, i) { return (i * 100)+500; })
					.duration(1000)
					.attr("height", function(d) {return dataScale(d.value)+20;})
					.attr("y", function(d, i) { return height - dataScale(d.value) - 60; });

		var someItem = barsOcc.append("text")
					.classed('data', true)
					.attr("x", function(d, i) { return ((i)*50)+8; })
					.attr("y", function(d, i) { return height; })
					.style("stroke-width", 1)
					.style({"font-size":"12px","font-weight":"200","z-index":"999999999"})
					.text(function(d) { return d.value.toFixed(0)})
					.transition()
					.delay(function(d, i) { return (i * 100)+500; })
					.duration(1000)
					.attr("y", function(d, i) { return height - dataScale(d.value) - 65; });

		var someItem = barsOcc.append("text")
					.classed('data', true)
					.attr("fill","#000")
					.attr("y", function(d, i) { return ((i)*50)+33; })
					.attr("x", function(d, i) { return -height+2; })
					.style("stroke-width", 1)
					.style({"font-size":"12px","font-weight":"500","z-index":"999999999"})
					.text(function(d) {
						return d.label;
					})
					.attr("transform", function(d) {
						return "rotate(-90)" 
					});

	};
	//bar graph end, loadBars("a");


	//chart start
	var loadSlices = function(array) {
		document.getElementById("magicBox").innerHTML = "";
		var w = universalGraphHeight;
		var h = universalGraphHeight;
		var r = h/2;
		var color = d3.scale.category10();
		var data;
		/*array = [{"label":"cancelled", "value":18}, 
		            {"label":"booked1", "value":40}, 
		            {"label":"booked2", "value":40}, 
		            {"label":"booked3", "value":40}, 
		            {"label":"booked4", "value":40}, 
		            {"label":"booked5", "value":40}, 
		            {"label":"booked6", "value":40}, 
		            {"label":"booked7", "value":40}, 
		            {"label":"booked8", "value":40}, 
		            {"label":"booked9", "value":40}, 
		            {"label":"booked10", "value":40}, 
		            {"label":"tentative", "value":17}];*/

		array.sort(function(a, b){
			return b.value - a.value;
		});
		var top10AndOthers = [];
		for(i=0; i<array.length; i++) {
			if(i < 10) {
				top10AndOthers[i] = array[i];
			} else if (i == 10) {
				top10AndOthers[i] = array[i];
				top10AndOthers[i].label = "Others";
			} else {
				top10AndOthers[10].value += array[i].value;
			}
		}
		data = top10AndOthers;
		/*var color = d3.scale.ordinal()
			.domain(0,100)
			.range(["#0074D9", "#2ECC40", "#FF4136", "#FF851B", "#FFDC00", "#001f3f"]);*/

		var vis = d3.select('#magicBox')
		.append("svg:svg")
		.data([data])
		.attr("width", w)
		.attr("height", h)
		.append("svg:g")
		.attr("transform", "translate(" + r + "," + r + ")");

		var pie = d3.layout.pie()
		.value(function(d){return d.value;});

		//declare an arc generator function
		var arc = d3.svg.arc().outerRadius(r);

		//select paths, use arc generator to draw
		var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");

		arcs.append("svg:path")
		.attr("fill", function(d, i){ return color(i); })
		.style("opacity", 1)
		.transition()
		.delay(function(d, i) { return (i*250)+250; })
		.duration(500)
		.style("opacity", .9)
		.attr("d", function (d) { return arc(d); });
		
		//add the text
		arcs.append("svg:text")
		.style("stroke-width", 1)
		.style({"font-size":"12px","z-index":"99999999"})
		.attr("transform", function(d){
			d.innerRadius = 0;
			d.outerRadius = r;
			return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
				return data[i].label+" ("+data[i].value+")";
		})
		.style("opacity", 0)
		.transition()
		.delay(function(d, i) { return (i*250)+250; })
		.duration(500)
		.style("opacity", 1);
	};
	//chart end


	$scope.loadRevenueBars = function(productivitySummary) {
		barData = [];
		for(var i=0; i<productivitySummary.length; i++) {
			var item = productivitySummary[i];
			barData[i] = {label: item.booker, value: item.monthRevenue};
		}
		$scope.graphHeader = "PRODUCTIVITY - MONTH REVENUE"
		loadBars(barData);
	}
	$scope.loadAdrBars = function(productivitySummary) {
		barData = [];
		for(var i=0; i<productivitySummary.length; i++) {
			var item = productivitySummary[i];
			barData[i] = {label: item.booker, value: (item.monthRevenue/item.monthNights)};
		}
		$scope.graphHeader = "PRODUCTIVITY - MONTH ADR"
		loadBars(barData);
	}
	$scope.loadNightsBars = function(productivitySummary) {
		barData = [];
		for(var i=0; i<productivitySummary.length; i++) {
			var item = productivitySummary[i];
			barData[i] = {label: item.booker, value: item.monthNights};
		}
		$scope.graphHeader = "PRODUCTIVITY - MONTH NIGHTS"
		loadBars(barData);
	}
	$scope.loadNightsPie = function(productivitySummary) {
		pieData = [];
		for(var i=0; i<productivitySummary.length; i++) {
			var item = productivitySummary[i];
			pieData[i] = {label: item.booker, value: item.monthNights};
		}
		$scope.graphHeader = "Room nights share - MONTH NIGHTS"
		loadSlices(pieData);
	}
}]);