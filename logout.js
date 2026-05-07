let currentUserToDelete = localStorage.getItem("Current User");

let logOutBtn = document.getElementById("logout-btn");
let mobileLogOutBtn = document.getElementById("mobile-logout-btn");


logOutBtn.addEventListener("click", function(event){
    event.preventDefault();
    localStorage.removeItem("Current User");
    window.location.href = "index.html";
});

mobileLogOutBtn.addEventListener("click", function(event){
    event.preventDefault();
    localStorage.removeItem("Current User");
    window.location.href = "index.html";
});