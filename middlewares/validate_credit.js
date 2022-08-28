
const { response, request } = require('express');

const validate_credit = async( req = request, res = response, next ) => {
  const { available_credit } = req.body;

  if ( available_credit !== true && available_credit !== false ) {
     return res.status(400).json({
        msg: 'Wrong credit update. Only boolean parameters will be accepted.'
     })
  }
  
  next();
}

module.exports = {
  validate_credit
}
