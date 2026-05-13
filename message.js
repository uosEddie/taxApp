function showMessage(message, type){

    let messageBox = document.getElementById("message-box");

    messageBox.className = "message-box " + type;

    messageBox.innerHTML = `
        <div class="message-content">
            ${message}
        </div>
    `;

    messageBox.style.display = "flex";

}