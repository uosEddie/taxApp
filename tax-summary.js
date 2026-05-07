let getCurrentUser = localStorage.getItem("Current User");
let currentUser = JSON.parse(getCurrentUser);
let recordsKey = "User Records - " + currentUser.userEmail;


let summaryRecords = localStorage.getItem(recordsKey);
let summaryArray;

if(summaryRecords){
    summaryArray = JSON.parse(summaryRecords);
}

else{
    summaryArray = [];
}


let calcIncome = document.getElementById("calc-income");
let calcExpense = document.getElementById("calc-expense");
let calcProfit = document.getElementById("calc-profit");
let taxRate = document.getElementById("tax-rate");
let calcTax = document.getElementById("calc-tax");
let summaryIncomeCard = document.getElementById("income-value");
let summaryExpenseCard = document.getElementById("expense-value");
let summaryProfitCard = document.getElementById("profit-value");
let summaryTaxCard = document.getElementById("tax-value");


let totalIncome = 0;
let totalExpense = 0;


summaryArray.forEach(function(record){
    record.recordCategory;

     if(record.recordCategory === "Income"){
        totalIncome = totalIncome + Number(record.recordAmount);
     }

     else if(record.recordCategory === "Expense"){
        totalExpense = totalExpense + Number(record.recordAmount);
     }
});



let taxableProfit = totalIncome - totalExpense;
let taxDue = taxableProfit * 0.2;

calcIncome.innerHTML = `£ ${totalIncome}`;
calcExpense.innerHTML = `£ ${totalExpense}`;
calcProfit.innerHTML = `£ ${taxableProfit}`;
calcTax.innerHTML = `£ ${taxDue}`;

summaryIncomeCard.innerHTML = `£ ${totalIncome}`;
summaryExpenseCard.innerHTML = `£ ${totalExpense}`;
summaryProfitCard.innerHTML = `£ ${taxableProfit}`;
summaryTaxCard.innerHTML = `£ ${taxDue.toFixed(2)}`;