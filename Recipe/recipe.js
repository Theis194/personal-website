import { validateObject } from "../http/inputValidation.js";
import { insertEntry } from "../database/databaseHandler.js";

export { createNewRecipe }

class Recipe {
    constructor(title, description, imgPath, time, workTime, shelfLife, servings, freezable, ingredients, procedure, author) {
        this.title = title /*  Expects: string */
        this.description = description; /*  Expects: string */
        this.imgPath = imgPath; /*  Expects: string */
        this.time = time; /*  Expects: string (1 hour 30 min) */
        this.workTime = workTime; /*  Expects: string (1 hour 30 min) */
        this.shelfLife  = shelfLife; /*  Expects int in days */
        this.servings = servings; /*  Expects int */
        this.freezable = freezable; /*  Expects bool */
        this.procedure = procedure; /*  Expects string */
        this.ingredients = ingredients; /*  Expects list of ingredients */
        this.author = author; /* Expects string */
    }
}

let recipeValKeys = [
    "str",
    "str",
    "str",
    "skip",
    "str",
    "skip",
    "skip",
    "skip",
    "skip",
    "num",
    "num",
    "skip",
    "str"
]

function createNewRecipe(recipe) {
    let result = [];
    // Step 1: Split the string by '&'
    const keyValuePairs = recipe.split('&');

    // Step 2-4: Extract key-value pairs and store them in an object
    const data = {};
    for (let i = 0; i < keyValuePairs.length; i++) {
    const [key, value] = keyValuePairs[i].split('=');
    data[key] = value;
    }

    data.image = decodeURIComponent(data.image);
    data.description = decodeURIComponent(data.description);
    data.description = data.description.split("+").join(" ");
    data.procedure = decodeURIComponent(data.procedure);
    data.procedure = data.procedure.split("+").join(" ");

    data.ingredients = extractIngredients(data.ingredients);
    if (data.ingredients.length <= 0) {
        result.push("ingredients");
    }

    switch (data.freezable) {
        case "ja":
            data.freezable = true;
            break;
        case "nej":
                data.freezable = true;
                break;
        case "na":
            data.freezable = null;
            break;
    }
    result = result.concat(validateObject(data, recipeValKeys));

    let newRecipe = new Recipe(
        data.title, 
        data.description, 
        data.image,
        getDuration(data.durationHours, data.durationMinutes),
        getDuration(data.workdurationHours, data.workdurationMinutes),
        +data.shelfLife,
        +data.servings,
        data.freezable,
        data.ingredients,
        data.procedure,
        data.author
    )
    // Need to check if result contains anything before inserting
    if (result.length > 0) {
        return result;
    }
    insertEntry("recipes", newRecipe);
}

function extractIngredients(ingredients) {
    const markerRegex = /---(.*?)---([\s\S]*?)(?=\n---|$)/g;

    let match;
    const extractedData = [];

    const decodedInput = decodeURIComponent(ingredients);

    while ((match = markerRegex.exec(decodedInput)) !== null) {
    const sectionName = match[1];
    const sectionText = match[2].trim();

    const extractedLines = sectionText.split('\n');
    const sectionData = extractedLines.map(line => {
        const [key, value, unit] = line.trim().split('+');
        const decodedValue = decodeURIComponent(value);
        return { key, value: decodedValue, unit };
    });

    extractedData.push({ sectionName, data: sectionData });
    }

    return  extractedData;
}

function getDuration(durHours, durMinutes) {
    let result = ``;
    if (!+durHours<= 0 || !+durMinutes <= 0) {
        if (+durHours > 1) {
            result += `${durHours} timer `
        } else if (+durHours > 0 && +durHours <= 1) {
            result += `${durHours} time `
        }
        if (+durMinutes> 1) {
            result += `${durMinutes} minutter`
        } else if (+durMinutes > 0 && +durMinutes <= 1) {
            result += `${durMinutes} minut`
        }
    }
    return result;
}

let testString = `---vand---
vand 2 liter
vand 3 liter
vand 4 liter
---sand---
sand 2 kilo
sand 3 kilo
sand 4 kilo`;

//console.log(extractIngredients("---vand---%0D%0Avand+2+liter"));

let obj = {
    title: "a",
    image: "b",
    description: "c",
    ingredients: [
    ],
    procedure: "1",
    durationHours: "2",
    durationMinutes: "3",
    workdurationHours: "4",
    workdurationMinutes: "5",
    shelfLife: "6",
    servings: "e",
    freezable: true,
  }

/*  Converts any string containing a number to a number
let num = "3.1415";
console.log(+num);
 */