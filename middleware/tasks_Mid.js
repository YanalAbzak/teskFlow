const { db_pool } = require('../config/database');

// פונקציה להוספת backslashes למניעת SQL injection
function addSlashes(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/"/g, '\\"')
              .replace(/\0/g, '\\0');
}

// הוספת משימה חדשה
async function AddTask(req, res, next) {
    let userId = parseInt(req.user_id);
    let description = (req.body.description !== undefined) ? addSlashes(req.body.description) : "";
    let dueDate = (req.body.due_date !== undefined) ? req.body.due_date : null;
    let categoryId = (req.body.category_id !== undefined) ? parseInt(req.body.category_id) : null;
    
    if (description.length > 200) {
        req.taskError = "תיאור המשימה לא יכול להיות יותר מ-200 תווים";
        return next();
    }

    let query = "INSERT INTO tasks (user_id, category_id, description, due_date) VALUES (?, ?, ?, ?)";
    const promisePool = db_pool.promise();
    
    try {
        await promisePool.query(query, [userId, categoryId, description, dueDate]);
        req.taskSuccess = "המשימה נוספה בהצלחה";
    } catch (err) {
        console.log(err);
        req.taskError = "שגיאה בהוספת המשימה";
    }

    next();
}

// קבלת כל המשימות של המשתמש עם דפדוף וסינון
async function GetAllTasks(req, res, next) {
    let userId = parseInt(req.user_id);
    let currentPage = 0;
    let rowsPerPage = 10;
    let filter = req.query.filter || 'all'; // all, completed, pending
    let categoryId = req.query.category || null;
    
    if (req.query.p !== undefined) {
        currentPage = parseInt(req.query.p);
    }
    req.page = currentPage;

    let whereConditions = ['t.user_id = ?'];
    let params = [userId];

    // סינון לפי סטטוס
    if (filter === 'completed') {
        whereConditions.push('t.is_completed = 1');
    } else if (filter === 'pending') {
        whereConditions.push('t.is_completed = 0');
    }

    // סינון לפי קטגוריה
    if (categoryId && categoryId !== 'all') {
        whereConditions.push('t.category_id = ?');
        params.push(categoryId);
    }

    let whereClause = whereConditions.join(' AND ');

    // ספירת מספר המשימות
    let countQuery = `SELECT COUNT(*) AS cnt FROM tasks t WHERE ${whereClause}`;
    const promisePool = db_pool.promise();
    let totalRows = 0;
    
    try {
        const [countRows] = await promisePool.query(countQuery, params);
        totalRows = countRows[0].cnt;
    } catch (err) {
        console.log(err);
    }
    
    req.total_pages = Math.ceil(totalRows / rowsPerPage);
    
    // קבלת המשימות
    let query = `
        SELECT t.*, c.name as category_name, c.color as category_color 
        FROM tasks t 
        LEFT JOIN categories c ON t.category_id = c.id 
        WHERE ${whereClause}
        ORDER BY t.created_at DESC 
        LIMIT ?, ?
    `;
    
    params.push(currentPage * rowsPerPage, rowsPerPage);
    req.tasks_data = [];
    
    try {
        const [rows] = await promisePool.query(query, params);
        req.tasks_data = rows;
    } catch (err) {
        console.log(err);
    }

    // קבלת כל הקטגוריות של המשתמש לסינון
    try {
        const [categories] = await promisePool.query(
            'SELECT * FROM categories WHERE user_id = ? ORDER BY name',
            [userId]
        );
        req.categories = categories;
    } catch (err) {
        console.log(err);
        req.categories = [];
    }

    req.filter = filter;
    req.selectedCategory = categoryId;
    next();
}

// קבלת משימה אחת לפי מזהה
async function GetOneTask(req, res, next) {
    let taskId = parseInt(req.params.id);
    let userId = parseInt(req.user_id);
    
    if (taskId <= 0) {
        req.GoodOne = false;
        return next();
    }
    
    let query = `
        SELECT t.*, c.name as category_name 
        FROM tasks t 
        LEFT JOIN categories c ON t.category_id = c.id 
        WHERE t.id = ? AND t.user_id = ?
    `;
    
    const promisePool = db_pool.promise();
    req.one_task_data = [];
    
    try {
        const [rows] = await promisePool.query(query, [taskId, userId]);
        if (rows.length > 0) {
            req.one_task_data = rows[0];
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

// עדכון משימה
async function UpdateTask(req, res, next) {
    let taskId = parseInt(req.params.id);
    let userId = parseInt(req.user_id);
    let description = (req.body.description !== undefined) ? addSlashes(req.body.description) : "";
    let dueDate = (req.body.due_date !== undefined) ? req.body.due_date : null;
    let categoryId = (req.body.category_id !== undefined) ? parseInt(req.body.category_id) : null;
    
    if (description.length > 200) {
        req.taskError = "תיאור המשימה לא יכול להיות יותר מ-200 תווים";
        return next();
    }

    let query = `
        UPDATE tasks 
        SET description = ?, due_date = ?, category_id = ? 
        WHERE id = ? AND user_id = ?
    `;
    
    const promisePool = db_pool.promise();
    
    try {
        await promisePool.query(query, [description, dueDate, categoryId, taskId, userId]);
        req.taskSuccess = "המשימה עודכנה בהצלחה";
    } catch (err) {
        console.log(err);
        req.taskError = "שגיאה בעדכון המשימה";
    }

    next();
}

// סימון משימה כבוצעת
async function ToggleTaskCompletion(req, res, next) {
    let taskId = parseInt(req.body.task_id);
    let userId = parseInt(req.user_id);
    let isCompleted = req.body.is_completed === 'true';
    
    let query = `
        UPDATE tasks 
        SET is_completed = ? 
        WHERE id = ? AND user_id = ?
    `;
    
    const promisePool = db_pool.promise();
    
    try {
        await promisePool.query(query, [isCompleted, taskId, userId]);
        req.taskSuccess = isCompleted ? "המשימה סומנה כבוצעת" : "המשימה סומנה כלא בוצעת";
    } catch (err) {
        console.log(err);
        req.taskError = "שגיאה בעדכון סטטוס המשימה";
    }

    next();
}

// מחיקת משימה
async function DeleteTask(req, res, next) {
    let taskId = parseInt(req.body.task_id);
    let userId = parseInt(req.user_id);
    
    let query = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
    const promisePool = db_pool.promise();
    
    try {
        await promisePool.query(query, [taskId, userId]);
        req.taskSuccess = "המשימה נמחקה בהצלחה";
    } catch (err) {
        console.log(err);
        req.taskError = "שגיאה במחיקת המשימה";
    }

    next();
}

module.exports = {
    AddTask,
    GetAllTasks,
    GetOneTask,
    UpdateTask,
    ToggleTaskCompletion,
    DeleteTask
}; 