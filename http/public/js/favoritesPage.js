let list = document.querySelector("#list")
let currUser = JSON.parse(JSON.parse(getCookie("currentUser")));
let currentUser;
let template = document.querySelector("#card").cloneNode(true);
document.querySelector("#card").remove();

async function startUp() {
    if (currUser != null) {
        await fetch(`/getUser?email=${currUser.email}`)
            .then(response => response.json())
            .then(data => {
                currentUser = data;
            });
    }
    
    // Fetch request to gather users favorit events
    fetch(`/getFavorites?userToken=${currUser.userToken}`, {method: "GET"})
        .then(Response => Response.json())
        .then(data => {
            if (data != "noRecipesFound") {
                insertFavorites(data);
            } else {
                alert("Du har ingen favoritede opskrifter");
            }
    }).catch(error => console.error(error));
}

startUp();

function insertFavorites(favorites) {
    for (let i = 0; i < favorites.length; i++) {
        let newCard = template.cloneNode(true);

        newCard.querySelector("#title").textContent = favorites[i].title;
        newCard.querySelector("#foodImg").src = favorites[i].imgPath;
        newCard.dataset.recipeid = favorites[i]._id;
        newCard.addEventListener("click", changePage);

        if (currUser != null) {
            if (currentUser.favorites.includes(favorites[i]._id)) {
                let button = newCard.querySelector(".button");
                button.classList.add("liked")
            }
        }
        newCard.querySelector(".button").addEventListener("click", favoriteRecipe);

        list.appendChild(newCard);
    }
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