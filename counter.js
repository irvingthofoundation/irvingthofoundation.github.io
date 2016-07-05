function setCookie(exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "visited=true; " + expires + "; domain=irvingthofoundation.github.io; path=/";
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

if (checkVisited()) {
    alert("Welcome again!");
} else {
    alert("Welcome!");
}
setCookie(0.01);