const Users = require("../models/user");
const Products = require("../models/product");

const emailExist = async (email = "") => {
   if (email) {
      const emaildb = await Users.findOne({ email });
      if (emaildb) {
         throw new Error(`The email ${email} is already registered`);
      }
   }
};

const nameExist = async (name = "", type = "") => {
   if (type === "user") {
      if (name) {
         const namedb = await Users.findOne({ name });
         if (namedb) {
            throw new Error("User with that name already exists");
         }
      }
   } else {
      if (name) {
         const namedb = await Products.findOne({ name });
         if (namedb) {
            throw new Error("Product with that name already exists");
         }
      }
   }
   return true;
};

const existsById = async (id, type = "") => {
   let exist;
   if (type === "User") {
      exist = await Users.findById(id);
      if (!exist) {
         throw new Error(`There is no user with id: ${id}`);
      }
   } else {
      exist = await Products.findById(id);
      if (!exist) {
         throw new Error(`There is no product with id: ${id}`);
      }
   }

   if (exist.state === false) {
      throw new Error(`${type} with id ${id} is inactive`);
   }

   return true;
};

const paymentsAllowed = (payment) => {
   const types_of_payments = [
      "Cash payment",
      "Credit or debit card",
      "Check",
      "Promissory notes",
      "Paypal",
      "Payment with wirtual currencies",
   ];
   const include = types_of_payments.includes(payment);
   if (!include) {
      throw new Error(
         `The payment method "${payment}" is not available or is not correct. Payments methods available: ${types_of_payments.join(
            ", "
         )}`
      );
   }
   return true;
};

const phone_duplicated = async (phone = "") => {
   const user_phone = await Users.findOne({ phone });
   if (user_phone) {
      throw new Error("Phone number already registered, type another");
   }
};

module.exports = {
   emailExist,
   nameExist,
   existsById,
   paymentsAllowed,
   phone_duplicated,
};
