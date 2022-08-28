const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
   name: {
      type: String,
      require: [true, "Name is required"],
      unique: true,
   },
   email: {
      type: String,
      require: [true, "Email is required"],
      unique: true,
   },
   phone: {
      type: String,
      require: [true, "Phone number is required"],
      unique: false,
   },
   date_birth: {
      type: String,
   },
   address: {
      type: String,
      required: true,
   },
   img: {
      type: String,
   },
   rol: {
      type: String,
      require: true,
      default: "CLIENT_ROLE",
      emun: ["CLIENT_ROLE", "ADMIN_ROLE"],
   },
   state: {
      type: Boolean,
      default: true,
   },
   product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
   },
   date_of_purchase: {
      type: Date,
      default: new Date().toUTCString(),
   },
   payment_method: {
      type: String,
      required: true,
      emun: [
         "Cash payment",
         "Credit or debit card",
         "Check",
         "Promissory notes",
         "Paypal",
         "Payment with wirtual currencies",
      ],
   },
   available_credit: {
      type: Boolean,
      default: false,
   },
});

UsuarioSchema.methods.toJSON = function () {
   const { __v, _id, ...user } = this.toObject();
   user.uid = _id;
   return user;
};

module.exports = model("Usuario", UsuarioSchema);
