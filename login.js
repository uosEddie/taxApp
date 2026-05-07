let savedLogin = localStorage.getItem("User Details");

let loginUserArray;

if(savedLogin){
    loginUserArray = JSON.parse(savedLogin);
}

else{
    loginUserArray = [];
}



let loginForm = document.getElementById("loginForm");

let loginEmail = document.getElementById("login-email");
let loginPassword = document.getElementById("login-password");


loginForm.addEventListener("submit", function(event){
    event.preventDefault();

    console.log(loginEmail.value);
    console.log(loginPassword.value);

    
    let userFound = false;

    loginUserArray.forEach(function(found){
        if(loginEmail.value === found.userEmail && loginPassword.value === found.userPassword){
            userFound = true;
            let currentUser = JSON.stringify(found);
            localStorage.setItem("Current User", currentUser);
             window.location.href = "dashboard.html";
        }  
        
    })

    if (userFound === false){
            alert("Wrong email or password");
          
        
    }

   
    
});