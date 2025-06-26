const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

// ייבוא קונפיגורציית בסיס הנתונים
const { createTables, createDefaultUser } = require('./config/database');

// ייבוא הראוטרים
const authRouter = require('./Routers/auth_R');
const usersRouter = require('./Routers/users_R');
const tasksRouter = require('./Routers/tasks_R');
const categoriesRouter = require('./Routers/categories_R');

const app = express();
const PORT = process.env.PORT || 3000;

// הגדרת EJS כמנוע תבניות
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// הגדרת session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// הגדרת הראוטרים
app.use('/', authRouter);
app.use('/U', usersRouter);
app.use('/Tasks', tasksRouter);
app.use('/Categories', categoriesRouter);


// דף הבית - הפניה לרשימת המשימות
app.get('/', (req, res) => {
    res.redirect('/Tasks/List');
});

// דף 404
app.use((req, res) => {
    res.status(404).render('404', {
        page_title: 'דף לא נמצא'
    });
});

// טיפול בשגיאות
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        page_title: 'שגיאה',
        error: 'משהו השתבש!'
    });
});

// יצירת הטבלאות והמשתמש הראשי בעת הפעלת השרת
async function initializeDatabase() {
    try {
        await createTables();
        await createDefaultUser();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// הפעלת השרת
app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    //await initializeDatabase();
    console.log('Personal Tasks App is ready!');
    console.log('Default user: admin / admin123');
});

