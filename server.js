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

app.get("/", function(req, res){

    res.send("Backend is running");

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
        SELECT * FROM users
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

        function(error, result){

            if(error){

                res.json({
                    success: false,
                    message: "Record could not be saved"
                });

            }

            else{

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
        SELECT * FROM records
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



app.delete("/records/:recordId", function(req, res){

    let recordId = req.params.recordId;

    let sql = `
        DELETE FROM records
        WHERE id = ?
    `;

    db.query(sql, [recordId], function(error, result){

        if(error){

            res.json({
                success: false,
                message: "Record could not be deleted"
            });

        }

        else{

            res.json({
                success: true,
                message: "Record deleted successfully"
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

        function(error, result){

            if(error){

                res.json({
                    success: false,
                    message: "Record could not be updated"
                });

            }

            else{

                res.json({
                    success: true,
                    message: "Record updated successfully"
                });

            }

        }
    );

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

        function(error, result){

            if(error){

                res.json({
                    success: false,
                    message: "User update failed"
                });

            }

            else{

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

    db.query(sql, [userId], function(error, result){

        if(error){

            res.json({
                success: false,
                message: "User could not be deleted"
            });

        }

        else{

            res.json({
                success: true,
                message: "User deleted successfully"
            });

        }

    });

});



const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){

    console.log("Server running on port " + PORT);

});