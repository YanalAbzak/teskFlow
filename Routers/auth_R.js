const express = require('express');
const router = express.Router();
module.exports = router;

const user_Mid = require("../middleware/user_Mid");

// דף התחברות
router.get("/login", (req, res) => {
    res.render("login", {});
});

// עיבוד התחברות
router.post("/login", [user_Mid.CheckLogin], (req, res) => {
    if(req.validUser)
        res.redirect("/Tasks/List");
    else
        res.render('login', { error: 'שם משתמש או סיסמה שגויים' });
});

// דף הרשמה
router.get("/register", (req, res) => {
    res.render("register", {});
});

// עיבוד הרשמה
router.post("/register", [user_Mid.AddUser], (req, res) => {
    if(req.GoodOne === true) {
        res.render('register', { 
            success: 'ההרשמה הושלמה בהצלחה! כעת תוכל להתחבר למערכת.',
            data: {}
        });
    } else {
        res.render('register', { 
            error: 'שגיאה בהרשמה. ייתכן שם המשתמש כבר קיים או שהסיסמה קצרה מדי (מינימום 6 תווים).',
            data: req.body
        });
    }
});
