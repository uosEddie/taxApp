let savedUserDetails = localStorage.getItem("User Details");
let userDetailsArray;

if(savedUserDetails){
    userDetailsArray = JSON.parse(savedUserDetails);
}

else{
    userDetailsArray = [];
}


let registerForm = document.getElementById("registerForm");

let registerName = document.getElementById("register-name");
let registerEmail = document.getElementById("register-email");
let registerPassword = document.getElementById("register-password");
let registerRole = document.getElementById("register-role");


registerForm.addEventListener("submit", function(event){
        event.preventDefault();


let newUser = {
    userName : registerName.value,
    userEmail : registerEmail.value,
    userPassword : registerPassword.value,
    userRole : registerRole.value,
}

let existingUser = false;

userDetailsArray.forEach(function(user){
    if(user.userEmail === registerEmail.value){
        existingUser = true;
    }
})

if(existingUser === true){
    alert("Email already registered");
    return;
}

userDetailsArray.push(newUser);
console.log(newUser);

let newUserText = JSON.stringify(userDetailsArray);
localStorage.setItem("User Details", newUserText);

alert("Registration successful");
window.location.href = "login.html";

});

