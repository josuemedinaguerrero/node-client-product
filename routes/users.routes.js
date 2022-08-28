
const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, userPost, userPut, userDelete } = require('../controllers/users');
const { emailExist, paymentsAllowed, nameExist, existsById, phone_duplicated } = require('../helpers/validator_db');
const { updateUser } = require('../middlewares/update_fields');
const { validateFields } = require('../middlewares/validate_fields');
const { validateRol } = require('../middlewares/validate_rol');

const router = Router();

router.get('/', usersGet );

router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'The email is required').not().isEmpty(),
  check('email', 'The email is not valid').isEmail(),
  check('phone', 'The phone is required').not().isEmpty(),
  check('address', 'The address is required').not().isEmpty(),
  check('product', 'You must provide the product id').not().isEmpty(),
  check('product', 'Product - Not a valid mongo id').isMongoId(),  
  check('product').custom( id => existsById( id, 'Products' )),
  check('payment_method', 'The payment method is required').not().isEmpty(),
  check('payment_method').custom( payment => paymentsAllowed( payment )),
  check('email').custom( emailExist ),
  check('name').custom( name => nameExist( name, 'user' )),
  check('phone').custom( phone_duplicated ),
  validateFields
], userPost );

router.put('/:id', [
  check('id', 'Not a valid mongo id').isMongoId(),
  check('id').custom( id => existsById( id, 'User' )),
  updateUser,
  validateFields
], userPut );

router.delete('/:id', [
  check('email', 'The email is required').not().isEmpty(),
  check('email', 'The email is not valid').isEmail(),
  validateRol,
  check('id', 'Not a valid mongo id').isMongoId(),
  check('id').custom( id => existsById( id, 'User' )),
  validateFields
], userDelete )

module.exports = router;
