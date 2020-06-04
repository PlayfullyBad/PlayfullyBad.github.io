const tooltipicon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style="fill: {{colour}};"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"></path></svg>';
window.onload = loadcheckURLOptions;

function htmltojson(){
	var jsonobject = [];
	var Groups = document.getElementById('jsonbuilder').getElementsByClassName('Group');
	for (var i = 0; i < Groups.length; i++) {
		var GroupsDiscriptionList = Groups[i].getElementsByTagName('dl');
		var GroupName = GroupsDiscriptionList[0].getElementsByTagName('dt')[0].getElementsByTagName('input')[0].value;
		var GroupDescription = GroupsDiscriptionList[0].getElementsByTagName('dd')[0].getElementsByTagName('input')[0].value;
		if(GroupName != ""){
			var newobj = {}, newgroup = [];
			newobj.Name = GroupName;
			newobj.Description = GroupDescription;
			newobj.Items = [];		 
			newobj.ChoiceType = [];		 
			var GroupChoiceList = GroupsDiscriptionList[0].getElementsByTagName('ul')[0];
			var Choices = GroupChoiceList.getElementsByTagName('input');
			if(Choices.length > 0){
				for (var k = 0; k < Choices.length; k++) {
					var newchoice = {};		
					if(Choices[k].value != ""){
						newchoice.Name = Choices[k].value;
						newobj.ChoiceType.push(newchoice);
					}
				}
			} else {				
				var newchoiceGeneral = {};		
				newchoiceGeneral.Name = "General";
				newobj.ChoiceType.push(newchoiceGeneral);				
			}
			var GroupItemList = GroupsDiscriptionList[0].getElementsByTagName('dl');
			var items = GroupItemList[0].getElementsByTagName('dt');
			var itemsdescription = GroupItemList[0].getElementsByTagName('dd');	
			for (var j = 0; j < items.length; j++) {
				var newitem = {};		
				if(items[j].getElementsByTagName('input')[0].value != ""){
					newitem.Name = items[j].getElementsByTagName('input')[0].value;
					newitem.Description = itemsdescription[j].getElementsByTagName('input')[0].value;
					newitem.Rating = items[j].getElementsByTagName('input')[0].getAttribute('data-rating');
					newobj.Items.push(newitem);
				} else {
					// var x = confirm("Empty item name do you wish to continue? (Note this item will be ingored and removed)");
					// if (x != true) {
						// return;
					// }					
				}
			}
			jsonobject.push(newobj);
		} else {
			// var r = confirm("Empty group name do you wish to continue? (Note this entire group will be ingored and removed including all items in the group)");
			// if (r != true) {
				// return;
			// }
		}
	}
	document.getElementById('jsonhidden').innerHTML = JSON.stringify(jsonobject);
	document.getElementById('jsonbuilder').innerHTML = "";	
	document.getElementById('editjson').style.display = "none";
	document.getElementById('btnEditItems').style = "";
	document.getElementById('imgurUpload').style = "";
	document.getElementById('CustomShare').style = "";
	document.getElementById('EditRating').style = "";
	document.getElementById('ZeroEverything').style = "";
	document.getElementById('btnTextImport').style = "";
	document.getElementById('ratingIndex').style = "";
	document.getElementById('slcOptionsSwitch').style = "";
	RateItems();
}
function htmlfromjson(){
	document.getElementById("ratingIndex").innerHTML = "";
	document.getElementById("divDisplay").innerHTML = "";
	document.getElementById('btnEditItems').style.display = "none";
	document.getElementById('slcOptionsSwitch').style.display = "none";
	document.getElementById('imgurUpload').style.display = "none";
	document.getElementById('CustomShare').style.display = "none";
	document.getElementById('EditRating').style.display = "none";
	document.getElementById('ZeroEverything').style.display = "none";
	document.getElementById('btnTextImport').style.display = "none";
	document.getElementById('ratingIndex').style.display = "none";
	document.getElementById('editjson').style = "";
	if(document.getElementById('jsonhidden').innerHTML != ""){
		var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);
		var htmlarea = document.getElementById('jsonbuilder');
		htmlarea.innerHTML = "";
		for (var i = 0; i < jsonobject.length; i++) {
			var innerhtml = "";
			var newelem = document.createElement('li');
			newelem.className = "Group";
			newelem.id = "Group" + i;
			innerhtml = "<dl><dt class='stickytop'><input value='" + jsonobject[i].Name + "' ></dt><dd><input value='" + jsonobject[i].Description + "' ><button onclick='deleteNode(\"deleteGroup\"," + i + ")'>Delete Group</button><button onclick='newitem(\"Group" + i + "\")'>New Item</button><button onclick='newchoice(\"Group" + i + "\")'>New Choice</button></dd>";
			innerhtml = innerhtml + "<ul><span style='display:none;' class='maxchoice'>" + jsonobject[i].ChoiceType.length + "</span>";
			for (var k = 0; k < jsonobject[i].ChoiceType.length; k++) {
				innerhtml = innerhtml + "<li id='li" + i + "-" + k+ "'><input value='" + jsonobject[i].ChoiceType[k].Name + "' ><button onclick='deleteNode(\"deleteChoice\",\"" + i + "-" + k + "\")'>Delete Choice</button></li>";
			}
			innerhtml = innerhtml + "</ul><dl><span style='display:none;' class='maxitem'>" + jsonobject[i].Items.length + "</span>";
			for (var j = 0; j < jsonobject[i].Items.length; j++) {
				ratingnumber = 0;
				ratingnumber = jsonobject[i].Items[j].Rating;
				innerhtml = innerhtml + "<dt id='dt" + j + "-" + i+ "'><input data-rating='" + ratingnumber + "' value='" + jsonobject[i].Items[j].Name + "' ></dt><dd id='dd" + j + "-" + i+ "'><input value='" + jsonobject[i].Items[j].Description + "' ><button onclick='deleteNode(\"deleteItem\",\"" + j + "-" + i + "\")'>Delete Item</button></dd>";
			}
			newelem.innerHTML = innerhtml + "</dl></dl>";
			htmlarea.appendChild(newelem);
			document.getElementById('maxGroupNumber').innerHTML = i;
		}
	}
}

