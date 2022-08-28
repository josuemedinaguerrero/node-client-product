const { Router } = require("express");
const { check } = require("express-validator");
const {
   productoGet,
   productPost,
   productPut,
   productDelete,
} = require("../controllers/products");
const { nameExist, existsById } = require("../helpers/validator_db");
const { validateFields } = require("../middlewares/validate_fields");

const router = Router();

router.get("/", productoGet);

router.post(
   "/",
   [
      check("name", "Name is required").not().isEmpty(),
      check("img", "Image is required").not().isEmpty(),
      check("name").custom((name) => nameExist(name, "product")),
      check("description", "The description is required").not().isEmpty(),
      check("state", "State is required").not().isEmpty(),
      validateFields,
   ],
   productPost
);

router.put(
   "/:id",
   [
      check("id", "Not a valid mongo id").isMongoId(),
      check("id").custom((id) => existsById(id, "Product")),
      validateFields,
   ],
   productPut
);

router.delete(
   "/:id",
   [
      check("id", "Not a valid mongo id").isMongoId(),
      check("id").custom((id) => existsById(id, "Product")),
      validateFields,
   ],
   productDelete
);

module.exports = router;
