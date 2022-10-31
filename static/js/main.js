var baseurl = "https://ux.ineuron.ai/atsApp";
//var baseurl = "http://localhost/ATS";

var interval;
var base64Data;
var automaticVideoPlaying = false;
var base64DataArray = [];
var responseArray = [];
var unknownArray = [];
var attendanceReportsArray = [];
var registeredUsersArray = [];
var unknownUsersArray = [];
var firstName;
var randomId;
var registrationFormValidation = false;
var reportsId = "no";

var anprCanvas = document.getElementById('anpr-canvas');

var automaticVideo = document.getElementById('automatic-video');
var automaticImage = document.getElementById('automatic-image');
var automaticTableBox = document.getElementsByClassName("automatic-table-box");
var automaticTableBody = document.getElementsByClassName("automatic-table-body");

var manualVideoPlaying = true;
var manualVideo = document.getElementById('manual-video');
var manualImage = document.getElementById('manual-image');
var manualTableBox = document.getElementsByClassName("manual-table-box");
var manualTableBody = document.getElementsByClassName("manual-table-body");

$(document).ready(function(){
	$('#loading').hide();
	$("#automatic-send-btn").attr('disabled',true);
	$('.registration-success-message').hide();
	$("#mobile-no").intlTelInput();
	
	$(document).on("click",'#attendance .btn-delete',function(e){
		if(confirm('Do you want really delete this entry?')){
			var id = $(this).attr("id");
			$.ajax({
				url: baseurl+"/php/deleteDailyAttendanceData.php",
				type: "post",
				data:{id : id},
				success: function(data){
					if(data == "deleted"){				
						for(var i = 0;i <= attendanceReportsArray.length;i++){
							try{
								if(attendanceReportsArray[i].id == id){
									attendanceReportsArray.splice(i,1);
									break;
								}
							}
							catch(err){}
						}
					}
					attendanceSortFunction(attendanceReportsArray);
				}
			});
		}else{ }
	});	
		
	$(document).on("click",'#attendance .btn-edit',function(e){
		if(reportsId == "no"){
			
		}else{
			$("#attendance .reports-table-body>tr>td.edit-box").removeAttr("contenteditable");
			$("#attendance .reports-table-body .editable").html('<div class="btn-delete" id="'+reportsId+'"><i class="fas fa-trash-alt" aria-hidden="true"></i></div><div class="btn-edit" id="'+reportsId+'"> <i class="fas fa-pen-square" aria-hidden="true"></i></div>');
			$("#attendance .editable").removeClass("editable");
		}		
		$(this).parent().addClass("editable");
		$("#attendance .editable").siblings(".edit-box").attr("contenteditable","true");
		$("#attendance .editable").siblings(".edit-box").first().focus();
		var id = $(this).attr("id");
		$(this).parent().html('<div class="btn-update" id="'+id+'"><i class="fas fa-sync-alt" aria-hidden="true"></i></div><div class="btn-cancel" id="'+id+'"> <i class="fas fa-window-close" aria-hidden="true"></i></div>');
		reportsId = id;
	});
	
	$(document).on("click",'#attendance .btn-update',function(e){
		var id = $(this).attr("id");
		var attendanceGovtid = $(this).parent().siblings("#attendance-govtid").text();
		var reportsDate = $(this).parent().siblings("#attendance-date").text();
		var reportsTime = $(this).parent().siblings("#attendance-time").text();
		$.ajax({
			url: baseurl+"/php/updateAttendanceData.php",
			type: "post",
			data:{id:id,attendanceGovtid:attendanceGovtid,reportsDate:reportsDate,reportsTime:reportsTime},
			success: function(data){
				if(data=="updated"){
					$("#attendance .reports-table-body>tr>td.edit-box").removeAttr("contenteditable");
					$("#attendance .reports-table-body .editable").html('<div class="btn-delete" id="'+reportsId+'"><i class="fas fa-trash-alt" aria-hidden="true"></i></div><div class="btn-edit" id="'+reportsId+'"> <i class="fas fa-pen-square" aria-hidden="true"></i></div>');
					$("#attendance .editable").removeClass("editable");
					for(var i = 0;i <= attendanceReportsArray.length;i++){
						if(attendanceReportsArray[i].id == id){
							id = i;
							break;
						}
					}
					attendanceReportsArray[id].date = reportsDate;
					attendanceReportsArray[id].time = reportsTime;
					attendanceReportsArray[id].govtid = attendanceGovtid;
				}
			}
		});
		
	});
	
	$(document).on("click",'#attendance .btn-cancel',function(e){
		var id = $(this).attr("id");
		$("#attendance .reports-table-body>tr>td.edit-box").removeAttr("contenteditable");
		$(this).parent().html('<div class="btn-delete" id="'+id+'"><i class="fas fa-trash-alt" aria-hidden="true"></i></div><div class="btn-edit" id="'+id+'"> <i class="fas fa-pen-square" aria-hidden="true"></i></div>');
	
	});
	
	
	
	
	$(document).on("click",'#registered-users .btn-delete',function(e){
		if(confirm('Do you want really delete this entry?')){
			var id = $(this).attr("id");
			var name = $(this).parent().attr("class");
			$.ajax({
				url: baseurl+"/php/deleteAtsData.php",
				type: "post",
				data:{id : id,name : name},
				success: function(data){
					if(data == "deleted"){
						for(var i = 0;i <= registeredUsersArray.length;i++){
							try
							{
								if(registeredUsersArray[i].id == id){
									registeredUsersArray.splice(i,1);
									break;
								}
							}catch(err){}
						}
						regusersSortFunction(registeredUsersArray);
					}
				}
			});
		}else{ }
	});	
	
	$(document).on("click",'#registered-users .btn-edit',function(e){
		if(reportsId == "no"){
			
		}else{
			$(".reports-table-body>tr>td.edit-box").removeAttr("contenteditable");
			$(".reports-table-body .editable").html('<div class="btn-delete" id="'+reportsId+'"><i class="fas fa-trash-alt" aria-hidden="true"></i></div><div class="btn-edit" id="'+reportsId+'"> <i class="fas fa-pen-square" aria-hidden="true"></i></div>');
			$(".editable").removeClass("editable");
		}		
		$(this).parent().addClass("editable");
		$(".editable").siblings(".edit-box").attr("contenteditable","true");
		$(".editable").siblings(".edit-box").first().focus();
		var id = $(this).attr("id");
		$(this).parent().html('<div class="btn-update" id="'+id+'"><i class="fas fa-sync-alt" aria-hidden="true"></i></div><div class="btn-cancel" id="'+id+'"> <i class="fas fa-window-close" aria-hidden="true"></i></div>');
		reportsId = id;
	});
	
	$(document).on("click",'#registered-users .btn-update',function(e){
		var id = $(this).attr("id");
		var registerEmail = $(this).parent().siblings("#register-email").text();
		var registerPhno = $(this).parent().siblings("#register-phno").text();
		var registerDesignation = $(this).parent().siblings("#register-designation").text();
		var registerGovtid = $(this).parent().siblings("#register-govtid").text();
		$.ajax({
			url: baseurl+"/php/updateAtsData.php",
			type: "post",
			data:{id:id,registerEmail:registerEmail,registerPhno:registerPhno,registerDesignation:registerDesignation,registerGovtid:registerGovtid},
			success: function(data){
				if(data=="updated"){
					$(".reports-table-body>tr>td.edit-box").removeAttr("contenteditable");
					$(".reports-table-body .editable").html('<div class="btn-delete" id="'+reportsId+'"><i class="fas fa-trash-alt" aria-hidden="true"></i></div><div class="btn-edit" id="'+reportsId+'"> <i class="fas fa-pen-square" aria-hidden="true"></i></div>');
					$(".editable").removeClass("editable");
					for(var i = 0;i <= registeredUsersArray.length;i++){
						if(registeredUsersArray[i].id == id){
							id = i;
							break;
						}
					}
					registeredUsersArray[id].emailid = registerEmail;
					registeredUsersArray[id].phno = registerPhno;
					registeredUsersArray[id].designation = registerDesignation;
					registeredUsersArray[id].govtid = registerGovtid;
				}
			}
		});
		
	});
	
	$(document).on("click",'#registered-users .btn-cancel',function(e){
		var id = $(this).attr("id");
		$(".reports-table-body>tr>td.edit-box").removeAttr("contenteditable");
		$(this).parent().html('<div class="btn-delete" id="'+id+'"><i class="fas fa-trash-alt" aria-hidden="true"></i></div><div class="btn-edit" id="'+id+'"> <i class="fas fa-pen-square" aria-hidden="true"></i></div>');
	
	});
	
	
	
	$(document).on("click",'#unknown-users .btn-delete',function(e){
		if(confirm('Do you want really delete this entry?')){
			var id = $(this).attr("id");
			$.ajax({
				url: baseurl+"/php/deleteUnknownData.php",
				type: "post",
				data:{id : id},
				success: function(data){
					if(data == "deleted"){
						for(var i = 0;i <= unknownUsersArray.length;i++){
							try
							{
								if(unknownUsersArray[i].id == id){
									unknownUsersArray.splice(i,1);
									break;
								}
							}catch(err){}
						}
						unknownUsersSortFunction(unknownUsersArray);
					}
				}
			});
		}else{ }
	});
	
			
	$.validate({
		lang: 'en',
		validateOnBlur : true,
		validateOnKeyPress : true,
		errorMessagePosition : 'inline',
		onSuccess : function($form){
		  registrationFormValidation = true;
		  return false;
		},
	});
	
	//capture function
	$('#automatic-start-btn').click(function(e){
		$('#userRegistration').submit();
		$("#automatic-image").html("");
		if(registrationFormValidation){
			if($('#automatic-start-btn').html() == "Re Capture"){
				$("#automatic-image").css({display: "none"});
				$('#automatic-start-btn').html("Re Capturing");
				$("#automatic-start-btn").attr('disabled',true);
				$("#automatic-send-btn").attr('disabled',true);
				$("#automatic-image").html("");
				base64DataArray = [];
				startCamera(automaticVideo);
				setTimeout(2000);
				randomId = Math.floor((Math.random() * 1000) + 1);
				firstName = $('#first-name').val();
				$(automaticImage).html("");
				interval = setInterval(function(){
					base64Data = getBase64Data(automaticVideo,anprCanvas);
					base64DataArray.push({"lName": firstName, "lData":base64Data,"lId":randomId});
					if(anprCanvas.height > 0 && anprCanvas.width > 0){
						$(automaticImage).show();
						$("#automatic-image>img.active").removeClass("active");
						$(automaticImage).append("<img class='active' src='"+anprCanvas.toDataURL('image/jpeg', 1.0)+"'/>");
					}
					if(base64DataArray.length >= 5){
						$("#automatic-send-btn").attr('disabled',false);
						$('#automatic-start-btn').html("Re Capture");
						$("#automatic-start-btn").attr('disabled',false);
						clearInterval(interval);
						stopCamera(automaticVideo,anprCanvas);
					}
				},2000);
			}
			else{
				$(this).attr('disabled',true);
				$('#automatic-start-btn').html("Capturing");
				startCamera(automaticVideo);
				setTimeout(2000);
				randomId = Math.floor((Math.random() * 1000) + 1);
				firstName = $('#first-name').val();
				$(automaticImage).html("");
				interval = setInterval(function(){
					base64Data = getBase64Data(automaticVideo,anprCanvas);
					base64DataArray.push({"lName": firstName, "lData":base64Data,"lId":randomId});
					if(anprCanvas.height > 0 && anprCanvas.width > 0){
						$(automaticImage).show();
						$("#automatic-image>img.active").removeClass("active");
						$(automaticImage).append("<img class='active' src='"+anprCanvas.toDataURL('image/jpeg', 1.0)+"'/>");
					}
					if(base64DataArray.length >= 5){
						$("#automatic-send-btn").attr('disabled',false);
						$('#automatic-start-btn').html("Re Capture");
						$('#automatic-start-btn').attr('disabled',false);
						clearInterval(interval);
						stopCamera(automaticVideo,anprCanvas);
					}
				},2000);
			}
		}
	});
		
	//train function
	$('#automatic-send-btn').click(function(e){ 
		if(base64DataArray.length >= 5){ sendData(); }
		else{ alert("Images are not captured"); }
	});
	
	
	$(document).on("click", '#automatic-image img', function(event){
		$('#automatic-image img').removeClass("active");
		$(this).addClass("active");
		$("#automatic-video").attr("poster",$(this).attr('src'));
	});
	
	//automatic attendance capture
	manualCapture();
	
	//stop automatic attendance system
	$('#manual-stop-btn').click(function(e){ 
		stopCamera(manualVideo,anprCanvas);
		manualVideoPlaying = false;
		$.ajax({
			url : baseurl+"/php/insertAttendanceData.php",
			type: "post",
			data:{insertData : responseArray},
			success: function(resultdata){
				
			}
		});
		$.ajax({
			url : baseurl+"/php/insertUnknownData.php",
			type: "post",
			data:{insertData : unknownArray},
			success: function(resultdata){
				
			}
		});
		responseArray = [];
		unknownArray = [];
	});
	
	
	// top 3 tabs 
	$('.anpr-tabs li').click(function(e){ 
		if($(this).attr("id") == "automatic-tab"){
			if(manualVideoPlaying == true){
			    try { stopCamera(manualVideo,anprCanvas); } catch (e) {  }
			}
			automaticVideoPlaying = true;
			
		}
		else if($(this).attr("id") == "manual-tab"){
			if(automaticVideoPlaying == true){
			    try {stopCamera(automaticVideo,anprCanvas); } catch (e) {  }
			}
			manualCapture();
			manualVideoPlaying = true;
		}
		else if($(this).attr("id") == "reports-tab"){ 
			if(automaticVideoPlaying == true){
			    try { stopCamera(automaticVideo,anprCanvas); } catch (e) {  }
			}
			if(manualVideoPlaying == true){
			    try { stopCamera(manualVideo,anprCanvas); } catch (e) {  }
			}
			showAttendanceReports(1);
		}
		else if($(this).attr("id") == "unknown-tab"){ 
			if(automaticVideoPlaying == true){
			    try { stopCamera(automaticVideo,anprCanvas); } catch (e) {  }
			}
			if(manualVideoPlaying == true){
			    try { stopCamera(manualVideo,anprCanvas); } catch (e) {  }
			}
			showUnknownUsersReports(1);
		}
	});
	
	
	//reports inner tabs
	$('.reports-tabs li').click(function(e){ 
		if($(this).attr("id") == "attendance-tab"){
			showAttendanceReports(1);
		}
		if($(this).attr("id") == "registered-users-tab"){
			showRegUsersReports(1);
		}
		if($(this).attr("id") == "unknown-users-tab"){
			showUnknownUsersReports(1);
		}
	});

	//attendance pagination in reports sections
	$(document).on("click", '#attendance .pagination li a', function(event){ 
		var pageNoWithRange = $(this).attr('id').split("-");
		var parentId = $(this).parents().eq(3).attr('id');
		$("#attendance .reports-table-body").html("");
		for(var j=pageNoWithRange[0];j<=pageNoWithRange[1];j++){
			try{
				$("#attendance .reports-table-body").append("<tr><td><img id='student-image' src='data:image/jpeg;base64," + attendanceReportsArray[j].studentimage +"'></td><td>"+attendanceReportsArray[j].name+"</td><td class='edit-box' id='attendance-govtid'>"+attendanceReportsArray[j].govtid+"</td><td class='edit-box' id='attendance-date'>"+attendanceReportsArray[j].date+"</td><td class='edit-box' id='attendance-time'>"+attendanceReportsArray[j].time+"</td><td><div class='btn-delete' id='"+ attendanceReportsArray[j].id +"'><i class='fas fa-trash-alt'></i></div><div class='btn-edit' id='"+ attendanceReportsArray[j].id +"'> <i class='fas fa-pen-square'></i></div> </td></tr>");
			}
			catch(err){}
		}
	});
	
	
	//registered users pagination in reports section
	$(document).on("click", '#registered-users .pagination li a', function(event){ 
		var pageNoWithRange = $(this).attr('id').split("-");
		var parentId = $(this).parents().eq(3).attr('id');
		$("#registered-users .reports-table-body").html("");
		for(var j=pageNoWithRange[0];j<=pageNoWithRange[1];j++){
			try{
				$("#registered-users .reports-table-body").append("<tr><td><img id='student-image' src='data:image/jpeg;base64," + registeredUsersArray[j].studentimg +"'></td><td>"+registeredUsersArray[j].firstname+" "+registeredUsersArray[j].lastname+"</td><td class='edit-box' id='register-email'>"+registeredUsersArray[j].emailid+"</td><td class='edit-box' id='register-phno'>"+registeredUsersArray[j].phno+"</td><td class='edit-box' id='register-designation'>"+registeredUsersArray[j].designation+"</td><td class='edit-box' id='register-govtid'>"+registeredUsersArray[j].govtid+"</td><td class="+registeredUsersArray[j].firstname+"><div class='btn-delete' id='"+ registeredUsersArray[j].id +"'><i class='fas fa-trash-alt'></i></div><div class='btn-edit' id='"+ registeredUsersArray[j].id +"'> <i class='fas fa-pen-square'></i></div> </td></tr>");
			}
			catch(err){}
		}
	});
	
	//unknown users pagination in reports section
	$(document).on("click", '#unknown-users .pagination li a', function(event){ 
		var pageNoWithRange = $(this).attr('id').split("-");
		var parentId = $(this).parents().eq(3).attr('id');
		$("#unknown-users .reports-table-body").html("");
		for(var j=pageNoWithRange[0];j<=pageNoWithRange[1];j++){
			try{
				$("#unknown-users .reports-table-body").append("<tr><td><img id='student-image' src='data:image/jpeg;base64," + unknownUsersArray[j].studentimg +"'></td><td>"+unknownUsersArray[j].govtid+"</td><td>"+unknownUsersArray[j].govtid+"</td><td>"+unknownUsersArray[j].govtid+"</td><td><div class='btn-delete' id='"+ unknownUsersArray[j].id +"'><i class='fas fa-trash-alt'></i></div></td></tr>");
			}
			catch(err){}
		}
	});
	
	
	$('#attendance #get-reports').click(function(e){
		var datefrom = $("#from").val().split("-").reverse().join("-");
		var dateto = $("#to").val().split("-").reverse().join("-");
		var qry = {
			fromDate: datefrom,
			toDate:dateto,
		}
		showAttendanceReports(qry);
	});
	
	$('#registered-users #get-reports').click(function(e){
		var datefrom = $("#from1").val().split("-").reverse().join("-");
		var dateto = $("#to1").val().split("-").reverse().join("-");
		var qry = {
			fromDate: datefrom,
			toDate:dateto,
		}
		showRegUsersReports(qry);
	});
	
	$('#unknown-users #get-reports').click(function(e){
		var datefrom = $("#from2").val().split("-").reverse().join("-");
		var dateto = $("#to2").val().split("-").reverse().join("-");
		var qry = {
			fromDate: datefrom,
			toDate:dateto,
		}
		showUnknownUsersReports(qry);
	});
	
});

