let currentUserText = localStorage.getItem("Current User");
let currentUser = JSON.parse(currentUserText);

let recordForm = document.getElementById("recordForm");

let date = document.getElementById("date");
let description = document.getElementById("description");
let category = document.getElementById("category");
let amount = document.getElementById("amount");

let recordsTable = document.getElementById("recordsTable");

let editingRecordId = null;

let backendURL = "https://taxapp-production-940c.up.railway.app";



function loadRecords(){

    recordsTable.innerHTML = "";

    fetch(`${backendURL}/records/${currentUser.id}`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        if(data.success === true){

            data.records.forEach(function(record){

                displayRecord(record);

            });

        }

    });

}



function displayRecord(record){

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${record.record_date}</td>
        <td>${record.description}</td>
        <td>${record.category}</td>
        <td>£${record.amount}</td>
        <td>
            <button class="edit-record">Edit</button>
            <button class="delete-record">Delete</button>
        </td>
    `;

    recordsTable.appendChild(row);



    let editBtn = row.querySelector(".edit-record");

    editBtn.addEventListener("click", function(){

        date.value = record.record_date;
        description.value = record.description;
        category.value = record.category;
        amount.value = record.amount;

        editingRecordId = record.id;

    });



    let deleteBtn = row.querySelector(".delete-record");

    deleteBtn.addEventListener("click", function(){

        fetch(`${backendURL}/records/${record.id}`, {
            method: "DELETE"
        })
        .then(function(response){
            return response.json();
        })
        .then(function(data){

            alert(data.message);

            if(data.success === true){
                loadRecords();
            }

        });

    });

}



recordForm.addEventListener("submit", function(event){
    event.preventDefault();

    let oneRecord = {
        userId: currentUser.id,
        recordDate: date.value,
        recordDescription: description.value,
        recordCategory: category.value,
        recordAmount: amount.value
    };

    if(editingRecordId !== null){

        fetch(`${backendURL}/records/${editingRecordId}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(oneRecord)
        })
        .then(function(response){
            return response.json();
        })
        .then(function(data){

            alert(data.message);

            editingRecordId = null;

            date.value = "";
            description.value = "";
            amount.value = "";

            loadRecords();

        });

    }

    else{

        fetch(`${backendURL}/records`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(oneRecord)
        })
        .then(function(response){
            return response.json();
        })
        .then(function(data){

            alert(data.message);

            date.value = "";
            description.value = "";
            amount.value = "";

            loadRecords();

        });

    }

});



loadRecords();