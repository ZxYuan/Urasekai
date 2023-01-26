var MOUSE_LEFT = 0;
var MENU_ID = "menu_id";
var MENU_LOCATION_OFFSET = 14;
var TEXT_COLOR = "#EDF2F7";

function createMenu(x, y){
	var text = window.getSelection().toString();
	if (text == "")
	{
		return;
	}

	var menu = document.createElement("div");
	menu.id = MENU_ID;
	menu.align = "left";
	menu.style["position"] = "absolute";
	menu.style["left"] = x + "px";
	menu.style["top"] = (MENU_LOCATION_OFFSET + y) + "px";
	menu.style["z-index"] = 0xffffffff;
	menu.style["width"] = "fit-content";//"1000px";
	menu.style["background-color"] = TEXT_COLOR;
	menu.style["padding"] = "5px";
	menu.style["line-height"] = "normal";
	menu.style["word-break"] = "break-all";
	document.body.appendChild(menu);
	
	var result_div = document.createElement("div");
	result_div.align = "left";
	result_div.innerHTML = 'Searching ' + text + ' ...';
	menu.appendChild(result_div);

	var request_url = 'https://sukebei.nyaa.si/?f=0&c=2_2&q=' + text;
	fetch(request_url).then(r => r.text()).then(result => {
		var result_new = result.replaceAll('<i class="fa fa-fw fa-magnet"></i>', '⬇️️')
    	var doc = new DOMParser().parseFromString(result_new, "text/html");
    	//console.log(doc);
    	var table_responsive = doc.getElementsByClassName('table-responsive')[0];
    	if (table_responsive) {
    	    var table = table_responsive.getElementsByTagName('table')[0];
	    	//console.log(table);
	    	var thead = table.getElementsByTagName("thead")[0];
	    	thead.remove();
	    	var tr_list = table.getElementsByTagName("tr");
		    for (var i = 0; i < tr_list.length; i++) {
			    var td_list = tr_list[i].getElementsByTagName("td");
				if (td_list.length > 0) {
				    //td_list[7].remove();
					td_list[6].remove();
					td_list[5].remove();
					td_list[2].getElementsByTagName("a")[0].remove();
					var a = td_list[1].getElementsByTagName("a")[0];
					td_list[1].innerHTML = a.title.substr(0, 40) + '...';
					a.remove();
					td_list[0].remove();
				}
			}
			result_div.remove();
			menu.appendChild(table);
		}
		else {
			result_div.innerHTML = "Sorry. The resource is not ready";
		}
	})
}

function isInside(region, x, y){
	if (x >= region.offsetLeft && x <= (region.offsetLeft + region.offsetWidth)
		&& y >= region.offsetTop && y <= (region.offsetTop + region.offsetHeight)){
		return true;
	}
	else{
		return false;
	}
}

document.addEventListener("mouseup", function() {
	var menu = document.getElementById(MENU_ID);

	if (event.button != MOUSE_LEFT){
		if(menu){
			document.body.removeChild(menu);
		}
		return;
	}

	var x = event.pageX;
	var y = event.pageY;
	
	if (!menu){
		createMenu(x, y);
		return;
	}
	else{
		if(isInside(menu, x, y)){
			return;
		}
		else{
			document.body.removeChild(menu);
		}
	}

}, false);
