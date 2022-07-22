window.onload = init;

function init(){
	showTab(0, 'tab');
}

function showTab(id, tabsName){
	var tabs = document.getElementsByClassName(tabsName);
	for (i = 0; i < tabs.length; i++) {
		tabs[i].style.display = "none";
		if(i == id){
			tabs[i].style.display = "block";
		}
	}
	links = document.getElementsByClassName(tabsName + "s")[0].getElementsByTagName('button');
	for (j = 0; j < links.length; j++) {
		links[j].style.backgroundColor = "#ddd";
		links[j].style.color = "#000";
		if(j == id){
			links[j].style.backgroundColor = "#4CAF50";
			links[j].style.color = "#fff";
		}
	}
}

function Post(x, id, id2){ 
	Message("Loading...");
	id = id || ""
	id2 = id2 || ""
	var post = {};
	var accept = "text/plain";
	switch(x){
		case "newform":
			var FormName = document.getElementById('newAdminFormName').value;
			var pass = document.getElementById('newAdminFormPassword').value;
			var passconfirm = document.getElementById('newAdminFormPasswordConfirm').value;
			if(pass == passconfirm){
				post = JSON.stringify({
					posttype: "NewForm",
					FormName: FormName,
					FormPassword: pass
					})
			} else{
				Message("passwords don't match.")
				return;
			}			
			break;
		case "renewTask":
			var FormName = document.getElementById('formID').value;
			var user = document.getElementById('userID').value;
			var pass = document.getElementById('adminPass').value;
			post = JSON.stringify({
				posttype: "RenewTask",
				FormName: FormName,
				UserName: user,
				FormPassword: pass,
				TaskID: id
			})		
			break;
		case "toggleTask":
			var FormName = document.getElementById('formID').value;
			var pass = document.getElementById('adminPass').value;
			post = JSON.stringify({
				posttype: "ToggleTask",
				FormName: FormName,
				FormPassword: pass,
				TaskID: id,
				Enabled: id2
			})		
			break;
		case "user":
			accept = "application/json";
			var FormName = document.getElementById('userFormName').value;
			var user = document.getElementById('userName').value;
			var pass = document.getElementById('userPassword').value;
			post = JSON.stringify({
				posttype: "GetFormAsUser",
				FormName: FormName,
				UserName: user,
				UserPassword: pass
			})
		
			break;
		case "newuser":
			var FormName = document.getElementById('FormName').value;
			var user = document.getElementById('newUserName').value;
			var pass = document.getElementById('newUserPassword').value;
			var passconfirm = document.getElementById('newUserPasswordConfirm').value;
			if(pass == passconfirm){
				post = JSON.stringify({
					posttype: "NewFormUser",
					FormName: FormName,
					UserName: user,
					UserPassword: pass
				})
			} else{
				Message("passwords don't match.")
				return;
			}			
			break;
		case "admin":
			accept = "application/json";
			var FormName = document.getElementById('adminFormName').value;
			var pass = document.getElementById('adminFormPassword').value;
			post = JSON.stringify({
				posttype: "GetFormAsAdmin",
				FormName: FormName,
				FormPassword: pass,
				CheckUser: ""
				})		
			break;
		case "admincheck":
			accept = "application/json";
			var UserName = document.getElementById('adminUserName').value;
			var FormName = document.getElementById('adminFormName2').value;
			var pass = document.getElementById('adminFormPassword2').value;
			post = JSON.stringify({
				posttype: "GetFormAsAdmin",
				FormName: FormName,
				FormPassword: pass,
				CheckUser: UserName
				})		
			break;
		case "submitanswer":
			var evidence = document.getElementById('taskevidence-' + id);
			var urllink = "";
			if(evidence != null){
				urllink = document.getElementById('imageURL-' + id).value;
			}
			var answer = document.getElementById('taskanswer-' + id).value;
			post = JSON.stringify({
				posttype: "CompleteTask",
				FormName: document.getElementById('formID').value,
				UserName: document.getElementById('userID').value,
				UserPassword: document.getElementById('userPass').value,
				TaskID: id,
				Answer: answer,
				Proof: urllink
				})		
			break;
		case "newtask":
			var proofrequired = 0;
			if(document.getElementById('newtaskProof').checked){
				proofrequired = 1;
			}
			post = JSON.stringify({
				posttype: "NewFormTask",
				FormName: document.getElementById('formID').value,
				FormPassword: document.getElementById('adminPass').value,
				TaskDescription: document.getElementById('newTaskDescription').value,
				RequiredWithin: document.getElementById('newTaskTimeLimit').value,
				EvidenceType: proofrequired
				})		
			break;
		default:
			return;
	}
	
	var jsonString = JSON.stringify(post);
	const proxyurl = '';//"https://cors-anywhere.herokuapp.com/";
	var fullurl = proxyurl + 'https://script.google.com/macros/s/AKfycbxE1tslUeHyhtWBuN8e7z8tAbsgMBfrSHdqynu3Wq2p1TmGR0aH/exec';
		if(accept == "text/plain"){
			fetch(fullurl, {
				method: 'post',
				mode: 'no-cors',
				headers: {
					'Authorization': '',
					'Accept': accept,
					'Content-type': 'text/plain'//'application/x-www-form-urlencoded; charset=UTF-8'
					},
		followRedirects: true,
		//mode: 'cors',
				body: post
				})
				//.then(json)
				.then(response=>response.text())
				.then(function (data) {
					switch(x){
						case "renewTask":
							deleteNode("renew-" + id);							
							break;
						case "submitanswer":
							deleteNode("task-" + id);
							break;
						case "toggleTask":
							toggleTask(id, id2);
							break;
						case "newtask":
							var array = [];
							var y = {};
							var proof = document.getElementById('newtaskProof');
							var description = document.getElementById('newTaskDescription');
							var timelimit = document.getElementById('newTaskTimeLimit');
							
							var proofrequired = 0;
							if(proof.checked)
							{
								proofrequired = 1;
								proof.removeAttribute('checked');
							}
							y.description = description.value;
							description.value = "";
							y.enabled = 1;
							y.id = "new";
							y.evidence = proofrequired;
							y.requiredby = timelimit.value;
							timelimit.value = "";
							console.log(y);
							array.push(y);
							console.log(array);
							formadmin(array);
							break;
					}
					Message(data);
				})
				.catch(function (error) {
					Message("Failed");
			});	
		} else if(accept == "application/json"){
			fetch(fullurl, {
				method: 'post',
				mode: 'no-cors',
				headers: {
					'Authorization': '',
					'Accept': accept,
					'Content-type': 'application/json'//'application/x-www-form-urlencoded; charset=UTF-8'
				},
		followRedirects: true,
		//mode: 'cors',
				body: post
				})
				//.then(json)
				.then(response=>response.json())
				.then(function (data) {
					console.log(data);
					if(data.length == 1 && data[0].error != undefined && data[0].error != ""){
						Message(data[0].error);						
					} else{
						document.getElementById('login').style.display = "none";
						document.getElementById('warning').style.display = "none";
						switch(x){
							case "user":
								createusertasks(data);
								break;
							case "admin":
								formadmin(data);
								break;
							case "admincheck":
								trackuser(data);
								break;
						}						
						ChangeDisplayType('myModal', 'none');
					}
				})
				.catch(function (error) {
					Message("Failed");
			});
		}
}


