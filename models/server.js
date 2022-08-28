const path = require("path");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config");

class Server {
   constructor() {
      this.app = express();
      this.port = process.env.PORT;
      this.paths = {
         users: "/api/clients",
         products: "/api/products",
         admin: "/api/admin",
      };
      this.connectionDB();
      this.middlewares();
      this.routes();
      this.listen();
   }

   async connectionDB() {
      await dbConnection();
   }

   middlewares() {
      this.app.use(cors());
      this.app.use(express.json());
      this.app.use(express.static(path.join(__dirname, "../public/")));
      this.app.use(
         fileUpload({
            useTempFiles: true,
            tempFileDir: "/tmp/",
         })
      );
   }

   routes() {
      this.app.use(this.paths.users, require("../routes/users.routes"));
      this.app.use(this.paths.products, require("../routes/products.routes"));
      this.app.use(this.paths.admin, require("../routes/admin.routes"));
   }

   listen() {
      this.app.listen(this.port, () => {
         console.log(`Servidor corriendo en el puerto ${this.port}`);
      });
   }
}

module.exports = Server;
