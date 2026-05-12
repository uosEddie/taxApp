let savedProfile = localStorage.getItem("Current User");
let savedProfileContent = JSON.parse(savedProfile);

let profileName = document.getElementById("profile-name");
let profileEmail = document.getElementById("profile-email");
let profileRole = document.getElementById("profile-role");

profileName.innerHTML = savedProfileContent.name;
profileEmail.innerHTML = savedProfileContent.email;
profileRole.innerHTML = savedProfileContent.role;