const { response, request } = require("express");
const Users = require("../models/user");

// Get Users
const adminGet = async (req = request, res = response) => {
   const { from = 0, limit = 10, credit = 1 } = req.query;

   const query = {
      state: true,
      available_credit: credit == 1 ? true : false,
   };

   const [total, users] = await Promise.all([
      Users.countDocuments(query),
      Users.find(query)
         .skip(Number(from))
         .limit(Number(limit))
         .populate("product", "name"),
   ]);

   res.json({
      total: `Total customers with available credit: ${total}`,
      users,
   });
};

// Put User
const adminPut = async (req = request, res = response) => {
   const { id } = req.params;
   const { available_credit } = req.body;

   const user = await Users.findByIdAndUpdate(id, { available_credit });

   res.json({
      user_updated: user,
   });
};

module.exports = {
   adminGet,
   adminPut,
};
