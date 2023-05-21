let  form = document.getElementById("recipeForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();

    let data = {
        type: "newRecipe",
        title: document.getElementById("title").value,
        image: document.getElementById("image").value,
        description: document.getElementById("description").value,
        ingredients: document.getElementById("ingredients").value,
        procedure: document.getElementById("procedure").value,
        time: `${document.getElementById("durationh").value} timer ${document.getElementById("durationm").value} minuter`,
        workTime: `${document.getElementById("workdurationh").value} timer ${document.getElementById("workdurationm").value} minuter`,
        shelfLife: document.getElementById("shelfLife").value,
        servings: document.getElementById("servings").value,
        freezable: document.getElementById("freezable").value
    }

    fetch("/", {
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            console.log(response.statusText);
            throw new Error("Network response was not ok");
        }
        let res = response.json()
        return res;
    }).then(res => {

    }).catch(error => {
        console.error("Error sending PUT request:", error);
    });
});

let textareas = []
textareas.push(document.getElementById("ingredients"));
textareas.push(document.getElementById("description"));

textareas.forEach(textarea => {
    textarea.oninput = function() {
        textarea.style.height = "";
        textarea.style.height = textarea.scrollHeight + "px"
      };
});