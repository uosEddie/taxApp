function showMessage(message, type){
    let messageBox = document.getElementById("message-box");

    if(messageBox){
        messageBox.className = "message-box " + type;
        messageBox.innerHTML = message;
    }
}