function deleteNode(id){
	document.getElementById(id).parentNode.removeChild(document.getElementById(id));
}

function toggleTask(id, id2){
	var x = document.getElementById("toggle-" + id);
	var innertext = "Enable";
	var toggleID = 1;
	if(id2 == 1){
		innertext = "Disable";
		toggleID = 0;
	}
	var click = "Post('toggleTask', '" + id + "', '" + toggleID + "')";
	x.setAttribute("onclick", click);
	x.innerHTML = innertext;
}

function formadmin(x){
	document.getElementById('formID').value = document.getElementById('adminFormName').value;
	document.getElementById('adminPass').value = document.getElementById('adminFormPassword').value;
	var taskshowarea = document.getElementById('userTasks');
	taskshowarea.style.display = "block";
	var now = new Date().getTime();
	for (var j=0; j<x.length; j++){
		var requiredby = x[j].deadline + ".";
		var yearreq = requiredby.substring(0, 4);
		var monthreq = requiredby.substring(4, 6);
		var dayreq = requiredby.substring(6, 8);
		var daterequired = new Date(yearreq + "-" + monthreq + "-" + dayreq + "T23:59:59Z");
		var minutesremaining = Math.floor((daterequired.getTime() - now) / 1000 / 60);
		var hoursremaining = Math.floor(minutesremaining / 60);
		minutesremaining = minutesremaining - (hoursremaining * 60);
		var daysremaining = Math.floor(hoursremaining / 24); 
		hoursremaining = hoursremaining - (daysremaining * 24);
		
		var newelem = document.createElement('div');
		newelem.className = "task";
		newelem.id = "taskList-" + x[j].id;		
		var enabledText = "Enable";
		var enablechange = 1;
		if(x[j].enabled){enabledText = "Disable"; enablechange = 0;}
		innerhtml = "<h4>Task " + x[j].id + " <button id='renew-" + x[j].id + "' onclick='Post(\"renewTask\", \"" + x[j].id + "\")'>Renew Task For All</button> <button id='toggle-" + x[j].id + "' onclick='Post(\"toggleTask\", \"" + x[j].id + "\", \"" + enablechange + "\")'>" + enabledText + "</button></h4><span>" + x[j].description + "</span><hr />Required within " + x[j].requiredby + " days";
		if(x[j].evidence == "1"){
			innerhtml += " with imgur photo proof required."
		}
		
		newelem.innerHTML = innerhtml;
		taskshowarea.appendChild(newelem);
	}
	document.getElementById('newtask').style.display = "block";
}

