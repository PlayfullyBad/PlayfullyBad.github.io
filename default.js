function Post(x, id){
	id = id || "";
	var post = {};
	var accept = "text/plain";
	switch(x){
		case "SendMessage":
			var EmailAddress = ".";
			var EmailSubject = document.getElementById('EmailSubject').value;
			var EmailSuggestion = document.getElementById('EmailSuggestion').value;
			var EmailreCAPCHA = document.getElementById('reCaptureResponse').value;			
			var EmailBody = [];
			if(EmailSuggestion != ""){EmailBody.push("Suggestion: " + EmailSuggestion);}
			if(EmailAddress == "" || EmailSubject == "" || EmailreCAPCHA == "" || EmailBody.length < 1){ alert("Please fill all required fields."); return; }
			post = JSON.stringify({
				PostType: "EmailForm",
				EmailAddress: EmailAddress,
				EmailSubject: EmailSubject,
				EmailreCAPCHA: EmailreCAPCHA,
				EmailBody: EmailBody
			})		
			break;
		default:
			return;
	}
	var jsonString = JSON.stringify(post);
	const proxyurl = '';//"https://cors-anywhere.herokuapp.com/";
	var fullurl = proxyurl + 'https://script.google.com/macros/s/AKfycbw6DcMNV-SSPqsU000BOrxAhKBo1JCZPFUr6yAUlbNZYFVw2QU/exec';
	fetch(fullurl, {
		method: 'post',
		headers: {
			'Authorization': '',
			'Accept': accept,
			'Content-type': 'application/json'
			},
		mode: 'cors',
		body: post
		})
		.then(response=>response.text())
		.then(function (data) {
			if(data == "Email Sent."){				
				document.getElementById('EmailSubject').value = "";
				document.getElementById('EmailSuggestion').value = "";
				document.getElementById('reCaptureResponse').value = "";	
			}
			alert(data);
		})
		.catch(function (error) {
			alert("Failed");
		});	
		
}