function ScrollToMiddle(id) {
	var element = document.getElementById(id);
	var elementRect = element.getBoundingClientRect();
	var absoluteElementTop = elementRect.top + window.pageYOffset;
	var middle = absoluteElementTop - (window.innerHeight / 2);
	window.scrollTo(0, middle);
}

function newitem(id){
	var group = document.getElementById(id);
	var numberitems = group.getElementsByClassName('maxitem')[0];
	var currentnumberitems = numberitems.innerHTML * 1;
	var itemscontainer = group.getElementsByTagName('dl')[1];
	var groupnumber = id.replace("Group", "") * 1;
	var innerhtmldt = "";
	var innerhtmldd = "";
	var newelemdt = document.createElement('dt');
	var newelemdd = document.createElement('dd');
	newelemdt.id = "dt" + (currentnumberitems + 1) + "-" + groupnumber;
	newelemdd.id = "dd" + (currentnumberitems + 1) + "-" + groupnumber;
	innerhtmldt = "<input data-rating='0' >"
	innerhtmldd = "<input><button onclick='deleteNode(\"deleteItem\",\"" + (currentnumberitems + 1) + "-" + groupnumber + "\")'>Delete Item</button>";
	newelemdd.innerHTML = innerhtmldd;
	newelemdt.innerHTML = innerhtmldt;
	itemscontainer.appendChild(newelemdt);
	itemscontainer.appendChild(newelemdd);
	
	numberitems.innerHTML = currentnumberitems + 1;
	//document.getElementById(newelemdt.id).scrollIntoView();
	ScrollToMiddle(newelemdt.id);
	document.getElementById(newelemdt.id).getElementsByTagName('input')[0].select();
}
function newchoice(id){
	var group = document.getElementById(id);
	var numberitems = group.getElementsByClassName('maxchoice')[0];
	var currentnumberitems = numberitems.innerHTML * 1;
	var itemscontainer = group.getElementsByTagName('ul')[0];
	var groupnumber = id.replace("Group", "") * 1;
	var innerhtmlli = "";
	var newelemli = document.createElement('li');
	newelemli.id = "li" + (currentnumberitems + 1) + "-" + groupnumber;
	innerhtmlli = "<input><button onclick='deleteNode(\"deleteChoice\",\"" + (currentnumberitems + 1) + "-" + groupnumber + "\")'>Delete Choice</button>";
	newelemli.innerHTML = innerhtmlli;
	itemscontainer.appendChild(newelemli);
	
	numberitems.innerHTML = currentnumberitems + 1;	
	//document.getElementById(newelemli.id).scrollIntoView(false);
	ScrollToMiddle(newelemli.id);
	document.getElementById(newelemli.id).getElementsByTagName('input')[0].select();
}

