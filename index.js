require("dotenv").config();

const app = require("./src/server/index");

app.listen(process.env.PORT);
