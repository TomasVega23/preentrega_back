import {Router} from "express";
import { SessionController } from "../controllers/sessions.controller.js"
import passport from "passport"


const router = Router();

router.post("/usersregister", 
    passport.authenticate("register",{passReqToCallback:true, session:false, failureRedirect:'api/sessions/failedRegister',
        failureMessage:true}),
            SessionController.usersregister
);

router.get("/failedRegister", (req,res)=>{
    console.log('Mal registro');
    res.send("Fallo en el registro")
})

router.post("/login",
    passport.authenticate("login",{failureRedirect:"api/sessions/failedLogin",
        session:false}),
            SessionController.login
);

router.get("/failedLogin", (req,res)=>{
    console.log('Mal Login');
    res.send("Fallo en el Login")
})

router.get("/current", SessionController.current);

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}),SessionController.github);

router.get('/logout',SessionController.logout);

router.post("/restartPassword", SessionController.restartPassword);


export default router;