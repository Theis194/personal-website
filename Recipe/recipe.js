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
        this.ingredients = ingredients; /*  Expects list of ingredients */
        this.procedure = procedure; /*  Expects string */
    }
}

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
    console.log(recipe);

    //return {test: "test", test2: "test2"};  // this returns the object to the website
    // This needs to return true if input is valid
    // and return an object stating what is wrong
}