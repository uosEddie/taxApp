let auditTable = document.getElementById("auditTable");

let backendURL = "https://taxapp-production-940c.up.railway.app";

function formatDate(dateString){

    let date = new Date(dateString);

    return date.toLocaleString("en-GB");

}

function loadAuditLogs(){

    auditTable.innerHTML = `
        <tr>
            <td colspan="6">Loading audit logs...</td>
        </tr>
    `;

    fetch(`${backendURL}/audit-logs`)
    .then(function(response){

        return response.json();

    })
    .then(function(data){

        auditTable.innerHTML = "";

        if(data.success === true){

            if(data.logs.length === 0){

                auditTable.innerHTML = `
                    <tr>
                        <td colspan="6">No audit logs found yet.</td>
                    </tr>
                `;

                return;
            }

            data.logs.forEach(function(log){

                displayLog(log);

            });

        }

        else{

            auditTable.innerHTML = `
                <tr>
                    <td colspan="6">Could not load audit logs.</td>
                </tr>
            `;

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