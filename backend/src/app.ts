import express, { Request, Response } from "express";
export const app = express();
import CookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { router as AuthRouter } from "./routers/authRoute.js";
import { router as BookmarkRouter } from "./routers/bookmarkRoute.js";
import { router as AIRouter } from "./routers/openSourceAIRoute.js";
import { IUser } from "./models/userModel.js";
import { sendCookiesAndToken } from "./utils/sendCookiesAndToken.js";
import { isAuthenticated } from "./controllers/authController.js";

app.use(CookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: [
      "chrome-extension://hnkkilabceccplfgaecdbmoegeppcbgj/",
      "http://localhost:5173",
      "*",
    ],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true,
  })
);

if (!process.env.SESSION_SECRET) {
  throw new Error("Express Session for Passport is Invalid");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.authenticate("session"));
app.use("/auth", AuthRouter);
app.use("/api", BookmarkRouter);
app.use("/ai", AIRouter);
app.get("/", async (req: Request, res: Response) => {
  res.send("Server is Up and Running");
});
// login success router

app.get("/login/success", async (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user) {
    const user = req.user as IUser;
    await sendCookiesAndToken(user, res);
    res.redirect("http://localhost:5173/");
  } else {
    res.redirect("/login");
  }
});

app.get("/login/twitter/success", async (req: Request, res: Response) => {
  const userData = JSON.stringify(req.user, undefined, 2);
  res.end(`<h1>Authentication succeeded</h1> User data: <pre>${userData}</pre>`);
});
app.get("/login/hello", isAuthenticated, (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user) {
    const user = req.user as IUser;
    res.send(`Welcome ${user.displayName}`);
  } else {
    res.redirect("/login");
  }
});

app.get("/bookmark", isAuthenticated, async (req: Request, res: Response) => {
  const response = await fetch("https://api.x.com/2/users/manzil_rahul/bookmarks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  res.send(data);
});
