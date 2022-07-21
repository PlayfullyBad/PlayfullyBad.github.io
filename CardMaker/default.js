window.onload = createImage;

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function isDark(n, hex) {
	var rgb = hexToRgb(hex);
	var m = (n || 128);
	return (((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000) < m);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

function createImage(){
	var container = document.getElementById("preview");
	container.innerHTML = "";
	var magnification = document.getElementById("zoom").value;
	if(magnification < 0.5) {magnification = 0.5;}
	var height = 539.8 * magnification;
	var width = 856 * magnification;
	var heightunit = document.getElementById("textsize").value * magnification;
	var padding = 10 * magnification;
	var yheight = heightunit;
	var rad = 10 * magnification;
	
	var c = document.createElement('canvas');
	//c.style.border = "1px solid black";
	c.width = width;
	c.height = height;
	
	var paddingtext = padding;
	photoleft = document.getElementById('photoleft').checked;
	if(photoleft){
		paddingtext = (c.width / 2) + padding;
	}
	var headersize = c.height / 5;
	var headertext = headersize - (padding * 2);
	var ctx = c.getContext("2d");
	ctx.fillStyle = document.getElementById("colour1").value;
	ctx.strokeStyle = document.getElementById("colour1").value;
	roundRect(ctx, 0, 0, c.width, headersize, {tl: rad, tr: rad}, true, false);
	ctx.fillStyle = "#ffffff";
	roundRect(ctx, 0, headersize, c.width, c.height - headersize, {bl: rad, br: rad}, true, true);
	
	ctx.font = headertext + "px Arial";
	ctx.textAlign = "center";
	col = "#000";
	if (isDark(165, document.getElementById("colour1").value)) {col = "#fff"};
	ctx.fillStyle = col;
	ctx.fillText(document.getElementById("name").value, c.width /2 ,headersize - (padding * (5 / 2)));
	ctx.fillStyle = document.getElementById("colourtext").value;
	ctx.font = (heightunit-2) + "px Arial";
	ctx.textAlign = "left";
	var dob = document.getElementById("dob").value;
	if(dob != ""){
		ctx.fillText("D.O.B. " + formatDate(dob), paddingtext ,headersize + yheight);
		yheight +=heightunit;		
	}
	var country = document.getElementById("country").value;
	var county = document.getElementById("county").value;
	var town = document.getElementById("town").value;
	if(country != "" || county != "" || town != ""){
		var location = "";
		if(country != ""){
			location = country;
		}
		if(county != ""){
			location += ", " + county;
		}
		if(town != ""){
			location += ", " + town;
		}
		yheight = wrapText(ctx, "Location: " + location, paddingtext ,headersize + yheight, (c.width / 2) - (padding * 2), heightunit) - headersize;
		yheight +=heightunit;
	}
	for (var i = 1; i < 7; i++) {
		var attribute = document.getElementById("attribute" + i).value;
		if(attribute != ""){
			var metrics = ctx.measureText("- ");
			var testWidth = metrics.width;
			ctx.fillText("- ", paddingtext ,headersize + yheight);
			yheight = wrapText(ctx, attribute, paddingtext + testWidth ,headersize + yheight, (c.width / 2) - (padding * 2) - testWidth, heightunit) - headersize;
			yheight +=heightunit;
		}
	}
	var phone = document.getElementById("phone").value;
	if(phone != ""){
		yheight = wrapText(ctx, "Phone: " + phone, paddingtext ,headersize + yheight, (c.width / 2) - (padding * 2), heightunit) - headersize;
		yheight +=heightunit;		
	}
	var email = document.getElementById("email").value;
	if(email != ""){
		yheight = wrapText(ctx, "Email: " + email, paddingtext ,headersize + yheight, (c.width / 2) - (padding * 2), heightunit) - headersize;
		yheight +=heightunit;		
	}
	var reddit = document.getElementById("reddit").value;
	if(reddit != ""){
		yheight = wrapText(ctx, "Reddit: " + reddit, paddingtext ,headersize + yheight, (c.width / 2) - (padding * 2), heightunit) - headersize;
		yheight +=heightunit;		
	}
	var facebook = document.getElementById("facebook").value;
	if(facebook != ""){
		yheight = wrapText(ctx, "Facebook: " + facebook, paddingtext ,headersize + yheight, (c.width / 2) - (padding * 2), heightunit) - headersize;
		yheight +=heightunit;		
	}
	var kik = document.getElementById("kik").value;
	if(kik != ""){
		yheight = wrapText(ctx, "KIK: " + kik, paddingtext ,headersize + yheight, (c.width / 2) - (padding * 2), heightunit) - headersize;
		yheight +=heightunit;		
	}
	var custom = document.getElementById("customtext").value;
	if(custom != ""){
		var customx = document.getElementById("customx").value;
		var customy = document.getElementById("customy").value;
		var customwrap = document.getElementById("customwrap").value;
		yheight = wrapText(ctx, custom, c.width * (customx / 100), c.height * (customy / 100), c.width * (customwrap / 100), heightunit) - headersize;
		yheight +=heightunit;		
	}
	
	var photoimage = new Image();	
	var photo = document.getElementById("base64photo").value;
	var base64id = document.getElementById("base64id");
	var img = "";
	if(photo != ""){		
		photoimage.onload = function() {
			fitPhoto(ctx, photoimage, padding, headersize, c, photoleft);
			img = c.toDataURL("image/png");
			base64id.value = img;
		};
		photoimage.src = photo;
	} else{
		img = c.toDataURL("image/png");
		base64id.value = img;
	}	
	container.appendChild(c);	
}

function fitPhoto(context, photo, padding, headersize, canvas, photoleft){
	var maxWidth = (canvas.width / 2) - (padding * 2);
	var maxHeight = canvas.height - (padding * 2) - headersize;
	var srcWidth = photo.width;
	var srcHeight = photo.height;
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
	photo.width = photo.width * ratio;
	photo.height = photo.height * ratio;
	var photox = (canvas.width / 2) + padding;
	if(photoleft){
		photox = padding;
	}
	context.drawImage(photo, photox, headersize + padding, photo.width, photo.height);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {  
	var words = text.split(" ");  
	var line = "";  
	for (var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + " ";
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth) {  
			context.fillText(line, x, y);  
			line = words[n] + " ";  
			y += lineHeight;  
		} else {  
			line = testLine;  
		}  
	}  
	context.fillText(line, x, y);
	return y
}  

function encodeImageFileAsURL() {
	var element = document.getElementById("image");
	var base64 = document.getElementById("base64photo");
	var file = element.files[0];
	var reader = new FileReader();
	reader.onloadend = function() {
		base64.value = reader.result;
		createImage();
	}
	reader.readAsDataURL(file);
}

function formatDate(x){
	const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	let date = new Date(x);
	let formatted_date = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear();
	return formatted_date;
}

function imgurUpload() {
	var imagestring = document.getElementById("base64id").value;
	var imgurClientId = '9db53e5936cd02f';
	const proxyurl = '';//"https://cors-anywhere.herokuapp.com/";
	fetch(proxyurl + 'https://api.imgur.com/3/image', {
		method: 'post',
		headers: {
			'Authorization': 'Client-ID ' + imgurClientId,
			'Accept': 'application/json',
			'Content-type': 'application/json'
		},
		mode: 'cors',
		body: JSON.stringify({
			image:  imagestring.split(',')[1],
			type: 'base64'			
		})
	})
		.then(response=>response.json())
		.then(function (data) {
			var url = 'https://i.imgur.com/' + data.data.id + '.png';			
			alert(url);			
		})
		.catch(function (error) {
			alert("Request Failed");
		});		
		
}

function replaceAll(str, oldstr, newstr) {
  return str.replace(new RegExp(oldstr, 'g'), newstr);
}

function Message(text, type) {	
	type = type || "";
	var container = document.getElementById('pModalMessage');
	container.innerHTML = "";
	switch(type) {
		case "Link":
			var newelemlink = document.createElement('a');
			newelemlink.href = text;
			newelemlink.target = "_blank";
			newelemlink.innerHTML = text;
			container.appendChild(newelemlink);
			break;
		default:
			container.innerHTML = text;
	}
	ChangeDisplayType('myModal', 'block');
}

function ChangeDisplayType(id, displaytype) {
	var modal = document.getElementById(id);
	modal.style.display = displaytype;
}
