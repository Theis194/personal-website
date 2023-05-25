export { inputValidation, validateObject, isEmail }

function inputValidation(input, expected) {
    if (input === undefined || input === null) {
        return false
    }

    if (expected === "str") {
        if (isNaN(input)) {
            return typeof input === "string";
        }
    } if (expected === "num") {
        return (!isNaN(input) && !isNaN(parseFloat(input)));
    } if (expected === "bool") {
        return typeof input === "boolean";
    } if (expected === "obj") {
        return typeof input === 'object';
    }
    return false;
}

function validateObject(object, valKeys) {
    let inputFailed = [];
    let i = 0;
    for (const key in object) {
        if (valKeys[i] !== "skip") {
            if (!inputValidation(object[key], valKeys[i])) {
                inputFailed.push(`${key}`)
            }
        }
        i++;
    }
    return inputFailed;
}

function isEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}