function createRecipeListItems() {
    let recipeList = document.querySelector("#recipe-list");
    let recipeListItem = recipeList.querySelector(".recipelistitem")
    let newRLI = recipeListItem.cloneNode(true);
    console.log(newRLI );
    newRLI.querySelector("#recipedesc").textContent = "Cool shit!";
    newRLI.addEventListener("click", changePage);
    newRLI.querySelector(".insidebox.row.rounded").dataset.recipeid = "1234"

    recipeList.appendChild(newRLI);
}

function removeClutter() {
    // Is user logged in?
    // If not remove all they do not have access to (newRecipe)
    // Get request to figure out if looged in user has the "author" privlige
    // If they do not, remove newRecipe from topnav
    // Optionaly remove other clutter if  needed
    let currentUserCookie = JSON.parse(JSON.parse(getCookie("currentUser")));
    if (currentUserCookie) {
        console.log("User is logged in!");
        // Get request for privlige "author"
        console.log(currentUserCookie.firstName);
        console.log(currentUserCookie.lastName);
        console.log(currentUserCookie.email);
        console.log(currentUserCookie.userToken);
    } else {
        console.log("currentUser cookie not found");
    }
}

window.addEventListener("load", createRecipeListItems);
window.addEventListener("load", removeClutter);
/* window.load = createRecipeListItems(); */

function changePage(e) { // this changes page to the recupePage with query
    let targetElem = e.target;
    while (!targetElem.hasAttribute("data-recipeid")) {
        targetElem = targetElem.parentElement;
    }
    let recipeId = targetElem.dataset.recipeid;
    window.location.href = `../html/recipePage.html?${recipeId}`;
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

/* 
    TODO:
        Fetch recipes from database
        Populate page with recipes (add recipeid from database)
        In recipePage.js fetch using the provided id the  recipe
*/