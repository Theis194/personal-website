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

window.load = createRecipeListItems();

function changePage(e) { // this changes page to the recupePage with query
    let targetElem = e.target;
    while (!targetElem.hasAttribute("data-recipeid")) {
        targetElem = targetElem.parentElement;
    }
    let recipeId = targetElem.dataset.recipeid;
    window.location.href = `../html/recipePage.html?${recipeId}`;
}

/* 
    TODO:
        Fetch recipes from database
        Populate page with recipes (add recipeid from database)
        In recipePage.js fetch using the provided id the  recipe
*/