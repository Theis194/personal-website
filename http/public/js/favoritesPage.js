let list = document.querySelector("#list")

// Fetch request to gather users favorit events

function insertFavorites(favorites) {
    let template = document.querySelector("#card");

    for (let i = 0; i < favorites.length; i++) {
        let newCard = template.cloneNode(true);

        newCard.querySelector("#title").textContent = favorites[i].title;
        newCard.querySelector("#foodImg").src = favorites[i].imgPath;
        newCard.dataset.recipeid = favorites[i]._id;
        list.appendChild(newCard);
    }

    template.remove();
}