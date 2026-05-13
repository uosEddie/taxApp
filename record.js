//get user records from the storage
let savedRecords = localStorage.getItem("User Records");

//Store data in array 
let storeRecordArray;


if(savedRecords){
    storeRecordArray = JSON.parse(savedRecords);
}

else{
    //Store data in array 
     storeRecordArray = [];
}


function formatDate(dateString){

    let date = new Date(dateString);

    return date.toLocaleDateString("en-GB");

}

function displayRecord(record, index) {
    let displayNewRecord = document.createElement("tr");

    displayNewRecord.innerHTML = `
        <td>${formatDate(record.record_date)}</td>
        <td>${record.recordDescription}</td>
        <td>${record.recordCategory}</td>
        <td>£${record.recordAmount}</td>
        <td><button class="delete-record">Delete</button></td>
    `;


    
    let recordsTable = document.getElementById("recordsTable");
    recordsTable.appendChild(displayNewRecord);




    //deleting the record
     let deleteDisplayRecord = displayNewRecord.querySelector(".delete-record");
     deleteDisplayRecord.addEventListener("click", function(){
        storeRecordArray.splice(index,1);

        let updatedRecords = JSON.stringify(storeRecordArray);
        localStorage.setItem("User Records", updatedRecords);

        displayNewRecord.remove();
     }) 
}


storeRecordArray.forEach(function(record, index) {
    displayRecord(record, index);
});


//CALL FORM
let recordForm = document.getElementById("recordForm");

recordForm.addEventListener("submit", function(event){
    event.preventDefault(); // this prevents it from loading or something

    //getting the values of the form
    let date = document.getElementById("date");
    let description = document.getElementById("description");
    let category = document.getElementById("category");
    let amount = document.getElementById("amount");


    //creating new table row element 
    /* let newUserRecord = document.createElement("tr");

    newUserRecord.innerHTML = `
                                <td>${date.value}</td>
                                <td>${description.value}</td>
                                <td>${category.value}</td>
                                <td>£${amount.value}</td>
                                <td> <button class="delete-record">Delete</button> </td>
               
                     `

    //call records table
    let recordsTable = document.getElementById("recordsTable");

    //append new records to the table
    recordsTable.appendChild(newUserRecord);
    

   

    //deleting the record
     let deleteRecord = newUserRecord.querySelector(".delete-record");
     deleteRecord.addEventListener("click", function(){
        newUserRecord.remove();
     }) 
    */



     //create an object to insert the data into the array
     let oneRecord = {
        recordDate : date.value,
        recordDescription : description.value,
        recordCategory : category.value,
        recordAmount : amount.value
     }


     //push the record into the storage array
     storeRecordArray.push(oneRecord);

    let newIndex = storeRecordArray.length - 1;
    displayRecord(oneRecord,newIndex)



    //clear the table after appending
    date.value = "";
    description.value = "";
    amount.value = "";


    let storageArrayText = JSON.stringify(storeRecordArray);

    localStorage.setItem("User Records", storageArrayText);
    
});
