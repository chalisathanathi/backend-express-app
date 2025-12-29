import {app} from "./app.js";
import { connectDB } from "./config/mongodb.js";

const PORT = 3000;

//our very first API endpoint!
// app.get('/', (req, res) => {
//   res.send("Hallo! I'm server aka your father!");
// });

try {
    await connectDB()
    app.listen(PORT, () => {
    console.log(`Your father is running on port ${PORT} \(@^0^@)/!`);
    });
} catch (error) {
    console.error("Startup failed (ﾟДﾟ*)ﾉ", error);
    process.exit(1) //มีไว้ให้มันหยุดรันเวลา error หรือปิดโปรแกรม
};