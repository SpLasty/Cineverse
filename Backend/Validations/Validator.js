const Joi = require('joi');


const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).max(15).required(),
})
const profileSchema = Joi.object({
  username: Joi.string().required(),
  bio: Joi.string(),
  genres: Joi.string(),
  location: Joi.string(),
  oneliner: Joi.string(),
  twitter: Joi.string().uri(),
  reddit: Joi.string().uri(),
})

const DiscussionSchema = Joi.object({
  text:Joi.string().min(3).max(250).required(),
})

exports.validateSignup = validator(signUpSchema) ;
exports.validateProfile = validator(profileSchema) ;
exports.validateDiscussion = validator(DiscussionSchema);