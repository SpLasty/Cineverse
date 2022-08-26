const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport');
const User = require('../../models/User')
const Discussion = require('../../models/Discussion');
const Profile = require('../../models/Profile');
const { validateDiscussion } = require('../../Validations/Validator');

//Test route
router.get('/routes', (req,res) => {
    res.json({notice:'discuss route works'})
});


//Discussion route
router.post('/', passport.authenticate('jwt', { session: false}), (req,res) =>{
    const {error} = validateDiscussion(req.body)
    if (error){
        console.log(error);
        return res.send(error.message)
    }
    const newDiscussion = new Discussion({
        user: req.user.id,
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
    });

    newDiscussion.save().then(discussion => res.json(discussion));

});


//Fetch single discussion post by id

router.get('/:id', (req,res)=>{
    Discussion.findById(req.params.id)
        .then(discussion => res.json(discussion))
        .catch(error => {
            res.status(404).json({message: 'post not found'})
        })
})


//Fetch all discussion public posts

router.get('/', (req,res)=>{
    Discussion.find()
        .sort({date: -1})
        .then(discussion => res.json(discussion))
        .catch(error => {
            res.status(404).json({error: 'Unable to retrieve all posts'})
        })
})

//Update Posts

//Delete post by id

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req,res) =>{
    //The postmaker has to delete the post
    Profile.findOne({ user: req.user.id })
        .then(profile =>{
            Discussion.findById(req.params.id)
                .then(discussion =>{
                    if(discussion.user.toString() != req.user.id){
                        return res.status(401).json({ message: 'Unauthorized access' })

                    }
                    discussion.remove().then(() => res.json({ message: 'Deletion Successful'}))
                })
                .catch(error => res.status(404).json({ message: 'Unable to find the post'}))
        })
})

//Like route

router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req,res) =>{
    //The postmaker has to delete the post
    Profile.findOne({ user: req.user.id })
        .then(profile =>{
            Discussion.findById(req.params.id)
                .then(discussion =>{
                   if(discussion.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                    return res.status(400).json({ error: 'Cannot like more than once'});
                   }
                   discussion.likes.push({ user: req.user.id });
                   discussion.save().then(discussion =>{
                    res.json(discussion)
                   })
                })
                .catch(error => res.status(404).json({ message: 'Unable to find the post'}))
        })
})

//Adding Comment Route

router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req,res) =>{
    Discussion.findById(req.params.id)
        .then(discussion => {
            const newComment = {
                text: req.body.text,
                name:req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
            discussion.comments.push(newComment);
            
            discussion.save().then(discussion => res.json(discussion))
        })
        .catch(error => {
            res.status(404).json({ message : 'Unable to find a post'})
        })
})



//Remove comments

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req,res) =>{
    Discussion.findById(req.params.id)
        .then(discussion => {
            if (discussion.comments.filter(comment => comment._id.toString()=== req.params.comment_id).length ===0){
                return res.status(404).json({ message : 'Unable to find the comment'});
            }

            const removeIndex = discussion.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
            
                discussion.comments.splice(removeIndex,1);

                discussion.save().then(discussion => {
                    res.json(discussion)
                })

            
        })
        .catch(error => {
            res.status(404).json({ message : 'Unable to find a post'})
        })
})




module.exports = router;
