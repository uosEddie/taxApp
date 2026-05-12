let logOutBtn = document.getElementById("logout-btn");
let mobileLogOutBtn = document.getElementById("mobile-logout-btn");


if(logOutBtn){

    logOutBtn.addEventListener("click", function(event){
        event.preventDefault();

        localStorage.removeItem("Current User");

        window.location.href = "index.html";
    });

}


if(mobileLogOutBtn){

    mobileLogOutBtn.addEventListener("click", function(event){
        event.preventDefault();

        localStorage.removeItem("Current User");

        window.location.href = "index.html";
    });

}