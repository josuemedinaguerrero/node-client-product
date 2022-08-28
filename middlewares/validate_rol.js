
const { request, response } = require('express');
const Users = require('../models/user');

const validateRol = async( req = request, res = response, next ) => {
   const { email } = req.body;
   const user = await Users.findOne({ email });
   if ( user ) {
      if ( user.rol !== 'ADMIN_ROLE' ) {
         return res.status(400).json({
            msg: 'Only an administrator can delete data'
         })
      }
   }
   
   next();
}

module.exports = {
  validateRol
}
