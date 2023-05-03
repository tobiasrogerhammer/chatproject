const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const cors = require("cors");
const getcontent = require("./getContent");
const getUser = require("./getuser");

const app = express();
const db = "mongodb+srv://tobias:3EZkUJgct3QLHau@cluster0.v5e8lmx.mongodb.net/test";
const port = 5000;

mongoose.set("strictQuery", false);
mongoose.connect(db, {});
mongoose.connect("mongodb+srv://tobias:3EZkUJgct3QLHau@cluster0.v5e8lmx.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Chatapp"
    })
    .then(console.log("Connected to mongoDB"))
    .catch((err) => console.log(err));

app.use(express.json());


app.use(
	cors({
		origin: "http://localhost:3000", 
		methods: "GET,POST,PUT,DELETE",
		credentials: true
	})
);

app.use("/get", getcontent)
app.use("/user", getUser)

app.listen(port, () => {
	console.log(`Backend server listening on port ${port}`);
});