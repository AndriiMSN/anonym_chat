require("dotenv").config();
// @ts-ignore
const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect(
                process.env.DB
            )
            .then(() => {
                console.log("database connection successful");
            })
            .catch((err: string) => {
                console.log("database connection error " + err);
            });
    }
}

module.exports = new Database();
