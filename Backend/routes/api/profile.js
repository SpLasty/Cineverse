const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport');

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { validateProfile } = require('../../Validations/Validator');

//Load the user profile

//Post request to create/edit users profile
router.post('/',passport.authenticate('jwt', {session: false}), (req,res)=>{

    const {error} = validateProfile(req.body)
    if (error){
        console.log(error);
        return res.send(error.message)
    }

    const fields = {}
    //Include user details since they are not part of the form
    fields.user = req.user.id;
    //Checking to see if they were sent from the form then match it with profile
    if(req.body.username) fields.username = req.body.username;
    if(req.body.bio) fields.bio = req.body.bio;
    //Break it down into array as it will have separate values
    if(typeof req.body.genres !== 'undefined') {
        fields.genres = req.body.genres.split(','); // We are getting array instead of separated values in database
    }
    if(req.body.oneliner) fields.oneliner = req.body.oneliner;
    //initializing socials since its an object   
    fields.socials = {}
    if(req.body.twitter) fields.socials.twitter = req.body.twitter;
    if(req.body.reddit) fields.socials.reddit= req.body.reddit;
    if(req.body.date) fields.date = req.body.date;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: fields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create
        errors = {}
        // Check if handle exists
        Profile.findOne({ handle: fields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(fields).save().then(profile => res.json(profile));
        });
      }
    });
    
 
})




//Get request to current users profile
router.get('/',passport.authenticate('jwt', { session: false }), (req,res)=>{
     
     Profile.findOne({ user: req.user.id }).populate('user', ['name','avatar'])
    
    .then(profile =>{
        
      if (!profile) {
            return res.status(404).json({message: 'Profile does not exist'})
        }
        res.json(profile);
    })
    .catch(error =>{
        res.status(404).json(error)
    })
})

//Delete user and profiles
router.delete(
  '/', passport.authenticate('jwt', { session: false }), (req,res) =>{
    Profile.findOneAndRemove({ user: req.user.id})
    .then(() =>{
      User.findOneAndRemove({ _id: req.user.id})
        .then(()=>{
          res.json({message: 'Deletion Successful'})
        })
    })
  }
)
router.get('/routes', (req,res) => {
    res.json({notice:'Prof route works'})
});

module.exports = router;