function trackuser(x){
	document.getElementById('formID').value = document.getElementById('adminFormName2').value
	document.getElementById('userID').value = document.getElementById('adminUserName').value
	document.getElementById('adminPass').value = document.getElementById('adminFormPassword2').value
	var taskshowarea = document.getElementById('userTasks');
	taskshowarea.style.display = "block";
	var now = new Date().getTime();
	for (var j=0; j<x.length; j++){
		var requiredby = x[j].deadline + ".";
		var yearreq = requiredby.substring(0, 4);
		var monthreq = requiredby.substring(4, 6);
		var dayreq = requiredby.substring(6, 8);
		var daterequired = new Date(yearreq + "-" + monthreq + "-" + dayreq + "T23:59:59Z");
		var minutesremaining = Math.floor((daterequired.getTime() - now) / 1000 / 60);
		var hoursremaining = Math.floor(minutesremaining / 60);
		minutesremaining = minutesremaining - (hoursremaining * 60);
		var daysremaining = Math.floor(hoursremaining / 24); 
		hoursremaining = hoursremaining - (daysremaining * 24);
		
		var newelem = document.createElement('div');
		newelem.className = "task";
		newelem.id = "taskTracking-" + x[j].id;
		innerhtml = "<span><q>" + x[j].description + "</q></span>";
		if(x[j].finished == ""){
			innerhtml += " Required in: " + daysremaining + " days " + hoursremaining + " hours " + minutesremaining + " minutes "
		} else { 
			innerhtml += " Completed On: " + x[j].finished + " Deadline Was: " + x[j].deadline + " <span>Answer: " + x[j].answer + "</span> <button id='renew-" + x[j].id + "' onclick='Post(\"renewTask\", \"" + x[j].id + "\")'>Renew Task</button>";
		}
		if(x[j].proof != ""){
			innerhtml += " <span>Proof: <a href='" + x[j].proof + "' target='_blank'>" + x[j].proof + "</a></span>";
		}
		innerhtml += "<hr />";
		newelem.innerHTML = innerhtml;
		taskshowarea.appendChild(newelem);
	}
}

