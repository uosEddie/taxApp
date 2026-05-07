
let getCurrentUser = localStorage.getItem("Current User");
let currentUser = JSON.parse(getCurrentUser);
let recordsKey = "User Records - " + currentUser.userEmail;

let dashboardSavedRecords = localStorage.getItem(recordsKey);
let dashboardSavedArray;

if(dashboardSavedRecords){
    dashboardSavedArray = JSON.parse(dashboardSavedRecords);
}

else{
    dashboardSavedArray = [];
}





let incomeValue = document.getElementById("incomeValue");
let expenseValue = document.getElementById("expenseValue");
let taxValue = document.getElementById("taxValue");
let profitValue = document.getElementById("profitValue");


let totalIncome = 0;
let totalExpense = 0;

dashboardSavedArray.forEach(function(record){
    record.recordCategory;

    if(record.recordCategory === "Income"){
        totalIncome = totalIncome + Number(record.recordAmount);
    }
    else if(record.recordCategory === "Expense"){
        totalExpense = totalExpense + Number(record.recordAmount);
    }



let recordsBody = document.getElementById("recordsBody");

let recentRecord = document.createElement("tr");

recentRecord.innerHTML= ` <td>${record.recordDate}</td>
                    <td>${record.recordDescription}</td>
                    <td>${record.recordCategory}</td>
                    <td>£${record.recordAmount}</td>`;



                    recordsBody.appendChild(recentRecord);

    

})


incomeValue.innerHTML = `£ ${totalIncome}`;
expenseValue.innerHTML = `£ ${totalExpense}`;



let netProfit = totalIncome - totalExpense;
profitValue.innerHTML = `£ ${netProfit}`;

let totalTax = netProfit * 0.2;
taxValue.innerHTML = `£ ${totalTax.toFixed(2)}`;




