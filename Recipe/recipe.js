import { validateObject } from "../http/inputValidation.js";
import { insertEntry } from "../database/databaseHandler.js";

export { createNewRecipe }

class Recipe {
    constructor(title, description, imgPath, time, workTime, shelfLife, servings, freezable, ingredients, procedure) {
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
    "skip"
]

class Ingredient{
    constructor (amount, unit, type) {
        this.amount = amount;
        this.unit = unit;
        this.type = type;
    }

    static combine() {
        return `${amount} ${unit} ${type}`;
    }
}

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
        data.procedure
    )

    insertEntry("recipes", newRecipe);
    
    return result;

    //return {test: "test", test2: "test2"};  // this returns the object to the website
    // This needs to return true if ingredients is valid
    // and return an object stating what is wrong
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
        const [key, value] = line.trim().split('+');
        const decodedValue = decodeURIComponent(value);
        return { key, value: decodedValue };
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

//console.log(extractIngredients("a").length);

/*  Converts any string containing a number to a number
let num = "3.1415";
console.log(+num);
 */