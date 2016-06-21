var now = new Date();
var days = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
var index = new Array('st','nd','rd','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','st','nd','rd','th','th','th','th','th','th','th','st');
var date = now.getDate() + index[now.getDate()-1];
function fourdigits(number)	{
	return (number < 1000) ? number + 1900 : number;
}
today =  days[now.getDay()]+ " " + 
		 date + " of " +
         months[now.getMonth()] + " " +
         (fourdigits(now.getYear()));