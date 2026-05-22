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
        version: "audit-log-fix-v2"
    });

});



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

                res.json({
                    success: false,
                    message: "Registration failed. Email may already exist."
                });

            }

            else{

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

        }
    );

});



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

                res.json({
                    success: false,
                    message: "Login failed"
                });

            }

            else if(results.length > 0){

                if(results[0].status === "Inactive"){

                    res.json({
                        success: false,
                        message: "This account is inactive. Please contact an administrator."
                    });

                }

                else{

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

            }

            else{

                res.json({
                    success: false,
                    message: "Wrong email or password"
                });

            }

        }
    );

});



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

                res.json({
                    success: false,
                    message: "Record could not be saved"
                });

            }

            else{

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

        }
    );

});



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

            res.json({
                success: false,
                message: "Could not load records"
            });

        }

        else{

            res.json({
                success: true,
                records: results
            });

        }

    });

});



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

                res.json({
                    success: false,
                    message: "Record could not be updated"
                });

            }

            else{

                addAuditLog(
                    recordData.userId,
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

        }
    );

});



app.delete("/records/:recordId", function(req, res){

    let recordId = req.params.recordId;

    let sql = `
        DELETE FROM records
        WHERE id = ?
    `;

    db.query(sql, [recordId], function(error){

        if(error){

            res.json({
                success: false,
                message: "Record could not be deleted"
            });

        }

        else{

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

        }

    });

});



app.get("/users", function(req, res){

    let sql = `
        SELECT id, name, email, role, status
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, function(error, results){

        if(error){

            res.json({
                success: false,
                message: "Could not load users"
            });

        }

        else{

            res.json({
                success: true,
                users: results
            });

        }

    });

});



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

                res.json({
                    success: false,
                    message: "User update failed"
                });

            }

            else{

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

        }
    );

});



app.delete("/users/:userId", function(req, res){

    let userId = req.params.userId;

    let sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], function(error){

        if(error){

            res.json({
                success: false,
                message: "User could not be deleted"
            });

        }

        else{

            addAuditLog(
                userId,
                "Admin",
                "Delete User",
                "User account deleted",
                "Success"
            );

            res.json({
                success: true,
                message: "User deleted successfully"
            });

        }

    });

});



app.get("/audit-logs", function(req, res){

    let sql = `
        SELECT *
        FROM audit_logs
        ORDER BY created_at DESC
    `;

    db.query(sql, function(error, results){

        if(error){

            console.log(error);

            res.json({
                success: false,
                message: "Could not load audit logs"
            });

        }

        else{

            res.json({
                success: true,
                logs: results
            });

        }

    });

});



const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){

    console.log("Server running on port " + PORT);

});