function newgroup(){
	var htmlarea = document.getElementById('jsonbuilder');
	var innerhtml = "";
	var newelem = document.createElement('li');
	var MaxGroupelem = document.getElementById('maxGroupNumber');
	var currentMaxGroup = (MaxGroupelem.innerHTML * 1);
	newelem.id = "Group" + (currentMaxGroup + 1);
	newelem.className = "Group";
	
	innerhtml = "<dl><dt class='stickytop'><span style='display:none;' class='maxitem'>-1</span><span style='display:none;' class='maxchoice'>-1</span><input></dt><dd><input><button onclick='deleteNode(\"deleteGroup\"," + (currentMaxGroup + 1) + ")'>Delete Group</button><button onclick='newitem(\"Group" + (currentMaxGroup + 1) + "\")'>New Item</button><button onclick='newchoice(\"Group" + (currentMaxGroup + 1) + "\")'>New Choice</button></dd><ul></ul><dl></dl></dl>";
	newelem.innerHTML = innerhtml;
	htmlarea.appendChild(newelem);
	
	MaxGroupelem.innerHTML = currentMaxGroup + 1;
	document.getElementById(newelem.id).getElementsByTagName('input')[0].select();
	ScrollToMiddle(newelem.id);
}

function deleteNode(type, id){
	switch(type) {
	  case "deleteItem":
		document.getElementById("dt"+id).parentNode.removeChild(document.getElementById("dt"+id));
		document.getElementById("dd"+id).parentNode.removeChild(document.getElementById("dd"+id));
		break;
	  case "deleteGroup":
		document.getElementById("Group"+id).parentNode.removeChild(document.getElementById("Group"+id));
		break;
	  case "deleteChoice":
		document.getElementById("li"+id).parentNode.removeChild(document.getElementById("li"+id));
		break;
	  default:
		// code block
	}
}

