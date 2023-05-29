// Get the current URL
let currentUrl = window.location.href;

console.log(currentUrl.split("?")[1]); // Gets the query

fetch(`/getRecipe?id=${currentUrl.split("?")[1]}`, {method: "GET"})
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => console.error(error));