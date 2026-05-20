let usersTable = document.getElementById("usersTable");

let backendURL = "https://taxapp-production-940c.up.railway.app";



function loadUsers(){

    usersTable.innerHTML = "";

    fetch(`${backendURL}/users`)
    .then(function(response){

        return response.json();

    })
    .then(function(data){

        if(data.success === true){

            data.users.forEach(function(user){

                displayUser(user);

            });

        }

    });

}



function displayUser(user){

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>

        <td>
            <select class="role-select">
                <option value="Taxpayer" ${user.role === "Taxpayer" ? "selected" : ""}>
                    Taxpayer
                </option>

                <option value="Tax Officer" ${user.role === "Tax Officer" ? "selected" : ""}>
                    Tax Officer
                </option>

                <option value="Admin" ${user.role === "Admin" ? "selected" : ""}>
                    Admin
                </option>
            </select>
        </td>

        <td>
            <select class="status-select">
                <option value="Active" ${user.status === "Active" ? "selected" : ""}>
                    Active
                </option>

                <option value="Inactive" ${user.status === "Inactive" ? "selected" : ""}>
                    Inactive
                </option>
            </select>
        </td>

        <td>
            <button class="save-user-btn">
                Save
            </button>

            <button class="delete-user-btn">
                Delete
            </button>
        </td>
    `;

    usersTable.appendChild(row);



    let roleSelect = row.querySelector(".role-select");

    let statusSelect = row.querySelector(".status-select");

    let saveBtn = row.querySelector(".save-user-btn");

    let deleteBtn = row.querySelector(".delete-user-btn");



    saveBtn.addEventListener("click", function(){

        let updatedUser = {
            role: roleSelect.value,
            status: statusSelect.value
        };

        fetch(`${backendURL}/users/${user.id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedUser)

        })
        .then(function(response){

            return response.json();

        })
        .then(function(data){

            showMessage(data.message, "success");

            loadUsers();

        });

    });



    deleteBtn.addEventListener("click", function(){

        fetch(`${backendURL}/users/${user.id}`, {

            method: "DELETE"

        })
        .then(function(response){

            return response.json();

        })
        .then(function(data){

            showMessage(data.message, "warning");

            loadUsers();

        });

    });

}



loadUsers();