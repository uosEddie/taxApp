let currentUserText = localStorage.getItem("Current User");
let currentUser = JSON.parse(currentUserText);

let backendURL = "https://taxapp-production-940c.up.railway.app";

let incomeValue = document.getElementById("incomeValue");
let expenseValue = document.getElementById("expenseValue");
let taxValue = document.getElementById("taxValue");
let profitValue = document.getElementById("profitValue");
let recordsBody = document.getElementById("recordsBody");

let totalIncome = 0;
let totalExpense = 0;



fetch(`${backendURL}/records/${currentUser.id}`)
.then(function(response){
    return response.json();
})
.then(function(data){

    if(data.success === true){

        recordsBody.innerHTML = "";

        data.records.forEach(function(record){

            if(record.category === "Income"){
                totalIncome = totalIncome + Number(record.amount);
            }

            else if(record.category === "Expense"){
                totalExpense = totalExpense + Number(record.amount);
            }

            let recentRecord = document.createElement("tr");

            recentRecord.innerHTML = `
                <td>${record.record_date}</td>
                <td>${record.description}</td>
                <td>${record.category}</td>
                <td>£${record.amount}</td>
            `;

            recordsBody.appendChild(recentRecord);

        });

        incomeValue.innerHTML = `£ ${totalIncome.toFixed(2)}`;
        expenseValue.innerHTML = `£ ${totalExpense.toFixed(2)}`;

        let netProfit = totalIncome - totalExpense;
        profitValue.innerHTML = `£ ${netProfit.toFixed(2)}`;

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
        taxValue.innerHTML = `£ ${totalTax.toFixed(2)}`;

    }

});