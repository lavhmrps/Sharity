$(document).ready(function(){
$('button[name=reg_user_complete]').click(function(){
	$.ajax({
		url:"http://localhost/SharityCRM/phpBackend/test.php",
		success : function(){
			alert("Jadda");
		},
		error : function(){
			alert("error");
		}
	});
});
});