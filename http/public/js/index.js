let currUser;
let currentUser = JSON.parse(JSON.parse(getCookie("currentUser")))
async function startUp() {
    if(currentUser != null) {
        await fetch(`/getUser?email=${currentUser.email}`)
            .then(response => response.json())
            .then(data => {
                currUser = data;
            });
    }

        fetch("/getRecipes", {method: "GET"})
            .then(response => response.json())
            .then(data => {
                //Do something with data
                createRecipeListItems(data);
            })
            .catch(error => console.error(error));
}

startUp();

function createRecipeListItems(recipes) {
    let recipeList = document.querySelector("#recipe-list");
    let recipeListItem = recipeList.querySelector(".recipelistitem")
    for (let i = 0; i < recipes.length; i++) {
        let newRLI = recipeListItem.cloneNode(true);
        newRLI.querySelector("#foodImg").src = recipes[i].imgPath; // Sets the img path
        newRLI.querySelector("#recipedesc").textContent = recipes[i].description;
        newRLI.addEventListener("click", changePage);
        newRLI.querySelector(".insidebox.row.rounded").dataset.recipeid = recipes[i]._id;
        
        if (currentUser != null) {
            if (currUser.favorites.includes(recipes[i]._id)) {
                let button = newRLI.querySelector(".button");
                button.classList.add("liked")
            }
        }
        newRLI.querySelector(".button").addEventListener("click", favoriteRecipe);
        
        recipeList.appendChild(newRLI);
    }
    recipeListItem.remove();
}

function changePage(e) { // this changes page to the recipePage with query
    let targetElem = e.target;
    while (!targetElem.hasAttribute("data-recipeid")) {
        if (targetElem.classList.contains("button")){
            return;
        }
        targetElem = targetElem.parentElement;
    }
    let recipeId = targetElem.dataset.recipeid;
    window.location.href = `../html/recipePage.html?${recipeId}`;
}

function favoriteRecipe(e) {
    if (currentUser != null) {
        $(this).toggleClass("liked");
        let targetElem = e.target;
        while (!targetElem.hasAttribute("data-recipeid")) {
            targetElem = targetElem.parentElement;
        }
        let body = {
            recipeId: targetElem.dataset.recipeid,
            userToken: JSON.parse(JSON.parse(getCookie("currentUser"))).userToken
        }
        // fetch PUT request to update users favorites list
        fetch("/updateFavorites", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }
}