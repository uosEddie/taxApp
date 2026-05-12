let getCurrentUser = localStorage.getItem("Current User");
let currentUser = JSON.parse(getCurrentUser);

let backendURL = "https://taxapp-production-940c.up.railway.app";

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

fetch(`${backendURL}/records/${currentUser.id}`)
.then(function(response){
    return response.json();
})
.then(function(data){

    if(data.success === true){

        data.records.forEach(function(record){

            if(record.category === "Income"){
                totalIncome = totalIncome + Number(record.amount);
            }

            else if(record.category === "Expense"){
                totalExpense = totalExpense + Number(record.amount);
            }

        });

        let taxableProfit = totalIncome - totalExpense;
        let taxDue = taxableProfit * 0.2;

        calcIncome.innerHTML = `£ ${totalIncome.toFixed(2)}`;
        calcExpense.innerHTML = `£ ${totalExpense.toFixed(2)}`;
        calcProfit.innerHTML = `£ ${taxableProfit.toFixed(2)}`;
        taxRate.innerHTML = `20%`;
        calcTax.innerHTML = `£ ${taxDue.toFixed(2)}`;

        summaryIncomeCard.innerHTML = `£ ${totalIncome.toFixed(2)}`;
        summaryExpenseCard.innerHTML = `£ ${totalExpense.toFixed(2)}`;
        summaryProfitCard.innerHTML = `£ ${taxableProfit.toFixed(2)}`;
        summaryTaxCard.innerHTML = `£ ${taxDue.toFixed(2)}`;
    }

});