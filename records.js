let getCurrentUser = localStorage.getItem("Current User");
let currentUser = JSON.parse(getCurrentUser);
let recordsKey = "User Records - " + currentUser.userEmail;

let savedRecords = localStorage.getItem(recordsKey);

let storeRecordArray;

if(savedRecords){
    storeRecordArray = JSON.parse(savedRecords);
}
else{
    storeRecordArray = [];
}

let editingIndex = null;

let recordForm = document.getElementById("recordForm");

let date = document.getElementById("date");
let description = document.getElementById("description");
let category = document.getElementById("category");
let amount = document.getElementById("amount");

let recordsTable = document.getElementById("recordsTable");



function displayRecord(record, index) {
    let displayNewRecord = document.createElement("tr");

    displayNewRecord.innerHTML = `
        <td>${record.recordDate}</td>
        <td>${record.recordDescription}</td>
        <td>${record.recordCategory}</td>
        <td>£${record.recordAmount}</td>
        <td>
            <button class="edit-record">Edit</button>
            <button class="delete-record">Delete</button>
        </td>
    `;

    recordsTable.appendChild(displayNewRecord);



    let editRecord = displayNewRecord.querySelector(".edit-record");

    editRecord.addEventListener("click", function(){
        date.value = record.recordDate;
        description.value = record.recordDescription;
        category.value = record.recordCategory;
        amount.value = record.recordAmount;

        editingIndex = index;
    });



    let deleteDisplayRecord = displayNewRecord.querySelector(".delete-record");

    deleteDisplayRecord.addEventListener("click", function(){
        storeRecordArray.splice(index, 1);

        let updatedRecords = JSON.stringify(storeRecordArray);
        localStorage.setItem(recordsKey, updatedRecords);

        window.location.reload();
    });
}



storeRecordArray.forEach(function(record, index) {
    displayRecord(record, index);
});



recordForm.addEventListener("submit", function(event){
    event.preventDefault();

    let oneRecord = {
        recordDate : date.value,
        recordDescription : description.value,
        recordCategory : category.value,
        recordAmount : amount.value
    };

    if(editingIndex !== null){
        storeRecordArray[editingIndex] = oneRecord;
        editingIndex = null;
    }
    else{
        storeRecordArray.push(oneRecord);
    }

    let storageArrayText = JSON.stringify(storeRecordArray);
    localStorage.setItem(recordsKey, storageArrayText);

    date.value = "";
    description.value = "";
    amount.value = "";

    window.location.reload();
});