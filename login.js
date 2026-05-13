let loginForm = document.getElementById("loginForm");

let loginEmail = document.getElementById("login-email");
let loginPassword = document.getElementById("login-password");


loginForm.addEventListener("submit", function(event){
    event.preventDefault();

    let loginUser = {
        userEmail: loginEmail.value,
        userPassword: loginPassword.value
    };

    fetch("https://taxapp-production-940c.up.railway.app/login", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(loginUser)
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if(data.success === true){
    showMessage(data.message, "success");
}
else{
    showMessage(data.message, "error");
}

        if(data.success === true){
            let currentUserText = JSON.stringify(data.user);
            localStorage.setItem("Current User", currentUserText);

            window.location.href = "dashboard.html";
        }
    });
});