function RateItems(){	
	document.getElementById('SaveRating').style.display = "none";
	var DisplayArea = document.getElementById("divDisplay");
	var IndexArea = document.getElementById("ratingIndex");
	IndexArea.innerHTML = "";
	var ratings = JSON.parse(document.getElementById("ratingshidden").innerHTML);
	DisplayArea.innerHTML = "";
	for (var l = 0; l < ratings.length; l++) {
		var newratingIndex = document.createElement('span');
		var innerhtmlratingindex = ratings[l].Name + " = " + ratings[l].Description;
		newratingIndex.innerHTML = innerhtmlratingindex;
		var newratingIndexColour = document.createElement('span');
		newratingIndexColour.className = "ratingIndex" + l;
		newratingIndex.appendChild(newratingIndexColour);
		IndexArea.appendChild(newratingIndex);
	}
	if(document.getElementById('jsonhidden').innerHTML != ""){
		var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);

		for (var i = 0; i < jsonobject.length; i++) {
			var newelem = document.createElement('div');
			var newelemtable = document.createElement('table');
			var newelemthead = document.createElement('thead');
			var newelemtbody = document.createElement('tbody');
			var tooltiptext = "";
			if(jsonobject[i].Description != null && jsonobject[i].Description != ""){
				tooltiptext = " <span class='tooltip'>" + tooltipicon.replace("{{colour}}","var(--site-colour)") + "<span>" + jsonobject[i].Description + "</span></span>";
			}
			var innerhtmlthead = "<thead><tr><th>" + jsonobject[i].Name + tooltiptext + "</th>";
			for (var b = 0; b < jsonobject[i].ChoiceType.length; b++) {
				innerhtmlthead = innerhtmlthead + "<th colspan='" + ratings.length + "'>" + jsonobject[i].ChoiceType[b].Name + "</th>";
			}
			innerhtmlthead = innerhtmlthead + "</tr><tr><th></th>";
			for (var b = 0; b < jsonobject[i].ChoiceType.length; b++) {
				for (var a = 0; a < ratings.length; a++) {
					innerhtmlthead = innerhtmlthead + "<th>" + ratings[a].Name + "</th>";
				}
			}
			innerhtmlthead = innerhtmlthead + "</tr></thead>";
			var innerhtmltbody = "";
			for (var j = 0; j < jsonobject[i].Items.length; j++) {
				var tooltiptextItem = "";
				if(jsonobject[i].Items[j].Description != null && jsonobject[i].Items[j].Description != ""){
					tooltiptextItem = " <span class='tooltip'>" + tooltipicon.replace("{{colour}}","var(--site-colour-second)") + "<span>" + jsonobject[i].Items[j].Description + "</span></span>";
				}
				innerhtmltbody = innerhtmltbody + "<tr><td>" + jsonobject[i].Items[j].Name + tooltiptextItem + "</td>";
				for (var k = 0; k < jsonobject[i].ChoiceType.length; k++) {
					for (var l = 0; l < ratings.length; l++) {
						var ratinglist = jsonobject[i].Items[j].Rating.split(",");
						var checkedflag = "";
						var ident = i + "-" + j + "-" + ratings[l].Name + "-" + k;
						if(ratinglist.length < jsonobject[i].ChoiceType.length && ratings[l].Name == 0) {checkedflag = "checked";}
						else if((ratinglist[k] * 1) == (ratings[l].Name * 1)){checkedflag = "checked";}
						innerhtmltbody = innerhtmltbody + "<td><span onclick=clickitem('" + ident + "')>" + jsonobject[i].ChoiceType[k].Name + " - " + l + "</span><input " + checkedflag + " type='radio' name='" + i + "-" + j + "-" + k + "' id='" + ident + "' oninput='saveresults()'><label class='rating" + l + "' for='" + ident + "'></label></td>";
					}
				}
				
				innerhtmltbody = innerhtmltbody + "</tr>";
			}
			newelemthead.innerHTML = innerhtmlthead;
			newelemtbody.innerHTML = innerhtmltbody;
			newelemtable.appendChild(newelemthead);
			newelemtable.appendChild(newelemtbody);
			newelem.appendChild(newelemtable);
			DisplayArea.appendChild(newelem);
		}
		saveresults();
	}
		//var newelemta = document.createElement('textarea');
		//newelemta.innerHTML = JSON.stringify(jsonobject);
		//DisplayArea.appendChild(newelemta);
}

function clickitem(id){
	document.getElementById(id).checked = true;
}

function saveresults(){
	var DisplayArea = document.getElementById("divDisplay");
	var checkedBoxes = DisplayArea.querySelectorAll('input[type=radio]:checked');
	var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);	
	for (var i = 0; i < checkedBoxes.length; i++) {
		var result = checkedBoxes[i].id.split("-");
		if(result[3] > 0){
			jsonobject[result[0]].Items[result[1]].Rating = jsonobject[result[0]].Items[result[1]].Rating + "," + result[2];
		} else if(result[3] == 0){
			jsonobject[result[0]].Items[result[1]].Rating = result[2];
		}
	}
	document.getElementById('jsonhidden').innerHTML = JSON.stringify(jsonobject);	
}

