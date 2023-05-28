export {User};

class User {
    constructor (fName, lName, email, password) {
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.password = password;
        this.favorites = [];
        this.privileges = []; // Author, Admin, ...
        this.userToken = this.getToken();
    }

    getToken() {
        const rand = () => {
            return Math.random().toString(36).substring(2);
        };
    
        const token = () => {
            return rand() + rand();
        };
    
        return token();
    }
}

