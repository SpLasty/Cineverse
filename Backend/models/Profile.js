const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: 
      [{
        //Associate the user by ID
        type: Schema.Types.ObjectId,
        //Reference to the users collection
        ref: 'users'

    }]
  ,
    username:{
          type: String,
          required: true,
          max:20
    },
    bio:{
        type:String
    },
      genres:{
        type: String
      },
      location:{
        type: String
      },
      oneliner:{
        type: String
      },
      socials:{
        twitter:{
            type: String
        },
        reddit:{
            type: String
        }
      },
      date: {
        type: Date,
        default: Date.now
      }


})

module.exports = Profile = mongoose.model('profile', ProfileSchema)