function createImage(){
	var DisplayArea = document.getElementById("divDisplay");
	var checkedBoxes = DisplayArea.querySelectorAll('input[type=radio]:checked');
	var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);
	var ratings = JSON.parse(document.getElementById("ratingshidden").innerHTML);
	var heightunit = 18;
	var circlerad = (heightunit-2)/2;
	var columns = 6;
	var currentcolumn = 1;
	var columnwidth = heightunit * 24;
	var currentrow = 0;
	var maxyheight = 0;
	
	var numberItems = 0;
	for (var a = 0; a < jsonobject.length; a++) {
		for (var b = 0; b < jsonobject[a].Items.length; b++) {
			numberItems++;
		}
	}
	numberItems++;
	
	var height = ((numberItems + (jsonobject.length * 2)) * heightunit);
	var totalrows = (numberItems + (jsonobject.length * 2));
	var divImage = document.getElementById("divImage");
	divImage.innerHTML = "";
	var c = document.createElement('canvas');
	c.style.border = "1px solid black";
	c.width = columnwidth * columns;
	c.height = ((height + (heightunit*5) + 10) ) + (heightunit*10);
	var yheight = heightunit;
	currentrow++;
	var ctx = c.getContext("2d");
	ctx.fillStyle = document.getElementById('inpSiteColour').value;
	ctx.fillRect(0,0,c.width,c.height);
	ctx.fillStyle = document.getElementById('inpSiteColourSecond').value;
	ctx.font = (heightunit-2) + "px Arial";
	ctx.textAlign = "left";
	
	var RatingString = "";
	//ctx.textAlign = "center";
	ctx.font = "bold "+(heightunit-2) + "px Arial";
	for (var k = 0; k < ratings.length; k++) {		
		ctx.fillStyle = ratings[k].Colour;
		ctx.beginPath();
		ctx.arc(heightunit + 10, yheight - circlerad + 2, circlerad, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.fillStyle = document.getElementById('inpSiteColourSecond').value;
		ctx.fillText(ratings[k].Name + " = " + ratings[k].Description,heightunit * 3,yheight);
		RatingString = RatingString + " | " + ratings[k].Name + " = " + ratings[k].Description;
		yheight = yheight + heightunit;
		currentrow++;
	}
	currentrow++;
	RatingString = RatingString + " | ";
	//ctx.fillText(RatingString,c.width / 2,yheight);
	ctx.font = (heightunit-2) + "px Arial";
	ctx.textAlign = "left";
	yheight = yheight + heightunit;
	currentrow++;
	yheightReset = yheight;
	for (var i = 0; i < jsonobject.length; i++) {
		currentrow++;
		var choicetext = "(";
		for (var l = 0; l < jsonobject[i].ChoiceType.length; l++){
			choicetext = choicetext + jsonobject[i].ChoiceType[l].Name + ", ";
		}
		choicetext = choicetext.substring(0, choicetext.length - 2) + ")";
		ctx.font = "bold "+(heightunit-2) + "px Arial";
		ctx.fillText(jsonobject[i].Name,(columnwidth * (currentcolumn - 1)) + 10,yheight);// + " - " + jsonobject[i].Description		
		ctx.textAlign = "right";
		ctx.fillText(choicetext,(columnwidth * currentcolumn) - 10,yheight)
		ctx.font = (heightunit-2) + "px Arial";
		ctx.textAlign = "left";
		yheight = yheight + heightunit;
		for (var j = 0; j < jsonobject[i].Items.length; j++) {
			currentrow++;
			ctx.fillText(jsonobject[i].Items[j].Name,(columnwidth * (currentcolumn - 1)) + 10,yheight);// + " - " + jsonobject[i].Items[j].Description
			ctx.textAlign = "right";
			ctx.fillText(jsonobject[i].Items[j].Rating,(columnwidth * currentcolumn) - 10,yheight);
			var RatingList = jsonobject[i].Items[j].Rating.split(",");
			for (var e = 0; e < RatingList.length; e++) {
				ctx.fillStyle = ratings[RatingList[e]].Colour;
				ctx.beginPath();
				ctx.arc((columnwidth * currentcolumn) - (heightunit * 5.5) + ((e * (circlerad * 2 + 2))), yheight - circlerad + 2, circlerad, 0, Math.PI * 2, true);
				ctx.fill();
			}
			//ctx.arc(c.width - 60, yheight - 3, 6, 0, Math.PI * 2, true);
			//ctx.arc(c.width - 45, yheight - 3, 6, 0, Math.PI * 2, true);
			ctx.fillStyle = document.getElementById('inpSiteColourSecond').value;
			ctx.textAlign = "left";			
			yheight = yheight + heightunit;
		}
		yheight = yheight + heightunit;
		currentrow++;
		if(yheight > maxyheight){
			maxyheight = yheight;
		}
		if((currentrow/(totalrows/columns)) > 1){
			yheight = yheightReset;
			currentcolumn++;
			currentrow = 0;
		}
	}
	maxyheight = maxyheight + heightunit;
	//var img = c.toDataURL("image/png");
	var canvfinal = document.createElement('canvas');
	canvfinal.style.border = "1px solid black";
	canvfinal.width = c.width;
	canvfinal.height = maxyheight;
	var ctx2 = canvfinal.getContext("2d");
	ctx2.drawImage(c, 0 , 0);
	var img = canvfinal.toDataURL("image/png");
	//divImage.innerHTML = img;
	//divImage.appendChild(canvfinal);
	//document.write('<img src="'+img+'"/>');
	imgurUpload(img);
}

