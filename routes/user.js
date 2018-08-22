exports.signup = function (req, res) {
    message = '';
    if (req.method == "POST") {
        let post = req.body;
        let name = post.user_name;
        let pass = post.password;
        let fname = post.first_name;
        let lname = post.last_name;
        let mob = post.mob_no;
        let sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) " +
            "VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";
        let query = db.query(sql, function (err, result) {

            message = "Your account has been created.";
            res.render('signup.ejs', {message: message});
        });

    } else {
        res.render('signup');
    }
};

exports.login = function (req, res) {
    let message = '';
    let sess = req.session;

    if (req.method == "POST") {
        let post = req.body;
        let name = post.user_name;
        let pass = post.password;

        let sql = "SELECT id, first_name, last_name, user_name FROM `users` " +
            "WHERE `user_name`='" + name + "' and password = '" + pass + "'";
        db.query(sql, function (err, results) {
            if (results.length) {
                req.session.userId = results[0].id;
                req.session.user = results[0];
                res.redirect('/home/dashboard');
            }
            else {
                message = 'Username or password is/are invalid.';
                res.render('index.ejs', {message: message});
            }

        });
    } else {
        res.render('index.ejs', {message: message});
    }

};


exports.dashboard = function (req, res, next) {

    let user = req.session.user,
        userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    let sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";

    db.query(sql, function (err, results,) {
        if (err) {
            throw err;
        } else {
            res.render('dashboard.ejs', {data: results});
        }
    });

};


exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/login");
    })
};


exports.profile = function (req, res) {
    let userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    let sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function (err, result) {
        res.render('profile.ejs', {data: result})
    });
};


exports.xray = function (req, res) {
    if (req.query.id && req.query.status) {
        db.query("UPDATE `scans` SET `status` = '" + req.query.status + "' WHERE `id` = '" + req.query.id + "' ;")

    }
    db.query('SELECT * FROM scans', function (err, result) {
        if (err) {
            throw err;
        } else {
            res.render('xray.ejs', {result});
        }
    });
};