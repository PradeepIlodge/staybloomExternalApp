
staybloomExternalApp.controller('loyaltyReportController',
		['$log', '$rootScope', '$scope', '$location', '$http', '$routeParams',
		 'exportLoyaltyReportFactory',
		 function($log, $rootScope, $scope, $location, $http, $routeParams,
				 exportLoyaltyReportFactory)
{
	var profileId = $routeParams.profileId;
	populateView = function() {
		exportLoyaltyReportFactory.getLoyaltyGraphData(profileId).then(function(data) {
			$scope.data = data.dataPoints.data;
			$scope.profileName = data.title;
			$scope.loadNightsLines($scope.data);
			loadAverages($scope.data);
		});
	};
	populateView();
	
	loadAverages = function(loyaltySummary) {
		var totalRevenue = 0;
		var totalNights = 0;
		for(i=0; i<loyaltySummary.length; i++) {
			totalRevenue += loyaltySummary[i].revenue;
			totalNights += loyaltySummary[i].nights;
		}
		$scope.totalRevenue = totalRevenue;
		$scope.totalNights = totalNights;
		$scope.avgAdr = totalRevenue/totalNights;
	}

	


	//line graph start

	var loadLines = function(data) {
		document.getElementById("magicBox").innerHTML = "";
		// Set the dimensions of the canvas / graph
		var	margin = {top: 60, right: 30, bottom: 20, left: 100},
			width = 600 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		// Parse the date / time
		var	parseDate = d3.time.format("%Y%m%d").parse;
		var formatTime = d3.time.format("%b %Y");// Format tooltip date / time

		// Set the ranges
		var	x = d3.time.scale().range([0, width]);
		var	y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var	xAxis = d3.svg.axis().scale(x)
			.orient("bottom").ticks(5);

		var	yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(5);

		// Define the line
		var	valueline = d3.svg.line()
			.x(function(d) { return x(parseDate(d.label)); })
			.y(function(d) { return y(d.value); });

		// Define 'div' for tooltips
		var div = d3.select("#magicBox")
			.append("div")  // declare the tooltip div 
			.attr("class", "tooltip")              // apply the 'tooltip' class
			.style("opacity", 0);                  // set the opacity to nil

		// Adds the svg canvas
		var	svg = d3.select("#magicBox")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", 
				      "translate(" + margin.left + "," + margin.top + ")");
	
		// Scale the range of the data
		x.domain(d3.extent(data, function(d) { return parseDate(d.label); }));
		y.domain([0, d3.max(data, function(d) { return d.value; })]);

		// Add the valueline path.
		svg.append("path")		
			.attr("class", "line")
			.attr("d", valueline(data))
			.attr("fill","none");

		// draw the scatterplot
		svg.selectAll("dot")									
			.data(data)											
		.enter().append("circle")								
			.attr("r", 5)	
			.attr("cx", function(d) { return x(parseDate(d.label)); })		 
			.attr("cy", function(d) { return y(d.value); })
		// Tooltip stuff after this
		    .on("mouseover", function(d) {		
		    div.transition()
					.duration(500)	
					.style("opacity", 0);
				div.transition()
					.duration(200)	
					.style("opacity", .9);	
				div	.html(
					formatTime(parseDate(d.label)) +
					"<br/>"  + d.value)	 
					.style("left", (d3.event.pageX - 100) + "px")			 
					.style("top", (d3.event.pageY - 128) + "px");
				});

		// Add the X Axis
		svg.append("g")	
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// Add the Y Axis
		svg.append("g")	
			.attr("class", "y axis")
			.call(yAxis);
	};


	$scope.loadRevenueLines = function(loyaltySummary) {
		lineData = [];
		for(var i=0; i<loyaltySummary.length; i++) {
			var item = loyaltySummary[i];
			lineData[i] = {label: item.label, value: item.revenue};
		}
		$scope.graphHeader = "PRODUCTIVITY - MONTH REVENUE"
		loadLines(lineData);
	}
	$scope.loadAdrLines = function(loyaltySummary) {
		lineData = [];
		for(var i=0; i<loyaltySummary.length; i++) {
			var item = loyaltySummary[i];
			lineData[i] = {label: item.label, value: item.adr};
		}
		$scope.graphHeader = "PRODUCTIVITY - MONTH ADR"
		loadLines(lineData);
	}
	$scope.loadNightsLines = function(loyaltySummary) {
		lineData = [];
		for(var i=0; i<loyaltySummary.length; i++) {
			var item = loyaltySummary[i];
			lineData[i] = {label: item.label, value: item.nights};
		}
		$scope.graphHeader = "PRODUCTIVITY - MONTH NIGHTS"
		loadLines(lineData);
	}
}]);