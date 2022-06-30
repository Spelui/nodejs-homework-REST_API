require("dotenv").config();
const app = require("./app");
const { dbConnection } = require("./db/dbConnection");

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnection();

    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

start();
