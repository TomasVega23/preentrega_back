import userModel from "../dao/models/users.model.js";
import { createHash, validatePassword } from "../utils.js";
import jwt from "jsonwebtoken";

class SessionController{
    static usersregister = async (req, res)=>{
        res.send({status:"success",message:"Usuario regsitrado",payload:req.user._id})
    }
    static login = async (req, res)=>{
            const serializedUser ={
                id: req.user._id,
                name : `${req.user.first_name} ${req.user.last_name}`,
                role: req.user.rol,
                email:req.user.email
            };
            const token = jwt.sign(serializedUser, 'CodeerSecret',{expiresIn:"1h"});
            console.log(token);
            res.cookie('coderCookie',token,{maxAge:3600000}).send({
                status:"succes",
                payload:serializedUser
            })
        }
    static github = async (req, res)=>{
            req.session.user = req.user;
            res.redirect("/products")
        }
    
    static logout = async (req, res)=>{
            req.session.destroy(err=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        error: 'No se pudo desloguear'
                    })
                }
                res.redirect('/login')
            })
    }
    static restartPassword = async (req,res)=>{
        const {email,password} = req.body;
        if(!email || !password) return res.status(400).send(
            res.send({
                status:"error",
                message:"Datos incorrectos"
            })
        )
        const user = await userModel.findOne({email});
        if(!user) return res.status(400).send(
            res.send({
                status:"error",
                message:"No existe el usuario"
            })
        )
        const newHashPassword = createHash(password);
    
        await userModel.updateOne({_id:user._id},{$set:{password:newHashPassword}});
        res.send({
            status:"success",
            message:"contraseña restaurada"
        })
    }
    static currentUser = async (req,res)=>{
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: "No se pudo autenticar el usuario",
                    error: err || info
                });
            }
            res.json({ user: req.user });
        })(req, res);
    };    
    
}


export {SessionController}