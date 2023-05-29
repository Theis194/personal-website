// Get the current URL
let currentUrl = window.location.href;

fetch(`/getRecipe?id=${currentUrl.split("?")[1]}`, {method: "GET"})
    .then(response => response.json())
    .then(data => {
        populatePage(data);
    })
    .catch(error => console.error(error));

function populatePage(recipe) {
    // Titel, description, picture, and procedure
    let titels = document.querySelectorAll("h2");
    let description = document.querySelector("#description");
    let img = document.querySelector("#img");
    let procedure = document.querySelector("#Fremgangsmåde");

    // Total time, work time, shelflife, freezable, and servings
    let tTime = document.querySelector("#tTime");
    let wTime = document.querySelector("#wTime");
    let shelflife = document.querySelector("#shelflife");
    let freezable = document.querySelector("#freezable");
    let servings = document.querySelector("#servings");
    let removabels = [tTime, wTime, shelflife, freezable, servings];

    // Ingredients
    let ingredienser = document.querySelector("#ingredienser");

    for (let i = 0; i < titels.length; i++) {
        titels[i].textContent = recipe.title;
    }
    description.textContent = recipe.description;
    img.src = recipe.imgPath;
    procedure.innerHTML = recipe.procedure;

    tTime.querySelector("strong").textContent = recipe.time;
    wTime.querySelector("strong").textContent = recipe.workTime;
    shelflife.querySelector("strong").textContent = `${recipe.shelfLife} dage`;
    freezable.querySelector("strong").textContent = recipe.freezable;
    servings.querySelector("strong").textContent = `${recipe.servings} stk/pers`;
    for (let i = 0; i < removabels.length; i++) {
        if (removabels[i].querySelector("strong").textContent === "") {
            removabels[i].parentElement.remove();
        }
    }

    for (let i = 0; i < recipe.ingredients.length; i++) {
        const section = recipe.ingredients[i];
        const sectionName = section.sectionName;
        const data = section.data;

        let ingrediensClone = ingredienser.cloneNode(true);
        ingrediensClone.querySelector("h4").textContent = sectionName;
        let ingrediens = ingrediensClone.querySelector("#ingrediens")
        
        for (let j = 0; j < data.length; j++) {
            const item = data[j];
            const key = item.key;
            const value = item.value;
            const unit = item.unit;

            let newIngredient = ingrediens.cloneNode(true);
            ingrediens.remove();
            newIngredient.querySelector("label").textContent = `${key} ${value} ${unit}`;
            ingrediensClone.querySelector("#ingredienslist").appendChild(newIngredient);
        }
        ingredienser.parentElement.appendChild(ingrediensClone);
    }
    ingredienser.remove();
}