function createusertasks(x){
	document.getElementById('formID').value = document.getElementById('userFormName').value
	document.getElementById('userID').value = document.getElementById('userName').value
	document.getElementById('userPass').value = document.getElementById('userPassword').value
	var taskshowarea = document.getElementById('userTasks');
	taskshowarea.style.display = "block";
	var now = new Date().getTime();
	if(x.length > 0){
		for (var j=0; j<x.length; j++){
			var requiredby = x[j].requiredby + ".";
			var yearreq = requiredby.substring(0, 4);
			var monthreq = requiredby.substring(4, 6);
			var dayreq = requiredby.substring(6, 8);
			var daterequired = new Date(yearreq + "-" + monthreq + "-" + dayreq + "T23:59:59Z");
			var minutesremaining = Math.floor((daterequired.getTime() - now) / 1000 / 60);
			var hoursremaining = Math.floor(minutesremaining / 60);
			minutesremaining = minutesremaining - (hoursremaining * 60);
			var daysremaining = Math.floor(hoursremaining / 24); 
			hoursremaining = hoursremaining - (daysremaining * 24);
			
			var newelem = document.createElement('div');
			newelem.className = "task";
			newelem.id = "task-" + x[j].id;
			var innerhtml = "";
			if(x[j].new == 1){ 
				innerhtml += "<span>** new task **</span><br />"
			}
			innerhtml += "<span><q>" + x[j].description + "</q></span><br /> Required in: " + daysremaining + " days " + hoursremaining + " hours " + minutesremaining + " minutes<br />";
			var sumbitbutton = "block";
			if(x[j].evidence == 1){
				innerhtml += "File Upload: <input id='taskevidence-" + x[j].id + "' type='file' onchange='encodeImageFileAsURL(" + x[j].id + ")' /><input id='base64image-" + x[j].id + "' style='display:none;' /><button id='btnUploadImgur-" + x[j].id + "' onclick='imgurUpload(" + x[j].id  + ")'>Upload Image</button><input id='imageURL-" + x[j].id + "' style='display:none;' disabled='disabled' /><br / >"
				sumbitbutton = "none";
			}
			innerhtml += "Answer: <input id='taskanswer-" + x[j].id + "' /><br />"
			
			innerhtml += "<button id='sumbittask-" + x[j].id + "' onclick='Post(\"submitanswer\", \"" + x[j].id + "\")' style='display:" + sumbitbutton + ";'>submit answer</button><hr />"
			newelem.innerHTML = innerhtml;
			taskshowarea.appendChild(newelem);
		}
	}
	if(taskshowarea.innerHTML == ""){taskshowarea.innerHTML = "All tasks complete, congrats.";}
}

function encodeImageFileAsURL(id) {
	var element = document.getElementById("taskevidence-" + id);
	var base64 = document.getElementById("base64image-" + id);
	var file = element.files[0];
	var reader = new FileReader();
	reader.onloadend = function() {
		base64.value = reader.result.split(',')[1];
	}
	reader.readAsDataURL(file);
}

function imgurUpload(id) {
	var imgurClientId = '9db53e5936cd02f';
	
	var elem = document.getElementById("base64image-" + id);
	if(elem != null){		
		const proxyurl = '';//"https://cors-anywhere.herokuapp.com/";
		fetch(proxyurl + 'https://api.imgur.com/3/image', {
			method: 'post',
			headers: {
				'Authorization': 'Client-ID ' + imgurClientId,
				'Accept': 'application/json',
				'Content-type': 'application/json'//'application/x-www-form-urlencoded; charset=UTF-8'
			},
		mode: 'cors',
			body: JSON.stringify({
				image:  elem.value,
				type: 'base64'			
			})//'foo=bar&lorem=ipsum'
		})
			//.then(json)
			.then(response=>response.json())
			.then(function (data) {
				var url = 'https://i.imgur.com/' + data.data.id + '.png';	
				console.log(url);
				document.getElementById("imageURL-" + id).value = url;
				document.getElementById("taskevidence-" + id).style.display = "none";
				document.getElementById("btnUploadImgur-" + id).style.display = "none";
				document.getElementById("sumbittask-" + id).style.display = "block";
				document.getElementById("imageURL-" + id).style.display = "block";				
				ChangeDisplayType('myModal', 'none');
			})
			.catch(function (error) {
				Message("Request Failed");
			});		
	}
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
