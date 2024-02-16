import { Router } from "express";
import {ViewController} from "../controllers/views.controller.js"


const router = Router();

const publicAccess = (req,res,next) =>{
    if(req.session.user){
        return res.redirect('/');
    }
    next();
}

router.get("/", (req, res) => {
    res.render("register")
})

router.get("/products", ViewController.products) 

router.get("/carts", ViewController.carts)

router.get("/chat", ViewController.chat)

router.get('/usersregister', publicAccess, (req,res)=>{
    res.render('usersregister')
});

router.get('/login', publicAccess, (req,res)=>{
    res.render('login')
})


router.get("/resetPassword", (req,res)=>{
    res.render("resetPassword");
})


export default router;