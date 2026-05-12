require("dotenv").config();

const express = require("express");
const mySql = require("mysql2");
const cors = require("cors");

const app = express();

const allowedOrigins = [
    "https://taxappeddy.netlify.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

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
        INSERT INTO users(name, email, password, role)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userData.userName,
            userData.userEmail,
            userData.userPassword,
            userData.userRole
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

                res.json({
                    success: true,
                    message: "Login successful",
                    user: results[0]
                });

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("Server running on port " + PORT);
});