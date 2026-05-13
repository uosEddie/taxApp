let currentUserText = localStorage.getItem("Current User");
let currentUser = JSON.parse(currentUserText);

if(currentUser.role === "Taxpayer"){
   showMessage("Access denied. Taxpayers cannot access this page.", "warning");

setTimeout(function(){
    window.location.href = "dashboard.html";
}, 3000);
    window.location.href = "dashboard.html";
}