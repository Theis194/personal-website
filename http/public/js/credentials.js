window.addEventListener("DOMContentLoaded", setNavBar);

function setNavBar() {
    let authorRemovables = [];
    let adminRemovables = [];
    let currentUser = JSON.parse(JSON.parse(getCookie("currentUser")));
    let activeUser = false;
    if (currentUser != null) {
        activeUser = true
    }

    checkCredentials();

    $(function(){
        $("#includedNav").load("/html/navBar/navbar.html", function() {
            authorRemovables.push("#nyOpskrift");
            adminRemovables.push("#admin");
            switch (window.location.href.split("/")[4]) {
                case "newRecipe.html":
                    $("#nyOpskrift").addClass("active");
                    break;
                case "adminPage.html":
                    $("#admin").addClass("active");
                    break;
                default:
                    $("#home").addClass("active");
                    break;
            }
            if (activeUser == true) {
                if (!currentUser.privileges.includes("author")) {
                    for (let i = 0; i < authorRemovables.length; i++) {
                        $(authorRemovables[i]).remove();
                    }
                }
                if (!currentUser.privileges.includes("admin")) {
                    for (let i = 0; i < adminRemovables.length; i++) {
                        $(adminRemovables[i]).remove();
                    }
                }
            } else if (activeUser == false) {
                for (let i = 0; i < authorRemovables.length; i++) {
                    $(authorRemovables[i]).remove();
                }
                for (let i = 0; i < adminRemovables.length; i++) {
                    $(adminRemovables[i]).remove();
                }
            }
        }); 
    });
}

function checkCredentials() {
    let currentUser = JSON.parse(JSON.parse(getCookie("currentUser")));

    // Add if statements that relocates the user to the index.html if they do not have the right privileges
    // E.g. if they do not have admin privileg and try to access adminPage.html
    let currentPage = window.location.href.split("/");
    currentPage = currentPage[4];
    if (currentPage != undefined) {
        if (currentPage === "newRecipe.html" && !currentUser.privileges.includes("author")) {
            document.location.href = "/";
        } else if (currentPage === "adminPage.html" && !currentUser.privileges.includes("admin")) {
            document.location.href = "/";
        } // add favoritesPage once it is made but only check if currentUser != null
    }
}

function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(";");
  
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
  
         if (cookie.indexOf(name) === 0) {
            let cookieValue = cookie.substring(name.length);
            return cookieValue;
        }
    }
    return null; // Return null if the cookie is not found
}