let auditTable = document.getElementById("auditTable");

let backendURL = "https://taxapp-production-940c.up.railway.app";



function formatDate(dateString){

    let date = new Date(dateString);

    return date.toLocaleString("en-GB");

}



function loadAuditLogs(){

    auditTable.innerHTML = "";

    fetch(`${backendURL}/audit-logs`)
    .then(function(response){

        return response.json();

    })
    .then(function(data){

        if(data.success === true){

            data.logs.forEach(function(log){

                displayLog(log);

            });

        }

    });

}



function displayLog(log){

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${log.id}</td>

        <td>${log.user_name}</td>

        <td>${log.action}</td>

        <td>${log.description}</td>

        <td>${log.status}</td>

        <td>${formatDate(log.created_at)}</td>
    `;

    auditTable.appendChild(row);

}



loadAuditLogs();