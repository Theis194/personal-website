function createRecipeListItems() {
    let recipeList = document.querySelector("#recipe-list");
    let recipeListItem = recipeList.querySelector(".recipelistitem")
    let newRLI = recipeListItem.cloneNode(true);
    console.log(newRLI );
    newRLI.querySelector("#recipedesc").textContent = "Cool shit!";
    newRLI.addEventListener("click", changePage)

    recipeList.appendChild(newRLI);
}

window.load = createRecipeListItems();

function changePage() {
    window.location.href = "../html/recipePage.html";
}