function manualCapture(){
	startCamera(manualVideo);
	interval = setInterval(function(){
		base64Data = getBase64Data(manualVideo,anprCanvas);
		if(anprCanvas.height > 0 && anprCanvas.width > 0){
			$(manualImage).show();
			$("#manual-image>img.active").removeClass("active");
			if($("#manual-image>img").length >= 4){
				$("#manual-image>img:first").remove();
			}
			$(manualImage).append("<img class='active' src='"+anprCanvas.toDataURL('image/jpeg', 1.0)+"'/>");
		}
		$(".predictResultsTable").html(" ");
		manualCaptureSendData(base64Data);
		if(responseArray.length > 1){
			$.ajax({
				url : baseurl+"/php/insertAttendanceData.php",
				type: "post",
				data:{insertData : responseArray},
				success: function(resultdata){

				}
			});
			responseArray = [];
		}
		
		if(unknownArray.length > 1){
			$.ajax({
				url : baseurl+"/php/insertUnknownData.php",
				type: "post",
				data:{insertData : unknownArray},
				success: function(resultdata){
					
				}
			});
			unknownArray = [];
		}
		
	},8000);	
}

function manualCaptureSendData(base64Data){
	$.ajax({
		url : "https://facerecogapiforue-rested-turtle.cfapps.io/predict",
		type: "post",
		cache: false,
        async: true,
        crossDomain: true,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
		data:JSON.stringify({image:base64Data}),
		success: function(resObj){
			if(resObj != "Unknown"){
					$.ajax({
					url : baseurl+"/php/getAtsPredictResults.php",
					type: "post",
					data:{"predictname":resObj},
					success: function(resdata){
						if( resdata.emailid == "undefined" || resdata == "no results"){

						}
						else{
							$(".manual-table-box").animate({scrollTop:$(".manual-table-box").get(0).scrollHeight},2);
							var userName = resdata.firstname+" "+resdata.lastname;
							var userGovtid = resdata.govtid;
							var datetime = new Date();
							var attendanceDate = datetime.getFullYear() +  "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
							var attendanceTime = datetime.getHours() + ":" + datetime.getMinutes() +":" + datetime.getSeconds();
							var responseObject = {
								userimage: resdata.studentimg,
								usergovtid: userGovtid,
								attendancedate: attendanceDate,
								attendancetime: attendanceTime
							};
							responseArray.push(responseObject);
							$(".manual-table-body").append("<tr class='table-row'><td><img id='student-image' src='data:image/jpeg;base64," + resdata.studentimg +"'></td><td>"+userName+"</td><td>"+attendanceDate+"</td><td>"+attendanceTime+"</td><td>"+userGovtid+"</td></tr>");									
						}
					}
				});
			}
			else if(resObj == "Unknown"){
				var datetime = new Date();
				var attendanceDate = datetime.getFullYear() +  "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
				var attendanceTime = datetime.getHours() + ":" + datetime.getMinutes() +":" + datetime.getSeconds();
				var responseObject = {
					userimage: base64Data,
					username: "Unknown User",
					attendancedate: attendanceDate,
					attendancetime: attendanceTime,
					usergovtid: "NA"
				};
				unknownArray.push(responseObject);
				$(".manual-table-body").append("<tr class='table-row'><td><img id='student-image' src='data:image/jpeg;base64," + base64Data +"'></td><td>Unknown User</td><td>"+attendanceDate+"</td><td>"+attendanceTime+"</td><td>NA</td></tr>");
			}
		}
	});
}

