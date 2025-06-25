const mysql = require('mysql2');

// יצירת חיבור לבסיס הנתונים
const db_pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'personal_tasks_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// פונקציה ליצירת הטבלאות הנדרשות
async function createTables() {
    const promisePool = db_pool.promise();
    
    try {
        // טבלת משתמשים
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                uname VARCHAR(50) UNIQUE NOT NULL,
                passwd VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                type_id INT DEFAULT 1,
                tz VARCHAR(50) DEFAULT 'Asia/Jerusalem',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // טבלת קטגוריות
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                color VARCHAR(7) DEFAULT '#007bff',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // טבלת משימות
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                category_id INT,
                description VARCHAR(200) NOT NULL,
                due_date DATE,
                is_completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);

        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

// פונקציה להוספת משתמש ראשון למערכת
async function createDefaultUser() {
    const promisePool = db_pool.promise();
    
    try {
        const md5 = require('md5');
        const defaultPassword = md5("Aadmin123");
        console.log("Creating default user with password hash:", defaultPassword); // Debug
        
        await promisePool.query(`
            INSERT IGNORE INTO users (name, uname, passwd, email, type_id) 
            VALUES (?, ?, ?, ?, ?)
        `, ['מנהל המערכת', 'admin', defaultPassword, 'admin@example.com', 1]);
        
        // בדיקה שהמשתמש נוצר
        const [rows] = await promisePool.query("SELECT * FROM users WHERE uname = ?", ['admin']);
        console.log("Default user check - found rows:", rows.length); // Debug
        if (rows.length > 0) {
            console.log("Default user exists with ID:", rows[0].id); // Debug
        }
        
        console.log('Default user created (username: admin, password: admin123)');
    } catch (error) {
        console.error('Error creating default user:', error);
    }
}

module.exports = {
    db_pool,
    createTables,
    createDefaultUser
}; 