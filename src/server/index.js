const express = require("express");
const app = express();
const cors = require("cors");
const healthCheck = require("../routes/healthCheck");
const rastreio = require("../routes");

app.use(express.json());
app.use(cors());

//teste de rotas
app.use(healthCheck);

//rotas de rastreamento
app.use(rastreio);

module.exports = app;
