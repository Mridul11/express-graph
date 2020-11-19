import express from "express";

const router = express.Router() ;

module.exports = { 
    index: router.get("/", (req, res) => res.send("Welcome to Home!")),
    about: router.get("/about", (req, res) => res.send("welcome to about page!")),
}



