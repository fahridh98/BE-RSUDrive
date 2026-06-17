require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./src/config/database");
const createAdmin = require(
    "./src/seeders/createAdmin"
);

require("./src/models/index");

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database Connected");

    await sequelize.sync({
      force: true,
    });
    await createAdmin();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();