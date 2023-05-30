fetch("/getRecipes", {method: "GET"})
    .then(response => response.json())
    .then(data => {
        //Do something with data
        createRecipeListItems(data);
    })
    .catch(error => console.error(error));

function createRecipeListItems(recipes) {
    let recipeList = document.querySelector("#recipe-list");
    let recipeListItem = recipeList.querySelector(".recipelistitem")
    for (let i = 0; i < recipes.length; i++) {
        let newRLI = recipeListItem.cloneNode(true);
        newRLI.querySelector("#foodImg").src = recipes[i].imgPath; // Sets the img path
        newRLI.querySelector("#recipedesc").textContent = recipes[i].description;
        newRLI.addEventListener("click", changePage);
        newRLI.querySelector(".insidebox.row.rounded").dataset.recipeid = recipes[i]._id;
        recipeList.appendChild(newRLI);
    }
}

function changePage(e) { // this changes page to the recupePage with query
    let targetElem = e.target;
    while (!targetElem.hasAttribute("data-recipeid")) {
        targetElem = targetElem.parentElement;
    }
    let recipeId = targetElem.dataset.recipeid;
    window.location.href = `../html/recipePage.html?${recipeId}`;
}