function imgurUpload(imagestring) {
	var imgurClientId = '9db53e5936cd02f';
	var resultImgur = document.getElementById("resultImgur");
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	fetch(proxyurl + 'https://api.imgur.com/3/image', {
		method: 'post',
		headers: {
			'Authorization': 'Client-ID ' + imgurClientId,
			'Accept': 'application/json',
			'Content-type': 'application/json'//'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: JSON.stringify({
			image:  imagestring.split(',')[1],
			type: 'base64'			
		})//'foo=bar&lorem=ipsum'
	})
		//.then(json)
		.then(response=>response.json())
		.then(function (data) {
			var url = 'https://i.imgur.com/' + data.data.id + '.png';
			resultImgur.innerHTML = url;
		})
		.catch(function (error) {
			resultImgur.innerHTML = "Request Failed";
		});		
}

function replaceAll(str, oldstr, newstr) {
  return str.replace(new RegExp(oldstr, 'g'), newstr);
}

function pad(n){return n<10 ? '0'+n : n}

function ISODateString(){
    var d = new Date();
	return d.getUTCFullYear()
		+ pad(d.getUTCMonth()+1)
		+ pad(d.getUTCDate())
		+ pad(d.getUTCHours())
		+ pad(d.getUTCMinutes())
		+ pad(d.getUTCSeconds())
}

function shareOptions(){
	var getUrl = window.location;	
	var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);
	var jsonString = JSON.stringify(jsonobject);
	var base64Options = window.btoa(jsonString);
	var ratingobject = JSON.parse(document.getElementById('ratingshidden').innerHTML);
	var ratingString = JSON.stringify(ratingobject);
	var base64Rating = window.btoa(ratingString);
	var Name = prompt("Please enter form name:", "");
	if (Name == null || Name == "")	{
		alert("Share Cancelled");
	}
	var idName = ISODateString() + Name;
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	fetch(proxyurl + 'https://script.google.com/macros/s/AKfycbztcDBVjq09BBx74UVzQ_TYxAI5cMZa7389xqBWTbL58ORmzrDa/exec', {
		method: 'post',
		headers: {
			'Authorization': '',
			'Accept': 'text/plain',
			'Content-type': 'application/json'//'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: JSON.stringify({
			id: idName,
			survey: base64Options,
			ratings: base64Rating,
			colourone: document.getElementById('inpSiteColour').value.replace("#", ""),
			colourtwo: document.getElementById('inpSiteColourSecond').value.replace("#", "")
		})
	})
		//.then(json)
		.then(response=>response.text())
		.then(function (data) {
			//var url = 'https://i.imgur.com/' + data.data.id + '.png';
			copy(getUrl.protocol + "//" + getUrl.host + getUrl.pathname + "?id=" + idName);
		})
		.catch(function (error) {
			copy("Request Failed");
		});	
	
	//var jsongzip = lzw_encode(jsonString);
	//var gzipsafe = replaceAll(jsongzip,"&","{{AND}}");
//	var baseUrl = "?id=" idName;
	//copy(window.btoa(baseUrl));
	
	//document.getElementById("import").value = ;
}


