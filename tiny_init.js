tinyMCE.init({
					mode : 'none',
					theme : 'advanced',
					theme_advanced_buttons1 : 'bold,italic,underline,fontselect,fontsizeselect, separator,strikethrough,justifyleft,justifycenter,justifyright, justifyfull,undo,redo,',
					theme_advanced_buttons2 : 'code,hr,link,separator,bullist,numlist',
					theme_advanced_buttons3 : '',
					theme_advanced_toolbar_location : 'top',
					theme_advanced_toolbar_align : 'left',
					extended_valid_elements : 'a[name|href|target|title|onclick],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name],hr[class|width|size|noshade],font[face|size|color|style],span[class|align|style]',
					language : 'english'
				});

function setTextareaToTinyMCE(sEditorID) {
		var oEditor = document.getElementById(sEditorID);
		if(oEditor) {
			tinyMCE.execCommand('mceAddControl', true, sEditorID);
		}
		return;
}

function unsetTextareaToTinyMCE(sEditorID) {
	var oEditor = document.getElementById(sEditorID);
	if(oEditor) {
		tinyMCE.execCommand('mceRemoveControl', true, sEditorID);
	}
	return;
}				