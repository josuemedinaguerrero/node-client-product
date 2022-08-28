
const { Router } = require('express');
const { check } = require('express-validator');
const { adminGet, adminPut } = require('../controllers/admin');
const { existsById, creditAvailable } = require('../helpers/validator_db');
const { validate_credit } = require('../middlewares/validate_credit');
const { validateFields } = require('../middlewares/validate_fields');

const router = Router();

router.get('/', adminGet );

router.put('/:id', [
  check('id', 'Not a valid mongo id').isMongoId(),
  check('id').custom( id => existsById( id, 'User' )),
  check('available_credit', 'Credit is required').not().isEmpty(),
  validate_credit,
  validateFields
], adminPut );

module.exports = router;
