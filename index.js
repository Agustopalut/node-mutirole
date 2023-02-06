import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/productRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
const app = express();
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db, //mengconnect db nya
});

// (async () => {
//   await db.sync();
//   console.log("database conected");
// })();
dotenv.config();
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store, //menyertakan store nya.dengan ini maka meski server nya di restart,user yang sudah login tetap bisa mendapatkan datanya,dan tak perlu login kembali
    cookie: {
      secure: "auto", //aritnya auto,mengituki protocol nya,kalau https,maka akan menjadi true;
    },
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
// store.sync(); //membuat table session
app.listen(process.env.APP_PORT, () => console.log("server up and running"));
