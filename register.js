let registerForm = document.getElementById("registerForm");

let registerName = document.getElementById("register-name");
let registerEmail = document.getElementById("register-email");
let registerPassword = document.getElementById("register-password");
let registerRole = document.getElementById("register-role");


registerForm.addEventListener("submit", function(event){
    event.preventDefault();

    let newUser = {
        userName: registerName.value,
        userEmail: registerEmail.value,
        userPassword: registerPassword.value,
        userRole: registerRole.value
    };

    fetch("http://localhost:3000/register", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(newUser)
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        alert(data.message);

        if(data.success === true){
            window.location.href = "login.html";
        }
    });
});