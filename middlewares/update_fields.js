
const { response, request } = require('express');
const Users = require('../models/user')

const updateUser = async( req = request, res = response, next ) => {
  const { name, phone, address, payment_method } = req.body;

  // Update name
  if ( name ) {
    if ( name.length === 0 ) {
      return res.status(400).json({
        msg: 'Name is not valid'
      })
    }
    const nameExist = await Users.findOne({ name });
    if ( nameExist ) {
      return res.status(400).json({
        msg: 'The user with that name already exists'
      })
    }
  }

  // Update phone
  if ( phone ) {
    if ( phone.length === 0 ) {
      return res.status(400).json({
        msg: 'Phone is not valid'
      })
    }  
  }

  // Update address
  if ( address ) {
    if ( address.length === 0 ) {
      return res.status(400).json({
        msg: 'Address is not valid'
      })
    }  
  }

  // Update payment method
  if ( payment_method ) {
    if ( payment_method.length === 0 ) {
      return res.status(400).json({
        msg: 'Payment method is not valid'
      })
    }  
  }
  
  next();
}

module.exports = {
  updateUser
}
