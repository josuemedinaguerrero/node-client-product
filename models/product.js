const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
   name: {
      type: String,
      require: [true, "Name is required"],
   },
   state: {
      type: Boolean,
      default: true,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true,
      default: 0,
   },
   available: {
      type: Boolean,
      default: true,
   },
   img: {
      type: String,
   },
});

ProductSchema.methods.toJSON = function () {
   const { __v, _id, ...product } = this.toObject();
   product.uid = _id;
   return product;
};

module.exports = model("Product", ProductSchema);
