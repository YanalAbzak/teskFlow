const express = require('express');
const router = express.Router();
module.exports = router;

const user_Mid = require("../middleware/user_Mid");

// הצגת טופס הוספת משתמש חדש
router.get("/Add", (req, res) => {
    res.render("user_add", {
        data: {},
    });
});

// עיבוד הוספת משתמש חדש
router.post("/Add", [user_Mid.AddUser], (req, res) => {
    res.redirect("/U/List");
});

// הצגת טופס עריכת משתמש קיים
router.get("/Edit/:id", [user_Mid.GetOneUser], (req, res) => {
    if (req.GoodOne) {
        res.render("user_add", {
            data: req.one_user_data,
        });
    } else {
        res.redirect("/Crs/List");
    }
});

// עיבוד עדכון פרטי משתמש
router.post("/Edit/:id", [user_Mid.UpdateUser], (req, res) => {
    res.redirect("/U/List");
});

// הצגת רשימת כל המשתמשים עם דפדוף
router.get("/List", [user_Mid.GetAllUsers], (req, res) => {
    res.render("user_list", {
        page_title: "רשימת משתמשים",
        users: req.users_data,
        page: req.page,
        total_pages: req.total_pages,
    });
});

// מחיקת משתמש מהמערכת
router.post("/Delete", [user_Mid.DeleteUser], (req, res) => {
    res.redirect("/U/List");
})