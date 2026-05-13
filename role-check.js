let currentUserText = localStorage.getItem("Current User");
let currentUser = JSON.parse(currentUserText);

if(currentUser.role === "Taxpayer"){
    alert("Access denied. Taxpayers cannot access this page.");
    window.location.href = "dashboard.html";
}