function startCamera(video){
	try{
		if(video.srcObject){}else{
			if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
				navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream){
					video.srcObject = stream;
					video.play();
				});
			}
		}
	}catch (e) {  }
}

function getBase64Data(video,canvas){
	const ctx = canvas.getContext('2d'); 
	canvas.width = video.videoWidth; 
	canvas.height = video.videoHeight;
	ctx.drawImage(video, 0,0);
	var base_data = canvas.toDataURL('image/jpeg', 1.0).replace(/^data:image.+;base64,/, '');
	return base_data;
}

function stopCamera(video,canvas){
	try{
		if(video.srcObject){
			let mystream = video.srcObject;
			let tracks = mystream.getTracks();
			tracks.forEach(function(track){track.stop();});
			video.srcObject = null;
			if(canvas.height > 0 && canvas.width > 0){
				video.setAttribute('poster',canvas.toDataURL('image/jpeg', 1.0));
			}
			else{
				video.setAttribute('poster', baseurl+"/img/videoposter.jpg");
			}
			clearInterval(interval);
		}
	}
	catch (e) {  }
}

function sendData(){
	$('#loading').show();
	$.ajax({
		url : "/train",
		type: "post",
		headers: {'Content-Type': 'application/json'},
        crossDomain: true,
		data:JSON.stringify({"attendanceData":base64DataArray}),
		success: function(resObj){
			var trainedData = resObj.substring(resObj.lastIndexOf("[") + 1, resObj.lastIndexOf("]"));
			if(trainedData.includes(name) == true){
				lastName = $('#last-name').val();
				emailId = $('#email-id').val();
				phoneNumber = "+" + $("#mobile-no").intlTelInput("getSelectedCountryData").dialCode + " " + $('#mobile-no').val();
				designationType = $('#designation').val();
				govtId = $('#govt-id').val();
				var datetime = new Date();
				var userregTime = datetime.getHours() + ":" + datetime.getMinutes() +":" + datetime.getSeconds();
				var userregDate = datetime.getFullYear() +  "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
				$("#automatic-send-btn").attr('disabled',true);
				var insertDb = {
					id : randomId,
					student_image : base64DataArray[3].lData,
					firstname : firstName,
					lastname : lastName,
					emailid : emailId,
					phno : phoneNumber,
					designation : designationType,
					govtid : govtId,
					date : userregDate,
					time : userregTime
				};
				updateDatabase(insertDb);
				base64DataArray = [];
			}
			else{
				alert("training failed");
			}
			
		}
	});	
}

