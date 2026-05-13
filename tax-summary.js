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

function formatDate(dateString){

    let date = new Date(dateString);

    return date.toLocaleDateString("en-GB");

}


function calculateUKTax(profit){

    let tax = 0;

    if(profit <= 12570){
        tax = 0;
    }

    else if(profit <= 50270){
        tax = (profit - 12570) * 0.20;
    }

    else if(profit <= 125140){

        let basicTax = (50270 - 12570) * 0.20;

        let higherTax = (profit - 50270) * 0.40;

        tax = basicTax + higherTax;
    }

    else{

        let basicTax = (50270 - 12570) * 0.20;

        let higherTax = (125140 - 50270) * 0.40;

        let additionalTax = (profit - 125140) * 0.45;

        tax = basicTax + higherTax + additionalTax;
    }

    return tax;
}



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

        let taxDue = calculateUKTax(taxableProfit);

        calcIncome.innerHTML = `£ ${totalIncome.toFixed(2)}`;

        calcExpense.innerHTML = `£ ${totalExpense.toFixed(2)}`;

        calcProfit.innerHTML = `£ ${taxableProfit.toFixed(2)}`;

        taxRate.innerHTML = `UK tax bands`;

        calcTax.innerHTML = `£ ${taxDue.toFixed(2)}`;

        summaryIncomeCard.innerHTML = `£ ${totalIncome.toFixed(2)}`;

        summaryExpenseCard.innerHTML = `£ ${totalExpense.toFixed(2)}`;

        summaryProfitCard.innerHTML = `£ ${taxableProfit.toFixed(2)}`;

        summaryTaxCard.innerHTML = `£ ${taxDue.toFixed(2)}`;

    }

});