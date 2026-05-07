let savedProfile = localStorage.getItem("Current User");
let savedProfileContent = JSON.parse(savedProfile);

let profilePic = document.getElementById("user-profile");
let profileName = document.getElementById("profile-name");
let profileEmail = document.getElementById("profile-email");
let profileRole = document.getElementById("profile-role");
let profilePicture = document.getElementById("profile-picture");


profileName.innerHTML = savedProfileContent.userName;
profileEmail.innerHTML = savedProfileContent.userEmail;
profileRole.innerHTML = savedProfileContent.userRole;


profilePic.src = profilePicture;


