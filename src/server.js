import express from "express";

const app = express();

//our very first API endpoint!
app.get('/', (req, res) => {
  res.send("Hallo! I'm server aka your father!");
});

app.listen(3000, () => {
    console.log("Your father is running on port 3000!");
});