export {User};

class User {
    constructor (fName, lName, email, password) {
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.password = password;
        this.favorites = [];
        this.privileges = [];
        this.userToken = getToken();
    }

    getToken() {
        const rand = () => {
            return Math.random().toString(36).substring(2);
        };
    
        const token = () => {
            return rand() + rand();
        };
    
        console.log(token());
    }
}

