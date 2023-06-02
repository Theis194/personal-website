let list = document.querySelector("#list")
let currUser = JSON.parse(JSON.parse(getCookie("currentUser")));

async function startUp() {
    let currentUser;
    await fetch(`/getUser?email=${currUser.email}`)
        .then(response => response.json())
        .then(data => {
            currentUser = data;
            console.log(currUser);
        });
    
    // Fetch request to gather users favorit events
    fetch(`/getFavorites?userToken=${currUser.userToken}`, {method: "GET"})
        .then(Response => Response.json())
        .then(data => {
            console.log(data);
            insertFavorites(data);
    }).catch(error => console.error(error));
}

startUp();

function insertFavorites(favorites) {
    let template = document.querySelector("#card");

    for (let i = 0; i < favorites.length; i++) {
        let newCard = template.cloneNode(true);

        newCard.querySelector("#title").textContent = favorites[i].title;
        newCard.querySelector("#foodImg").src = favorites[i].imgPath;
        newCard.dataset.recipeid = favorites[i]._id;

        console.log(currentUser);
        if (currentUser.favorites.includes(favorites[i]._id)) {
            let button = newCard.querySelector(".button");
            button.classList.add("liked")
        }
        newCard.querySelector(".button").addEventListener("click", like);

        list.appendChild(newCard);
    }

    template.remove();
}

function like(){
    $(this).toggleClass("liked");
}