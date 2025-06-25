const express = require('express');
const router = express.Router();
module.exports = router;

const user_Mid = require("../middleware/user_Mid");
const tasks_Mid = require("../middleware/tasks_Mid");
const categories_Mid = require("../middleware/categories_Mid");

// הצגת רשימת המשימות עם סינון ודפדוף
router.get("/List", [user_Mid.isLogged, tasks_Mid.GetAllTasks], (req, res) => {
    res.render("tasks_list", {
        page_title: "רשימת המשימות שלי",
        tasks: req.tasks_data,
        categories: req.categories,
        page: req.page,
        total_pages: req.total_pages,
        filter: req.filter,
        selectedCategory: req.selectedCategory,
        taskSuccess: req.taskSuccess,
        taskError: req.taskError
    });
});

// הצגת טופס הוספת משימה חדשה
router.get("/Add", [user_Mid.isLogged, categories_Mid.GetCategoriesForSelect], (req, res) => {
    res.render("task_add", {
        page_title: "הוספת משימה חדשה",
        categories: req.categories_for_select,
        data: {},
        taskSuccess: req.taskSuccess,
        taskError: req.taskError
    });
});

// עיבוד הוספת משימה חדשה
router.post("/Add", [user_Mid.isLogged, tasks_Mid.AddTask, categories_Mid.GetCategoriesForSelect], (req, res) => {
    res.render("task_add", {
        page_title: "הוספת משימה חדשה",
        categories: req.categories_for_select,
        data: req.body,
        taskSuccess: req.taskSuccess,
        taskError: req.taskError
    });
});

// הצגת טופס עריכת משימה
router.get("/Edit/:id", [user_Mid.isLogged, tasks_Mid.GetOneTask, categories_Mid.GetCategoriesForSelect], (req, res) => {
    if (req.GoodOne) {
        res.render("task_add", {
            page_title: "עריכת משימה",
            categories: req.categories_for_select,
            data: req.one_task_data,
            taskSuccess: req.taskSuccess,
            taskError: req.taskError
        });
    } else {
        res.redirect("/Tasks/List");
    }
});

// עיבוד עדכון משימה
router.post("/Edit/:id", [user_Mid.isLogged, tasks_Mid.UpdateTask, categories_Mid.GetCategoriesForSelect], (req, res) => {
    res.render("task_add", {
        page_title: "עריכת משימה",
        categories: req.categories_for_select,
        data: req.body,
        taskSuccess: req.taskSuccess,
        taskError: req.taskError
    });
});

// סימון משימה כבוצעת/לא בוצעת
router.post("/ToggleCompletion", [user_Mid.isLogged, tasks_Mid.ToggleTaskCompletion], (req, res) => {
    res.redirect("/Tasks/List");
});

// מחיקת משימה
router.post("/Delete", [user_Mid.isLogged, tasks_Mid.DeleteTask], (req, res) => {
    res.redirect("/Tasks/List");
}); 