
$('calendar-day').modal('toggle')

function someFunction(roomId, forDate) {
	alert(roomId+" - "+forDate);
}

function getDifferenceBetweenDates(begin, end) {
	var beginDate = moment(begin , "YYYYMMDD");
	var endDate = moment(end , "YYYYMMDD");
	return endDate.add(1, 'days').diff(beginDate, 'days');
}

externalApplications = {
    'F&B CHARGES':0,
    'GIFT VOUCHERS':1,
    'PRODUCTIVITY REPORT':2,
}
pmsTagId = {
    'OTA':2,
    'Travel Sales':4,
    'Corporate':3,
}
var accessMap = new Object(); 
function get(k) {
	  return accessMap[k];
}

validityEnum = {
    'VALID':0,
    'INVALID':1,
}

var appGlobal = {};
appGlobal.fnbExpense = "fnbExpense";