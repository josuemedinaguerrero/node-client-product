const { response, request } = require("express");
const Product = require("../models/product");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// Get Products
const productoGet = async (req = request, res = response) => {
   const { from = 0, limit = 10 } = req.query;
   const query = { state: true };

   const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).skip(Number(from)).limit(Number(limit)),
   ]);

   res.json({
      total: `Total active products: ${total}`,
      products,
   });
};

// Post Product
const productPost = async (req = request, res = response) => {
   const { name, description, price, img } = req.body;
   const product = new Product({ name, description, price, img });

   // Save to database
   await product.save();

   res.json({
      product_created: product,
   });
};

// Put Product
const productPut = async (req = request, res = response) => {
   const { id } = req.params;
   const { name, description, available, price, state } = req.body;
   const product_id = await Product.findById(id);

   if (price) {
      if (isNaN(price)) {
         return res.status(400).json({
            msg: "Values not allowed, please enter numbers",
         });
      }
   }

   if (req.files.archivo) {
      if (product_id.img) {
         const nombreArr = product_id.img.split("/");
         const nombre = nombreArr[nombreArr.length - 1];
         const [public_id] = nombre.split(".");
         cloudinary.uploader.destroy(public_id);
      }
      const { tempFilePath } = req.files.archivo;
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
      product_id.img = secure_url;
      await product_id.save();
   }

   const data = {
      name: name ? name : product_id.name,
      price: price ? price : product_id.price,
      state: state ? state : product_id.state,
      description: description ? description : product_id.description,
      available: available ? available : product_id.available,
   };

   const product = await Product.findByIdAndUpdate(id, data);

   res.json({
      product_updated: product,
   });
};

// Delete Product
const productDelete = async (req = request, res = response) => {
   const { id } = req.params;
   const product = await Product.findByIdAndUpdate(id, {
      state: false,
      available: false,
   });

   res.json({
      product_deleted: product,
   });
};

module.exports = {
   productoGet,
   productPost,
   productPut,
   productDelete,
};