//https://stackoverflow.com/questions/294297/javascript-implementation-of-gzip/294421#294421
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = "";// data[0];
    var code = 3000; //256
    for (var i=0; i<data.length; i++) {
        currChar=String.fromCharCode(data[i].charCodeAt(0) + 2000);
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = "";//	data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 3000; //256
    var phrase;
    for (var i=0; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 3000) {
            phrase = String.fromCharCode(data[i].charCodeAt(0) - 2000);//data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}


function SwitchOptions(){
	var slcOptionsSwitch = document.getElementById('slcOptionsSwitch');
	var decoded = window.atob(slcOptionsSwitch.value);
	var Options = JSON.parse(decoded);
	document.getElementById('jsonhidden').innerHTML = JSON.stringify(Options);
	RateItems();
	saveRatingsNames();	
}

function loadcheckURLOptions(){
	
	var urlParams = new URLSearchParams(window.location.search);
	var myParamID = urlParams.get('id');
	var myParam = "";
	var myParamName = "";	
	var myParamRating = "";
	var myParamcol1 = "";	
	var myParamcol2 = "";
	if(myParamID != "" && myParamID != null){	
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	var url = 'https://script.google.com/macros/s/AKfycbztcDBVjq09BBx74UVzQ_TYxAI5cMZa7389xqBWTbL58ORmzrDa/exec?id=' + myParamID;
	fetch(url)
		.then(response=>response.json())
		.then(function (data) {  
			myParam = data.survey;
			myParamName = data.id;
			myParamRating = data.ratings;
			myParamcol1 = data.colourone;	
			myParamcol2 = data.colourtwo;
	
	
	//var myParam = urlParams.get('GroupList');
	var slcOptionsSwitch = document.getElementById('slcOptionsSwitch');
	var newelem = document.createElement('option');
	newelem.id = "optNewOption";
	if(myParam != "" && myParam != null){		
		var decoded = window.atob(myParam);
		var Options = JSON.parse(decoded);
		
		document.getElementById('jsonhidden').innerHTML = JSON.stringify(Options);//lzw_decode(myParam);//
		newelem.value = myParam;
	}
	//var myParamRating = urlParams.get('RatingList');
	if(myParamRating != "" && myParamRating != null){
		var decodedRating = window.atob(myParamRating);
		var Ratings = JSON.parse(decodedRating);
		document.getElementById('ratingshidden').innerHTML = JSON.stringify(Ratings);//lzw_decode(myParamRating); //
	}
	//var myParamcol1 = urlParams.get('Col1');
	if(myParamcol1 != "" && myParamcol1 != null){
		var Colour1 = "#" + myParamcol1;
		document.documentElement.style.setProperty('--site-colour', Colour1);
		document.getElementById('inpSiteColour').value = Colour1;
	}
	//var myParamcol2 = urlParams.get('Col2');
	if(myParamcol2 != "" && myParamcol2 != null){
		var Colour2 = "#" + myParamcol2;
		document.documentElement.style.setProperty('--site-colour-second', Colour2);
		document.getElementById('inpSiteColourSecond').value = Colour2;
	}
	//var myParamName = urlParams.get('Name');
	if(myParamName != "" && myParamName != null && myParam != "" && myParam != null){
		newelem.innerHTML = myParamName;
		slcOptionsSwitch.appendChild(newelem);
		document.getElementById('optNewOption').selected = true;
	}
	
	RateItems();
	saveRatingsNames();
	
		})
		.catch(function (error) {
			copy("Request Failed");
		});	
	}
}

function copy(text) {
    var input = document.createElement('input');
    input.value = text;
    var copyspan = document.getElementById('CopySpan');
	copyspan.innerHTML = "";
	copyspan.appendChild(input);
    input.select();
    //var result = document.execCommand('copy');
	//console.log("Copy Successful: " + result);
	//if(result){
		//document.getElementById('CopySpan').removeChild(input);		
	//}
    //return result;
}

function editRating(){
	document.getElementById("divDisplay").innerHTML = "";
	var divRatingEdit = document.getElementById("divRatingEdit");
	var ratings = JSON.parse(document.getElementById("ratingshidden").innerHTML);
	for (var k = 0; k < ratings.length; k++) {
		var newelem = document.createElement('div');
		newelem.id = "Rating" + k;
		var innerhtml = "<input value='" + ratings[k].Description + "'><input type='color' value='" + ratings[k].Colour + "'>";
		newelem.innerHTML = innerhtml;
		divRatingEdit.appendChild(newelem);	
	}
	document.getElementById('EditRating').style.display = "none";
	document.getElementById('SaveRating').style = "";
	document.getElementById('btnEditItems').style.display = "none";
	document.getElementById('imgurUpload').style.display = "none";
	document.getElementById('CustomShare').style.display = "none";
	document.getElementById('ZeroEverything').style.display = "none";
	document.getElementById('divImport').style.display = "none";
	document.getElementById('btnTextImport').style.display = "none";
	document.getElementById('ratingIndex').style.display = "none";
	document.getElementById('slcOptionsSwitch').style.display = "none";
	
}

function saveRatingsNames(){
	var ratings = JSON.parse(document.getElementById("ratingshidden").innerHTML);
	for (var k = 0; k < ratings.length; k++) {
		var ratingContainer = document.getElementById("Rating" + k);
		if(ratingContainer != null){
			ratings[k].Colour = ratingContainer.getElementsByTagName('input')[1].value;
			ratings[k].Description = ratingContainer.getElementsByTagName('input')[0].value;
		}
		document.documentElement.style.setProperty('--rating' + k, ratings[k].Colour);
	}
	document.getElementById("ratingshidden").innerHTML = JSON.stringify(ratings);
	document.getElementById("divRatingEdit").innerHTML = "";
	
	document.getElementById('SaveRating').style.display = "none";
	document.getElementById('EditRating').style = "";
	document.getElementById('btnEditItems').style = "";
	document.getElementById('imgurUpload').style = "";
	document.getElementById('CustomShare').style = "";
	document.getElementById('ZeroEverything').style = "";
	document.getElementById('slcOptionsSwitch').style = "";
	document.getElementById('btnTextImport').style = "";
	document.getElementById('ratingIndex').style = "";
	document.getElementById('divImport').style.display = "none";
	RateItems();
}

function zeroAll(){
	var TableBodies = document.getElementById("divDisplay").getElementsByTagName('tbody');
	for (var i = 0; i < TableBodies.length; i++) {
		TableRows = TableBodies[i].getElementsByTagName('tr');
		for (var j = 0; j < TableRows.length; j++) {
			CellsInRow = TableRows[j].getElementsByTagName('td');
			for (var k = 0; k < CellsInRow.length; k++) {
				if(Number.isInteger((k+5)/6)){
					CellsInRow[k].getElementsByTagName('input')[0].checked = true;				
				}
			}
		}
	}	
	saveresults();
}
function showImport(){	
	document.getElementById('divDisplay').style.display = "none";
	document.getElementById('divImport').style = "";
	document.getElementById('btnEditItems').style.display = "none";
	document.getElementById('imgurUpload').style.display = "none";
	document.getElementById('CustomShare').style.display = "none";
	document.getElementById('EditRating').style.display = "none";
	document.getElementById('ZeroEverything').style.display = "none";
	document.getElementById('btnTextImport').style.display = "none";
	document.getElementById('ratingIndex').style.display = "none";
	document.getElementById('slcOptionsSwitch').style.display = "none";
}

function importitems(){
	document.getElementById('divImport').style.display = "none";
	document.getElementById('ratingIndex').style = "";
	document.getElementById('divDisplay').style = "";
	document.getElementById('btnEditItems').style = "";
	document.getElementById('imgurUpload').style.display = "none";
	document.getElementById('CustomShare').style = "";
	document.getElementById('EditRating').style = "";
	document.getElementById('ZeroEverything').style = "";
	document.getElementById('btnTextImport').style = "";
	document.getElementById('slcOptionsSwitch').style = "";
	var importtext = document.getElementById("import");
	if(importtext.value != "" && importtext.value != null){
		var jsonobject = [];
		groups = replaceAll(importtext.value,"\n","").split("#");
		for (var i = 1; i < groups.length; i++) { 
			var newobj = {}, newgroup = [];
			newobj.Items = [];		 
			newobj.ChoiceType = [];		
			var GroupItems = groups[i].split("*");	
			var GroupNameDescription = GroupItems[0].split("(");
			newobj.Name = GroupNameDescription[0].replace("#","");
			newobj.Description = "";
			if(GroupNameDescription.length > 1){
				var ChoicesString = GroupNameDescription[1];
				var ChoicesList = ChoicesString.substring(0, ChoicesString.length - 1).split(",");
				for (var k = 0; k < ChoicesList.length; k++) {	
					var newchoice = {};		
					newchoice.Name = ChoicesList[k];
					newobj.ChoiceType.push(newchoice);
				}
			} else {
				var newchoice = {};		
				newchoice.Name = "General";
				newobj.ChoiceType.push(newchoice);
			}
			for (var j = 1; j < GroupItems.length; j++) {			
				var newitem = {};
				var ItemSplit = GroupItems[j].split("?");
				newitem.Name = ItemSplit[0];
				if(ItemSplit.length > 1){newitem.Description = ItemSplit[1];} else{newitem.Description = "";}
				
				newitem.Rating = "0";
				newobj.Items.push(newitem);
			
			}
			jsonobject.push(newobj);
		}
		document.getElementById("divDisplay").innerHTML = "";
		importtext.value = "";
		document.getElementById("jsonhidden").innerHTML = JSON.stringify(jsonobject);
	}
	//GroupItems2 = GroupItems[1].split("\n?");
	RateItems();
	
}
