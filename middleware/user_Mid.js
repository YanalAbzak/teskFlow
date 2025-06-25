var md5 = require('md5');

// בדיקה אם המשתמש מחובר באמצעות JWT token
async function isLogged(req, res, next) {
    const jwtToken = req.cookies.ImLoggedToYoman;
    let userId = -1;
    if (jwtToken !== "") {
        jwt.verify(jwtToken, 'myPrivateKey', async (err, decodedToken) => {
            if (err) {
                console.log("err=", err);
            } else {
                let data = decodedToken.data;
                userId = data.split(",")[0];
                req.user_id = userId;
            }
        })
    }
    if (userId < 0)
        res.redirect("/login");

    next();
}

// בדיקת התחברות משתמש עם שם משתמש וסיסמה
async function CheckLogin(req, res, next) {
    let username = (req.body.uname !== undefined) ? addSlashes(req.body.uname) : "";
    let password = (req.body.passwd !== undefined) ? req.body.passwd : "";
    let encryptedPassword = md5("A" + password);
    let query = `SELECT * FROM users WHERE uname = '${username}' AND passwd = '${encryptedPassword}'`;

    const promisePool = db_pool.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(query);
    } catch (err) {
        console.log(err);
    }

    if (rows.length > 0) {
        req.validUser = true;
        let userData = `${rows[0].id},${rows[0].name}`;
        var token = jwt.sign(
            { data: userData },
            'myPrivateKey',
            {
                expiresIn: 31 * 24 * 60 * 60 // 31 ימים בשניות
            });
        res.cookie("ImLoggedToYoman", token, {
            maxAge: 31 * 24 * 60 * 60 * 1000, // 31 ימים במילישניות
        });
    }

    next();
}

// הוספת משתמש חדש למערכת
async function AddUser(req, res, next) {
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name) : "";
    let username = (req.body.uname !== undefined) ? addSlashes(req.body.uname) : "";
    let password = (req.body.passwd !== undefined) ? req.body.passwd : "";
    let encryptedPassword = md5("A" + password);
    let email = (req.body.email !== undefined) ? addSlashes(req.body.email) : "";
    let typeId = (req.body.type_id !== undefined) ? Number(req.body.type_id) : -1;
    let timezone = (req.body.tz !== undefined) ? addSlashes(req.body.tz) : "";

    let query = "INSERT INTO users";
    query += "( `name`, `uname`, `passwd`, `email`, `type_id`, `tz`)";
    query += " VALUES ";
    query += `( '${name}', '${username}', '${encryptedPassword}', '${email}', '${typeId}', '${timezone}')`;

    const promisePool = db_pool.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(query);
    } catch (err) {
        console.log(err);
    }

    next();
}

// עדכון פרטי משתמש קיים
async function UpdateUser(req, res, next) {
    let userId = parseInt(req.params.id);
    let name = (req.body.name !== undefined) ? addSlashes(req.body.name) : "";
    let username = (req.body.uname !== undefined) ? addSlashes(req.body.uname) : "";
    let email = (req.body.email !== undefined) ? addSlashes(req.body.email) : "";
    let typeId = (req.body.type_id !== undefined) ? Number(req.body.type_id) : -1;
    let timezone = (req.body.tz !== undefined) ? addSlashes(req.body.tz) : "";
    
    if (userId <= 0) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;

    let query = `UPDATE users SET `;
    query += `name   ='${name}' ,`;
    query += `uname  ='${username}' ,`;
    query += `email  ='${email}' ,`;
    query += `type_id='${typeId}' ,`;
    query += `tz     ='${timezone}'  `;
    query += ` WHERE id='${userId}'`;
    
    const promisePool = db_pool.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(query);
    } catch (err) {
        console.log(err);
    }

    next();
}

// קבלת כל המשתמשים עם דפדוף
async function GetAllUsers(req, res, next) {
    let currentPage = 0;
    let rowsPerPage = 2;
    if (req.query.p !== undefined) {
        currentPage = parseInt(req.query.p);
    }
    req.page = currentPage;

    let rows = [];
    // ספירת מספר המשתמשים לחישוב דפים
    let query = "SELECT COUNT(id) AS cnt FROM users";
    const promisePool = db_pool.promise();
    let totalRows = 0;
    try {
        [rows] = await promisePool.query(query);
        totalRows = rows[0].cnt;
    } catch (err) {
        console.log(err);
    }
    req.total_pages = Math.floor(totalRows / rowsPerPage);
    
    // קבלת המשתמשים לדף הנוכחי
    query = "SELECT * FROM users";
    query += ` LIMIT ${currentPage * rowsPerPage},${rowsPerPage} `;
    req.users_data = [];
    try {
        [rows] = await promisePool.query(query);
        req.users_data = rows;
    } catch (err) {
        console.log(err);
    }

    next();
}

// קבלת משתמש אחד לפי מזהה
async function GetOneUser(req, res, next) {
    let userId = parseInt(req.params.id);
    console.log(userId)
    if ((userId === NaN) || (userId <= 0)) {
        req.GoodOne = false;
        return next();
    }
    req.GoodOne = true;
    let query = `SELECT * FROM users  WHERE id='${userId}' `;
    const promisePool = db_pool.promise();
    let rows = [];
    req.one_user_data = [];
    try {
        [rows] = await promisePool.query(query);
        if (rows.length > 0) {
            req.one_user_data = rows[0];
        }
    } catch (err) {
        console.log(err);
    }

    next();
}

// מחיקת משתמש מהמערכת
async function DeleteUser(req, res, next) {
    let userId = parseInt(req.body.id);
    if (userId > 0) {
        let query = `DELETE FROM users WHERE id='${userId}' `;
        const promisePool = db_pool.promise();
        let rows = [];
        try {
            [rows] = await promisePool.query(query);
        } catch (err) {
            console.log(err);
        }
    }

    next();
}

module.exports = {
    AddUser,
    GetAllUsers,
    GetOneUser,
    DeleteUser,
    UpdateUser,
    CheckLogin,
    isLogged,
}