require("dotenv").config();

const express = require("express");
const mySql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());

app.use(express.json());

const db = mySql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect(function(error){

    if(error){
        console.log("Database connection failed");
        console.log(error);
    }
    else{
        console.log("Database connected successfully");
    }

});

function addAuditLog(userId, userName, action, description, status){

    let sql = `
        INSERT INTO audit_logs(user_id, user_name, action, description, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [userId, userName, action, description, status],
        function(error){

            if(error){
                console.log("Audit log failed");
                console.log(error);
            }

        }
    );

}

app.get("/", function(req, res){

    res.send("Backend is running");

});

app.get("/test-version", function(req, res){

    res.json({
        success: true,
        message: "Latest Railway backend is running",
        version: "user-management-fix-v3"
    });

});

/* REGISTER */
app.post("/register", function(req, res){

    let userData = req.body;

    let sql = `
        INSERT INTO users(name, email, password, role, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userData.userName,
            userData.userEmail,
            userData.userPassword,
            userData.userRole,
            "Active"
        ],
        function(error, result){

            if(error){
                console.log(error);

                return res.json({
                    success: false,
                    message: "Registration failed. Email may already exist."
                });
            }

            addAuditLog(
                result.insertId,
                userData.userName,
                "Register",
                "New user account created",
                "Success"
            );

            res.json({
                success: true,
                message: "Registration successful"
            });

        }
    );

});

/* LOGIN */
app.post("/login", function(req, res){

    let loginData = req.body;

    let sql = `
        SELECT *
        FROM users
        WHERE email = ? AND password = ?
    `;

    db.query(
        sql,
        [
            loginData.userEmail,
            loginData.userPassword
        ],
        function(error, results){

            if(error){
                console.log(error);

                return res.json({
                    success: false,
                    message: "Login failed"
                });
            }

            if(results.length === 0){
                return res.json({
                    success: false,
                    message: "Wrong email or password"
                });
            }

            if(results[0].status === "Inactive"){
                return res.json({
                    success: false,
                    message: "This account is inactive. Please contact an administrator."
                });
            }

            addAuditLog(
                results[0].id,
                results[0].name,
                "Login",
                "User logged into the system",
                "Success"
            );

            res.json({
                success: true,
                message: "Login successful",
                user: results[0]
            });

        }
    );

});

/* ADD RECORD */
app.post("/records", function(req, res){

    let recordData = req.body;

    let sql = `
        INSERT INTO records(user_id, record_date, description, category, amount)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            recordData.userId,
            recordData.recordDate,
            recordData.recordDescription,
            recordData.recordCategory,
            recordData.recordAmount
        ],
        function(error){

            if(error){
                console.log(error);

                return res.json({
                    success: false,
                    message: "Record could not be saved"
                });
            }

            addAuditLog(
                recordData.userId,
                "User",
                "Add Record",
                "Financial record added",
                "Success"
            );

            res.json({
                success: true,
                message: "Record saved successfully"
            });

        }
    );

});

/* GET USER RECORDS */
app.get("/records/:userId", function(req, res){

    let userId = req.params.userId;

    let sql = `
        SELECT *
        FROM records
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [userId], function(error, results){

        if(error){
            console.log(error);

            return res.json({
                success: false,
                message: "Could not load records"
            });
        }

        res.json({
            success: true,
            records: results
        });

    });

});

