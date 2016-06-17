//Simple Font Resizer Javascript//
/**
* Simple Font Resizer Javascript
* @package Joomla 1.5
* @copyright Copyright (C) 2008 UnDesign. All rights reserved.
* @license http://www.gnu.org/copyleft/gpl.html GNU/GPL
* This program is free software; you can redistribute it and/or
* modify it under the terms of the GNU General Public License
* as published by the Free Software Foundation; either version 2
* of the License, or (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*/

var prefsLoaded = false;
var defaultFontSize = defaultSize;
var currentFontSize = defaultFontSize;

function revertStyles(){

	currentFontSize = defaultFontSize;
	changeFontSize(0);

}



function changeFontSize(sizeDifference){
	currentFontSize = parseInt(currentFontSize) + parseInt(sizeDifference * 10);

	if(currentFontSize > 150){
		currentFontSize = 150;
	}else if(currentFontSize < 70){
		currentFontSize = 70;
	}

	setFontSize(currentFontSize);
};

function setFontSize(fontSize){
	var stObj = (document.getElementById) ? document.getElementById('content_area') : document.all('content_area');
	document.body.style.fontSize = fontSize + '%';

	//alert (document.body.style.fontSize);
};


function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
};

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
};

window.onload = setUserOptions;

function setUserOptions(){
	if(!prefsLoaded){

		cookie = readCookie("fontSize");
		currentFontSize = cookie ? cookie : defaultFontSize;
		setFontSize(currentFontSize);

		prefsLoaded = true;
	}

}

window.onunload = saveSettings;

function saveSettings()
{
  createCookie("fontSize", currentFontSize, 365);
}