function updateDatabase(dataArray){
	$.ajax({
		url: "/registration",
		type: "post",
		headers: {'Content-Type': 'application/json'},
        crossDomain: true,
		data:JSON.stringify({insertData : dataArray}),
		success: function(data){
			if(data=="success"){
				$("#automatic-image").html("");
				$('#automatic-start-btn').html("Capture");
				$("#automatic-video").attr("poster", baseurl+"/img/videoposter.jpg");
				$('#first-name').css({"border":"1px solid #ced4da","background":"none"});
				$('#email-id').css({"border":"1px solid #ced4da","background":"none"});
				$('#mobile-no').css({"border":"1px solid #ced4da","background":"none"});
				$('#govt-id').css({"border":"1px solid #ced4da","background":"none"});
				$('#first-name').val("");
				$('#last-name').val("");
				$('#email-id').val("");
				$('#mobile-no').val("");
				$('#designation').val("");
				$('#govt-id').val("");
				registrationFormValidation = false;
				$('.registration-success-message').show();
				$('#loading').hide();
				window.setTimeout(function(){
					$(".registration-success-message").fadeTo(500, 0).slideUp(500, function(){
						$(this).remove(); 
					});
				},4000);
			}
		}
	});
}

function showAttendanceReports(qdata){
    $('#loading').show();
	$.ajax({
		url: baseurl+"/php/getAttendanceReports.php",
		type: "post",
		data:qdata,
		success: function(data){
			if(data != "no results"){
				attendanceReportsArray = [];
				attendanceReportsArray = data;
				attendanceSortFunction(attendanceReportsArray)
			}
			else{
				$("#attendance .reports-table-body").html("<h2 class='py-5 my-2 text-center'>No Results Found</h2>");
				$('#attendance .report-download-btn').attr('href','javascript:void(0)');
				$("#attendance .pagination ").hide();
			}
			$('#loading').hide();
		}
	});
}

