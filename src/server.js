import {app} from "./app.js";

const PORT = 3000;

//our very first API endpoint!
// app.get('/', (req, res) => {
//   res.send("Hallo! I'm server aka your father!");
// });

app.listen(PORT, () => {
    console.log(`Your father is running on port ${PORT}!`);
});