/* UPDATE RECORD */
app.put("/records/:recordId", function(req, res){

    let recordId = req.params.recordId;
    let recordData = req.body;

    let sql = `
        UPDATE records
        SET record_date = ?, description = ?, category = ?, amount = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            recordData.recordDate,
            recordData.recordDescription,
            recordData.recordCategory,
            recordData.recordAmount,
            recordId
        ],
        function(error){

            if(error){
                console.log(error);

                return res.json({
                    success: false,
                    message: "Record could not be updated"
                });
            }

            addAuditLog(
                recordData.userId || null,
                "User",
                "Update Record",
                "Financial record updated",
                "Success"
            );

            res.json({
                success: true,
                message: "Record updated successfully"
            });

        }
    );

});

/* DELETE RECORD */
app.delete("/records/:recordId", function(req, res){

    let recordId = req.params.recordId;

    let sql = `
        DELETE FROM records
        WHERE id = ?
    `;

    db.query(sql, [recordId], function(error){

        if(error){
            console.log(error);

            return res.json({
                success: false,
                message: "Record could not be deleted"
            });
        }

        addAuditLog(
            null,
            "User",
            "Delete Record",
            "Financial record deleted",
            "Success"
        );

        res.json({
            success: true,
            message: "Record deleted successfully"
        });

    });

});

/* GET ALL USERS */
app.get("/users", function(req, res){

    let sql = `
        SELECT id, name, email, role, status
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, function(error, results){

        if(error){
            console.log(error);

            return res.json({
                success: false,
                message: "Could not load users"
            });
        }

        res.json({
            success: true,
            users: results
        });

    });

});

/* ADD USER FROM ADMIN PAGE */
app.post("/users", function(req, res){

    let userData = req.body;

    let userName = userData.name || userData.userName;
    let userEmail = userData.email || userData.userEmail;
    let userRole = userData.role || userData.userRole || "Taxpayer";
    let userStatus = userData.status || "Active";
    let userPassword = userData.password || userData.userPassword || "password123";

    if(!userName || !userEmail){
        return res.json({
            success: false,
            message: "Name and email are required"
        });
    }

    let sql = `
        INSERT INTO users(name, email, password, role, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userName,
            userEmail,
            userPassword,
            userRole,
            userStatus
        ],
        function(error, result){

            if(error){
                console.log(error);

                return res.json({
                    success: false,
                    message: "User could not be added. Email may already exist."
                });
            }

            addAuditLog(
                result.insertId,
                "Admin",
                "Add User",
                "New user added by administrator",
                "Success"
            );

            res.json({
                success: true,
                message: "User added successfully"
            });

        }
    );

});

/* UPDATE USER */
app.put("/users/:userId", function(req, res){

    let userId = req.params.userId;
    let userData = req.body;

    let sql = `
        UPDATE users
        SET role = ?, status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            userData.role,
            userData.status,
            userId
        ],
        function(error){

            if(error){
                console.log(error);

                return res.json({
                    success: false,
                    message: "User update failed"
                });
            }

            addAuditLog(
                userId,
                "Admin",
                "Update User",
                "User role or status updated",
                "Success"
            );

            res.json({
                success: true,
                message: "User updated successfully"
            });

        }
    );

});

/* DELETE USER */
app.delete("/users/:userId", function(req, res){

    let userId = req.params.userId;

    let deleteUserRecordsSql = `
        DELETE FROM records
        WHERE user_id = ?
    `;

    let deleteUserAuditLogsSql = `
        DELETE FROM audit_logs
        WHERE user_id = ?
    `;

    let deleteUserSql = `
        DELETE FROM users
        WHERE id = ?
    `;

    db.query(deleteUserRecordsSql, [userId], function(error){

        if(error){
            console.log(error);

            return res.json({
                success: false,
                message: "User records could not be deleted"
            });
        }

        db.query(deleteUserAuditLogsSql, [userId], function(error){

            if(error){
                console.log(error);

                return res.json({
                    success: false,
                    message: "User audit logs could not be deleted"
                });
            }

            db.query(deleteUserSql, [userId], function(error){

                if(error){
                    console.log(error);

                    return res.json({
                        success: false,
                        message: "User could not be deleted"
                    });
                }

                res.json({
                    success: true,
                    message: "User deleted successfully"
                });

            });

        });

    });

});

/* GET AUDIT LOGS */
app.get("/audit-logs", function(req, res){

    let sql = `
        SELECT *
        FROM audit_logs
        ORDER BY created_at DESC
    `;

    db.query(sql, function(error, results){

        if(error){
            console.log(error);

            return res.json({
                success: false,
                message: "Could not load audit logs"
            });
        }

        res.json({
            success: true,
            logs: results
        });

    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){

    console.log("Server running on port " + PORT);

});