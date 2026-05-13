let roleCheckUserText = localStorage.getItem("Current User");

let roleCheckUser = JSON.parse(roleCheckUserText);

if(roleCheckUser.role === "Taxpayer"){

    showMessage(
        "Access denied. Taxpayers cannot access this page.",
        "warning"
    );

    setTimeout(function(){

        window.location.href = "dashboard.html";

    }, 3000);

}