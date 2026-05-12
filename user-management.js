let backendURL = "https://taxapp-production-940c.up.railway.app";

let userForm = document.getElementById("userForm");

let fullName = document.getElementById("full-name");
let email = document.getElementById("email");
let role = document.getElementById("role");
let status = document.getElementById("status");

let usersTable = document.getElementById("usersTable");


function loadUsers(){

    usersTable.innerHTML = "";

    fetch(`${backendURL}/users`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        if(data.success === true){

            data.users.forEach(function(user){

                let row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>Active</td>
                    <td><button>View</button></td>
                `;

                usersTable.appendChild(row);

            });

        }

    });

}


userForm.addEventListener("submit", function(event){
    event.preventDefault();

    let newUser = {
        userName: fullName.value,
        userEmail: email.value,
        userPassword: "Password123",
        userRole: role.value
    };

    fetch(`${backendURL}/register`, {
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
            fullName.value = "";
            email.value = "";
            loadUsers();
        }

    });

});


loadUsers();