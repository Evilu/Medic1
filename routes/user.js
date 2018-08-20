
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      let post  = req.body;
       let name= post.user_name;
       let pass= post.password;
       let fname= post.first_name;
       let lname= post.last_name;
       let mob= post.mob_no;

      const sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

      const query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
    let message = '';
    let sess = req.session;

   if(req.method == "POST"){
       let post  = req.body;
       let name= post.user_name;
       let pass= post.password;

       let sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){


    let user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

    let sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});
   });

};

//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

    let userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

    let sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result})
   });
};
//---------------------------------edit users details after login----------------------------------
// exports.editprofile=function(req,res){
//     let userId = req.session.userId;
//    if(userId == null){
//       res.redirect("/login");
//       return;
//    }
//
//     let sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
//    db.query(sql, function(err, results){
//       res.render('edit_profile.ejs',{data:results});
//    });
// };

exports.xray = function(req, res){
    message = '';
    if(req.method == "POST") {
        let post = req.body;
        let name = post.photo_name;
        let mob = post.mob_no;
        let status = post.Status;


        const sql = "INSERT INTO `users`(`photo_name`,`mob_no`,`Status`) VALUES ('" + name + "','" + mob + "','" + status + "')";

        db.query('SELECT * FROM scans', function (err, result) {

            if (err) {
                throw err;
            } else {
                message = "Succes! Your status has been changed.";
                obj = {print: result};
                msg = {message: message}
                res.render('xray.ejs', obj, msg);
            }
        });
    }

};