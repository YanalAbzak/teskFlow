const express = require('express');
const router = express.Router();
module.exports = router;

const user_Mid = require("../middleware/user_Mid");
const categories_Mid = require("../middleware/categories_Mid");

// הצגת רשימת הקטגוריות
router.get("/List", [user_Mid.isLogged, categories_Mid.GetAllCategories], (req, res) => {
    res.render("categories_list", {
        page_title: "ניהול קטגוריות",
        categories: req.categories_data,
        categorySuccess: req.categorySuccess,
        categoryError: req.categoryError
    });
});

// הצגת טופס הוספת קטגוריה חדשה
router.get("/Add", [user_Mid.isLogged], (req, res) => {
    res.render("category_add", {
        page_title: "הוספת קטגוריה חדשה",
        data: {},
        categorySuccess: req.categorySuccess,
        categoryError: req.categoryError
    });
});

// עיבוד הוספת קטגוריה חדשה
router.post("/Add", [user_Mid.isLogged, categories_Mid.AddCategory], (req, res) => {
    res.render("category_add", {
        page_title: "הוספת קטגוריה חדשה",
        data: req.body,
        categorySuccess: req.categorySuccess,
        categoryError: req.categoryError
    });
});

// הצגת טופס עריכת קטגוריה
router.get("/Edit/:id", [user_Mid.isLogged, categories_Mid.GetOneCategory], (req, res) => {
    if (req.GoodOne) {
        res.render("category_add", {
            page_title: "עריכת קטגוריה",
            data: req.one_category_data,
            categorySuccess: req.categorySuccess,
            categoryError: req.categoryError
        });
    } else {
        res.redirect("/Categories/List");
    }
});

// עיבוד עדכון קטגוריה
router.post("/Edit/:id", [user_Mid.isLogged, categories_Mid.UpdateCategory], (req, res) => {
    res.render("category_add", {
        page_title: "עריכת קטגוריה",
        data: req.body,
        categorySuccess: req.categorySuccess,
        categoryError: req.categoryError
    });
});

// מחיקת קטגוריה
router.post("/Delete", [user_Mid.isLogged, categories_Mid.DeleteCategory], (req, res) => {
    res.redirect("/Categories/List");
}); 