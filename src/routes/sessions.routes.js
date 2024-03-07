import {Router} from "express";
import { SessionController } from "../controllers/sessions.controller.js"
import { GetUserDto } from "../dao/dto/user.dto.js";
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

router.get('/current', SessionController.currentUser);

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}),SessionController.github);

router.get('/logout',SessionController.logout);

router.post("/restartPassword", SessionController.restartPassword);

router.get("/current", (req, res) => {
    try {
      if (req.session && req.session.user) {
        const userDTO = new GetUserDto(req.session.user);
        res.status(200).json({
          status: "success",
          user: userDTO
        });
      } else {
        res.status(401).json({
          status: "error",
          message: "No hay sesión de usuario activa"
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener el usuario actual"
      });
    }
  });


export default router;