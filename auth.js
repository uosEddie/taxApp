let savedCurrentUser = localStorage.getItem("Current User");

if(savedCurrentUser){

    let currentUser = JSON.parse(savedCurrentUser);

    let adminOnlyLinks = document.querySelectorAll(".admin-only");

    if(currentUser.role === "Taxpayer"){

        adminOnlyLinks.forEach(function(link){

            link.style.display = "none";

        });

    }

}

else{

    window.location.href = "login.html";

}