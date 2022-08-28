const { response, request } = require("express");
const Users = require("../models/user");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// Get Users
const usersGet = async (req = request, res = response) => {
   const { from = 0, limit = 10 } = req.query;
   const query = { state: true };

   const [total, users] = await Promise.all([
      Users.countDocuments(query),
      Users.find(query)
         .skip(Number(from))
         .limit(Number(limit))
         .populate("product", "name"),
   ]);

   res.json({
      total: `Total active clients: ${total}`,
      users,
   });
};

// Post User
const userPost = async (req = request, res = response) => {
   const {
      name,
      email,
      phone,
      date_birth,
      address,
      rol,
      product,
      date_of_purchase,
      payment_method,
   } = req.body;
   const user = new Users({
      name,
      email,
      phone,
      date_birth,
      address,
      rol,
      product,
      date_of_purchase,
      payment_method,
   });
   if (rol) {
      if (rol !== "CLIENT_ROLE" && rol !== "ADMIN_ROLE") {
         return res.status(400).json({
            msg: "Invalid role. Allowed roles: 'ADMIN_ROLE', 'CLIENT_ROLE'",
         });
      }
   }

   // Save to database
   await user.save();

   res.json({
      user_created: user,
   });
};

// Put User
const userPut = async (req = request, res = response) => {
   const { id } = req.params;
   const { name, phone, address, payment_method } = req.body;
   const user_id = await Users.findById(id);

   if (req.files.archivo) {
      if (user_id.img) {
         const nombreArr = user_id.img.split("/");
         const nombre = nombreArr[nombreArr.length - 1];
         const [public_id] = nombre.split(".");
         cloudinary.uploader.destroy(public_id);
      }
      const { tempFilePath } = req.files.archivo;
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
      user_id.img = secure_url;
      await user_id.save();
   }

   const data = {
      name: name ? name : user_id.name,
      phone: phone ? phone : user_id.phone,
      address: address ? address : user_id.phone,
      payment_method: payment_method ? payment_method : user_id.payment_method,
   };

   const user = await Users.findByIdAndUpdate(id, data);

   res.json({
      user_updated: user,
   });
};

// Delete User
const userDelete = async (req = request, res = response) => {
   const { id } = req.params;
   const user = await Users.findByIdAndUpdate(id, { state: false });

   res.json({
      user_deleted: user,
   });
};

module.exports = {
   usersGet,
   userPost,
   userPut,
   userDelete,
};
