const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const keys = require('../../confign/keys');
const passport = require('passport');

const Joi = require('joi');
const { validateSignup } = require('../../Validations/Validator');
router.get('/routes', (req,res) => {
    res.json({notice:'user route works'})
});



router.post('/register', (req,res)=> {
    const {error} = validateSignup(req.body)
    if (error){
        console.log(error);
        return res.send(error.message)
    }
    
    
    User.findOne({ email: req.body.email })
        .then(user =>{
            if(user){
                return res.status(400).json({email: 'Email already exists'});
            }
            else{
                const avatar  = gravatar.url(req.body.email,{
                    s: '200',
                    d:'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(12, (err,salt) =>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user =>{
                            res.json(user)
                        }) .catch(err =>{console.log(err)})
                    })
                })
            }
        })
})

//User login (returning JWT token)

router.post('/login',(req,res)=>{
    
    const password = req.body.password;

    User.findOne({email: req.body.email}).then(user => {
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        
        //comparing user entered password with hashed password for a match
        bcrypt.compare(password,user.password).then(match=>{
            if(match){
               
                const payload = {id: user.id, name: user.name, avatar: user.avatar}
                jwt.sign(payload,keys.secretOrKey, { expiresIn: 7200 }, (err,token) =>{
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                });
            }
            //Token sign in
            else{
                return res.status(400).json({error:'incorrect password'});
            }
        })
    });
})

//Current user 

router.get('/current',passport.authenticate('jwt', { session: false }), (req,res)=>{
    res.json(req.user)
});

module.exports = router;
