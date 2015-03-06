function login(){


            var username = $('#username').val();
            var password = $('#password').val();

            var combinationJSON = {"username" : username, "password" : password};
            var stringCombination = JSON.stringify(combinationJSON);

            $.ajax({
                  type : 'POST',
                  data : {'combination' : stringCombination},
                  url : 'http://student.cs.hioa.no/~s188081/Server-backend/CheckUser.php',
                  success : function(data){
                        console.log(data);
                        if(data == "true"){
                        	alert("true");
                              toOverview1();
                        }else{
                              alert("Wrong email/password combination");
                        }
                  }
               });

      return false;

}
