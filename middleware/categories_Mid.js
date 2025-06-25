const { db_pool } = require('../config/database');

// פונקציה להוספת backslashes למניעת SQL injection
function addSlashes(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/"/g, '\\"')
              .replace(/\0/g, '\\0');
}

// הוספת קטגוריה חדשה
async function AddCategory(req, res, next) {
    let userId = parseInt(req.user_id);
    let name = (req.body.name !== undefined) ? req.body.name : "";
    let color = (req.body.color !== undefined) ? req.body.color : "#007bff";
    
    if (name.trim() === "") {
        req.categoryError = "שם הקטגוריה הוא שדה חובה";
        return next();
    }

    let query = "INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)";
    const promisePool = db_pool.promise();
    
    try {
        await promisePool.query(query, [userId, name, color]);
        req.categorySuccess = "הקטגוריה נוספה בהצלחה";
    } catch (err) {
        console.log(err);
        req.categoryError = "שגיאה בהוספת הקטגוריה";
    }

    next();
}

// קבלת כל הקטגוריות של המשתמש
async function GetAllCategories(req, res, next) {
    let userId = parseInt(req.user_id);
    
    let query = "SELECT * FROM categories WHERE user_id = ? ORDER BY name";
    const promisePool = db_pool.promise();
    req.categories_data = [];
    
    try {
        const [rows] = await promisePool.query(query, [userId]);
        req.categories_data = rows;
    } catch (err) {
        console.log(err);
    }

    next();
}

// קבלת קטגוריה אחת לפי מזהה
async function GetOneCategory(req, res, next) {
    let categoryId = parseInt(req.params.id);
    let userId = parseInt(req.user_id);
    
    if (categoryId <= 0) {
        req.GoodOne = false;
        return next();
    }
    
    let query = "SELECT * FROM categories WHERE id = ? AND user_id = ?";
    const promisePool = db_pool.promise();
    req.one_category_data = [];
    
    try {
        const [rows] = await promisePool.query(query, [categoryId, userId]);
        if (rows.length > 0) {
            req.one_category_data = rows[0];
            req.GoodOne = true;
        } else {
            req.GoodOne = false;
        }
    } catch (err) {
        console.log(err);
        req.GoodOne = false;
    }

    next();
}

// עדכון קטגוריה
async function UpdateCategory(req, res, next) {
    let categoryId = parseInt(req.params.id);
    let userId = parseInt(req.user_id);
    let name = (req.body.name !== undefined) ? req.body.name : "";
    let color = (req.body.color !== undefined) ? req.body.color : "#007bff";
    
    if (name.trim() === "") {
        req.categoryError = "שם הקטגוריה הוא שדה חובה";
        return next();
    }

    let query = "UPDATE categories SET name = ?, color = ? WHERE id = ? AND user_id = ?";
    const promisePool = db_pool.promise();
    
    try {
        await promisePool.query(query, [name, color, categoryId, userId]);
        req.categorySuccess = "הקטגוריה עודכנה בהצלחה";
    } catch (err) {
        console.log(err);
        req.categoryError = "שגיאה בעדכון הקטגוריה";
    }

    next();
}

// מחיקת קטגוריה
async function DeleteCategory(req, res, next) {
    let categoryId = parseInt(req.body.category_id);
    let userId = parseInt(req.user_id);
    
    // בדיקה אם יש משימות שמשתמשות בקטגוריה זו
    let checkQuery = "SELECT COUNT(*) as count FROM tasks WHERE category_id = ? AND user_id = ?";
    const promisePool = db_pool.promise();
    
    try {
        const [checkRows] = await promisePool.query(checkQuery, [categoryId, userId]);
        if (checkRows[0].count > 0) {
            req.categoryError = "לא ניתן למחוק קטגוריה שיש לה משימות. אנא העבר את המשימות לקטגוריה אחרת תחילה.";
            return next();
        }
        
        // מחיקת הקטגוריה
        let deleteQuery = "DELETE FROM categories WHERE id = ? AND user_id = ?";
        await promisePool.query(deleteQuery, [categoryId, userId]);
        req.categorySuccess = "הקטגוריה נמחקה בהצלחה";
    } catch (err) {
        console.log(err);
        req.categoryError = "שגיאה במחיקת הקטגוריה";
    }

    next();
}

// קבלת קטגוריות לסלקט (למשימות)
async function GetCategoriesForSelect(req, res, next) {
    let userId = parseInt(req.user_id);
    
    let query = "SELECT id, name, color FROM categories WHERE user_id = ? ORDER BY name";
    const promisePool = db_pool.promise();
    
    try {
        const [rows] = await promisePool.query(query, [userId]);
        req.categories_for_select = rows;
    } catch (err) {
        console.log(err);
        req.categories_for_select = [];
    }

    next();
}

module.exports = {
    AddCategory,
    GetAllCategories,
    GetOneCategory,
    UpdateCategory,
    DeleteCategory,
    GetCategoriesForSelect
}; 