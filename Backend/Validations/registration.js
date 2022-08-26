const Validator = require('validator');

module.exports = function validateInput(input){
    var errors = {};

    if(!Validator.isLength(input.name, {min:5, max: 20})){
        errors.name = 'Name must have atleast 2 and atmax 20 characters'
    }
    return{
        errors,
        isValid: errors
    }

}