function showRegUsersReports(qdata){
    $('#loading').show();
	$.ajax({
		url: baseurl+"/php/getAtsReports.php",
		type: "post",
		data:qdata,
		success: function(data){
			if(data != "no results"){
				registeredUsersArray = [];
				registeredUsersArray = data;
				regusersSortFunction(registeredUsersArray);
			}
			else{
				$("#registered-users .reports-table-body").html("<h2 class='py-5 my-2 text-center'>No Results Found</h2>");
				$('#registered-users .report-download-btn').attr('href','javascript:void(0)');
			}
			$('#loading').hide();
		}
	});
}

function showUnknownUsersReports(qdata){
    $('#loading').show();
	$.ajax({
		url: baseurl+"/php/getUnknownUserReports.php",
		type: "post",
		data:qdata,
		success: function(data){
			if(data != "no results"){
				unknownUsersArray = [];
				unknownUsersArray = data;
				unknownUsersSortFunction(unknownUsersArray);
			}
			else{
				$("#unknown-users .reports-table-body").html("<h2 class='py-5 my-2 text-center'>No Results Found</h2>");
				$('#unknown-users .report-download-btn').attr('href','javascript:void(0)');
			}
			$('#loading').hide();
		}
	});
}

function attendanceSortFunction(attendanceReportsArray){
	$("#attendance .pagination ").show();
	$('#attendance .pagination').html("");	
	var lastTen;
	var start;
	var end;
	var pageNo=0;
	if(attendanceReportsArray.length > 10){
		for(var j=1;j<=attendanceReportsArray.length;j++){
			if(j % 10 == 0){
				lastTen = j;
				pageNo++;
				start = j-10;
				end = j-1;
				$("#attendance .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
			 }
		}
		if(lastTen < attendanceReportsArray.length){
			  start = lastTen;
			  end = attendanceReportsArray.length-1;
			  pageNo++;
			  $("#attendance .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
		}
	}
	else{
		start = 0;
		end = attendanceReportsArray.length-1;
		pageNo++;
		$("#attendance .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
	}
	var resEnd = (attendanceReportsArray.length > 10) ? 9 : attendanceReportsArray.length-1;
	$(".reports-table-body").html("");
	for(var j=0;j <= resEnd;j++){
		$("#attendance .reports-table-body").append("<tr><td><img id='student-image' src='data:image/jpeg;base64," + attendanceReportsArray[j].studentimage +"'></td><td>"+attendanceReportsArray[j].name+"</td><td class='edit-box' id='attendance-govtid'>"+attendanceReportsArray[j].govtid+"</td><td class='edit-box' id='attendance-date'>"+attendanceReportsArray[j].date+"</td><td class='edit-box' id='attendance-time'>"+attendanceReportsArray[j].time+"</td><td><div class='btn-delete' id='"+ attendanceReportsArray[j].id +"'><i class='fas fa-trash-alt'></i></div><div class='btn-edit' id='"+ attendanceReportsArray[j].id +"'> <i class='fas fa-pen-square'></i></div> </td></tr>");
	}
	$('#attendance .report-download-btn').attr('href',baseurl+'/php/downloadAtsData.php');
}

function regusersSortFunction(registeredUsersArray){
	$("#registered-users .pagination ").show();
	$('#registered-users .pagination').html("");
	var lastTen;
	var start;
	var end;
	var pageNo=0;
	if(registeredUsersArray.length > 10){
		for(var j=1;j<=registeredUsersArray.length;j++){
			if(j % 10 == 0){
				lastTen = j;
				pageNo++;
				start = j-10;
				end = j-1;
				$("#registered-users .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
			 }
		}
		if(lastTen < registeredUsersArray.length){
			  start = lastTen;
			  end = registeredUsersArray.length-1;
			  pageNo++;
			  $("#registered-users .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
		}
	}
	else{
		start = 0;
		end = registeredUsersArray.length-1;
		pageNo++;
		$("#registered-users .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
	}
	var resEnd = (registeredUsersArray.length > 10) ? 9 : registeredUsersArray.length-1;
	$("#registered-users .reports-table-body").html("");
	for(var j=0;j <= resEnd;j++){
		$("#registered-users .reports-table-body").append("<tr><td><img id='student-image' src='data:image/jpeg;base64," + registeredUsersArray[j].studentimg +"'></td><td>"+registeredUsersArray[j].firstname+" "+registeredUsersArray[j].lastname+"</td><td class='edit-box' id='register-email'>"+registeredUsersArray[j].emailid+"</td><td class='edit-box' id='register-phno'>"+registeredUsersArray[j].phno+"</td><td class='edit-box' id='register-designation'>"+registeredUsersArray[j].designation+"</td><td class='edit-box' id='register-govtid'>"+registeredUsersArray[j].govtid+"</td><td class="+registeredUsersArray[j].firstname+"><div class='btn-delete' id='"+ registeredUsersArray[j].id +"'><i class='fas fa-trash-alt'></i></div><div class='btn-edit' id='"+ registeredUsersArray[j].id +"'> <i class='fas fa-pen-square'></i></div> </td></tr>");
	}
	$('#registered-users .report-download-btn').attr('href',baseurl+'/php/downloadAtsData.php');
}

function unknownUsersSortFunction(unknownUsersArray){
	$("#unknown-users .pagination ").show();
	$('#unknown-users .pagination').html("");
	var lastTen;
	var start;
	var end;
	var pageNo=0;
	if(unknownUsersArray.length > 10){
		for(var j=1;j<=unknownUsersArray.length;j++){
			if(j % 10 == 0){
				lastTen = j;
				pageNo++;
				start = j-10;
				end = j-1;
				$("#unknown-users .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
			 }
		}
		if(lastTen < unknownUsersArray.length){
			  start = lastTen;
			  end = unknownUsersArray.length-1;
			  pageNo++;
			  $("#unknown-users .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
		}
	}
	else{
		start = 0;
		end = unknownUsersArray.length-1;
		pageNo++;
		$("#unknown-users .pagination").append("<li class='page-item'><a class='page-link' href='javascript:void(0)' id='" + start + "-" + end + "'>" + pageNo +"</a></li>");
	}
	var resEnd = (unknownUsersArray.length > 10) ? 9 : unknownUsersArray.length-1;
	$("#unknown-users .reports-table-body").html("");
	for(var j=0;j <= resEnd;j++){
		$("#unknown-users .reports-table-body").append("<tr><td><img id='student-image' src='data:image/jpeg;base64," + unknownUsersArray[j].studentimg +"'></td><td>"+unknownUsersArray[j].govtid+"</td><td>"+unknownUsersArray[j].date+"</td><td>"+unknownUsersArray[j].time+"</td><td><div class='btn-delete' id='"+ unknownUsersArray[j].id +"'><i class='fas fa-trash-alt'></i></div></td></tr>");
	}
	$('#unknown-users .report-download-btn').attr('href',baseurl+'/php/downloadAtsData.php');
}

$(function(){
    var dateFormat = "dd-mm-yy",
    from = $("#from")
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1,
		  maxDate:0,
		  dateFormat:"dd-mm-yy"
        })
		.datepicker("setDate",new Date())
        .on("change", function(){
          to.datepicker("option", "minDate", getDate(this));
        }),
    to = $("#to").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
		maxDate: 0,
		dateFormat:"dd-mm-yy",
		
      })
	  .datepicker("setDate",new Date())
      .on("change", function(){
        from.datepicker("option", "maxDate", getDate(this));
      });
 
    function getDate(element){
      var date;
      try{date = $.datepicker.parseDate(dateFormat, element.value);}catch(error){date = null;}
      return date;
    }
	
});

$(function(){
    var dateFormat = "dd-mm-yy",
    from = $("#from1")
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1,
		  maxDate:0,
		  dateFormat:"dd-mm-yy"
        })
		.datepicker("setDate",new Date())
        .on("change", function(){
          to.datepicker("option", "minDate", getDate(this));
        }),
    to = $("#to1").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
		maxDate: 0,
		dateFormat:"dd-mm-yy",
		
      })
	  .datepicker("setDate",new Date())
      .on("change", function(){
        from.datepicker("option", "maxDate", getDate(this));
      });
 
    function getDate(element){
      var date;
      try{date = $.datepicker.parseDate(dateFormat, element.value);}catch(error){date = null;}
      return date;
    }
	
});

$(function(){
    var dateFormat = "dd-mm-yy",
    from = $("#from2")
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1,
		  maxDate:0,
		  dateFormat:"dd-mm-yy"
        })
		.datepicker("setDate",new Date())
        .on("change", function(){
          to.datepicker("option", "minDate", getDate(this));
        }),
    to = $("#to2").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
		maxDate: 0,
		dateFormat:"dd-mm-yy",
		
      })
	  .datepicker("setDate",new Date())
      .on("change", function(){
        from.datepicker("option", "maxDate", getDate(this));
      });
 
    function getDate(element){
      var date;
      try{date = $.datepicker.parseDate(dateFormat, element.value);}catch(error){date = null;}
      return date;
    }
	
});
