function setCookie(exmins) {
    var d = new Date();
    d.setTime(d.getTime() + (exmins*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "visited=true; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkVisited() {
    var visited = getCookie("visited");
    return (visited != "") ? true : false;
}

// ID Format
// (4-digit Year)(2-digit Month)(2-digit Day of the Month)(2-digit UTC Hour)
// Example : 20160706309
// 2016 -> Year
// 07 -> July
// 06 -> 6th
// 09 -> 09:00 UTC i,e, Shanghai Time 17:00
function getTimeID() {
    var d = new Date();
    return ((d.getUTCFullYear() * 100 + d.getUTCMonth() + 1) * 100 + d.getUTCDate()) * 100 + d.getUTCHours();
}

function UTC2LocalTime(UTCid, offsetHours) {
    var id = UTCid;
    var y = Math.floor(id / 1000000); id %= 1000000;
    var m = Math.floor(id / 10000); id %= 10000;
    var d = Math.floor(id / 100); id %= 100;
    var h = id;
    var monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) monthDays[2] = 29;
    h += offsetHours;
    if (h >= 24) {
        d += 1;
    }
    if (d > monthDays[m]) {
        d = 1; m += 1;
    }
    if (m > 12) {
        m = 1; y += 1;
    }
    return [y, m, d];
}

function ClassifyTimeCategory(timeNow, timePast) {
    var res = [];
    var monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (timeNow[0] == timePast[0]) {
        if (timeNow[1] == timePast[1]) {
            res.push(4);
            if (timeNow[2] == timePast[2]) {
                res.push(0);
            } else if (timeNow[2] == timePast[2] + 1) {
                res.push(1);
            }
            if (timeNow[2] - timePast[2] <= timeNow[3]) {
                res.push(2);
            } else if (timeNow[2] - timePast[2] <= timeNow[3] + 7) {
                res.push(3);
            }
        } else if (timeNow[1] == timePast[1] + 1) {
            res.push(5);
            if (timePast[1] == 2 && (timePast[0] % 4 == 0 && timePast[0] % 100 != 0) || timePast[0] % 400 == 0) monthDays[2] = 29;
            if (timeNow[2] == 1 && timePast[2] == monthDays[timePast[1]]) res.push(1);
            if (monthDays[timePast[1]] + timeNow[2] - timePast[2] <= timeNow[3]) {
                res.push(2);
            } else if (monthDays[timePast[1]] + timeNow[2] - timePast[2] <= timeNow[3] + 7) {
                res.push(3);
            }
        }
    } else if (timeNow[0] == timePast[0] + 1 && timePast[1] == 12 && timeNow[1] == 1) {
        res.push(5);
        if(timeNow[2] == 1 && timePast[2] == 31) res.push(1);
        if (31 + timeNow[2] - timePast[2] <= timeNow[3]) {
            res.push(2);
        } else if (31 + timeNow[2] - timePast[2] <= timeNow[3] + 7) {
            res.push(3);
        }
    }
    return res;
}

function analyzeTime(timeTable, visitorCounter) {
    var day = new Date();
    var timeNow = [day.getFullYear(), day.getMonth() + 1, day.getDate(), day.getDay()];
    if(timeNow[3] == 0) timeNow[3] = 7; timeNow[3] -= 1;
    var offsetHours = -day.getTimezoneOffset() / 60;

    for (var timeUTCID in timeTable) {
        var cnt = timeTable[timeUTCID];
        var timeLocal = UTC2LocalTime(timeUTCID, offsetHours);
        var categoryList = ClassifyTimeCategory(timeNow, timeLocal);
        if (categoryList.length == 0) {
        	var categoryAgain = ClassifyTimeCategory(timeNow, UTC2LocalTime(timeUTCID, 12));
        	if (categoryAgain.length == 0) counterbase.child(timeUTCID).remove();
            continue;
        }
        for (var i in categoryList) visitorCounter[categoryList[i]] += cnt;
    }
}

function digCounterHTML(total) {
    str = "";
    var digits = [];
    while (total) {
        digits.push(total % 10);
        total = Math.floor(total / 10);
    }
    var i = digits.length;
    while(i--) {
        str += '<img src="';
        str += digits[i];
        str += '.png" alt="visit_counter" title="Vistior Counter"/>';
    }
    return str;
}

function dateFomrat(dateStr) {
    var d = dateStr.split('/');
    if (d[0].length < 2) d[0] = '0' + d[0];
    if (d[1].length < 2) d[1] = '0' + d[1];
    var str = d[2] + '-' + d[0] + '-' + d[1];
    return str;
}

function genImgTitleList() {
    var list = [];
    var d = new Date();
    list.push(dateFomrat(d.toLocaleDateString()));

    var p = new Date();
    p.setTime(d.getTime() - 24 * 60 * 60 * 1000);
    list.push(dateFomrat(p.toLocaleDateString()));

    var w = d.getDay(); if (w == 0) w = 7; w -= 1;
    if (w == 0) {
        list.push(dateFomrat(d.toLocaleDateString()));
    } else {
        p.setTime(d.getTime() - w * 24 * 60 * 60 * 1000);
        list.push(dateFomrat(p.toLocaleDateString()) + ' -&gt; ' + dateFomrat(d.toLocaleDateString()));
    }

    var str = '';
    p.setTime(d.getTime() - (w + 7) * 24 * 60 * 60 * 1000);
    str += dateFomrat(p.toLocaleDateString());
    str += ' -&gt; ';
    p.setTime(d.getTime() - (w + 1) * 24 * 60 * 60 * 1000);
    str += dateFomrat(p.toLocaleDateString());
    list.push(str);

    var date = d.getDate();
    if (date == 1) {
        list.push(dateFomrat(d.toLocaleDateString()));
    } else {
        p.setTime(d.getTime() - (date - 1) * 24 * 60 * 60 * 1000);
        list.push(dateFomrat(p.toLocaleDateString()) + ' -&gt; ' + dateFomrat(d.toLocaleDateString()));
    }

    str = '';
    p.setTime(d.getTime() - date * 24 * 60 * 60 * 1000);
    p.setDate(1);
    str += dateFomrat(p.toLocaleDateString());
    str += ' -&gt; ';
    p.setTime(d.getTime() - date * 24 * 60 * 60 * 1000);
    str += dateFomrat(p.toLocaleDateString());
    list.push(str);

    list.push('Visitor Counter');
    return list;
}

function tableContentHTML(counterData) {
    str = "";
    imgSrc = ['today', 'yesterday', 'week', 'lweek', 'month', 'lmonth', 'all'];
    contentList = ['Today', 'Yesterday', 'This week', 'Last week', 'This month', 'Last month', 'All days'];
    imgTitleList = genImgTitleList();
    for (var i = 0; i < 7; i++) {
        str += '<tr align="left"><td><img src="v';
        str += imgSrc[i];
        str += '.png" alt="visit_counter" title="';
        str += imgTitleList[i];
        str += '" /></td><td>';
        str += contentList[i];
        str += '</td><td align="right">';
        str += counterData[i];
        str += '</td></tr>';
    }
    return str;
}

function counterHTMLGenerator(counterData) {
    htmlString = '';
    //Image Digital Counter
    htmlString += '<div>';
    htmlString += digCounterHTML(counterData[6]);
    htmlString += '</div>';
    //Table Statistics
    htmlString += '<div><table cellpadding="0" cellspacing="0" style="width: 90%;"><tbody>';
    htmlString += tableContentHTML(counterData);
    htmlString += '</tbody></table></div>';
    //Link to Counter
    htmlString += '<div><a href="javascript:if(confirm(%27https://firebase.google.com/  \n\nThis file was not retrieved by Teleport Ultra, because it is addressed on a domain or path outside the boundaries set for its Starting Address.  \n\nDo you want to open it from the server?%27))window.location=%27https://firebase.google.com/%27" target="_self" title="Visitor Counter Via Firebase">Visitors Counter</a></div>';
    return htmlString;
}

function listenDatabase(data) {
    //Get Data
    var timeTable = data.val();
    var visitorCounter = [0, 0, 0, 0, 0, 0, timeTable['total']]; //today, yesterday, this week, last week, this month, last month, all days
    delete timeTable.total;

    //Get Data for visitorCounter
    analyzeTime(timeTable, visitorCounter);

    //Display data
    var htmlString = counterHTMLGenerator(visitorCounter);
    document.getElementById('vvisit_counter').innerHTML = htmlString;
}

//Initialize Firebas
var config = {
    apiKey: "AIzaSyBETOBv9QJvY2Bdt2MAAh2MOVWI8MTDAcE",
    authDomain: "irvingthofoundation.github.io",
    databaseURL: "https://irvingthofoundation.firebaseio.com",
    storageBucket: "",
};
firebase.initializeApp(config);
var counterbase = firebase.database().ref('viewer-counter');

//If not visited, upload time to Firebase
if (!checkVisited()) {
    var id = getTimeID();
    var incrmental = function(val) {return val + 1;};
    counterbase.child(id).transaction(incrmental);
    counterbase.child('total').transaction(incrmental);
}

//Update Cookie
setCookie(10);

//Listen to the Firebase Database
counterbase.on('value', listenDatabase);