const express = require("express");
// const { validateClientRequest } = require('../middlewares/clientsMiddleware');
const { rastrearEncomenda, receberAtualizações } = require("../controllers/rastreamento");

const rastreio = express();

rastreio.get('/rastrear', rastrearEncomenda);

rastreio.get('/whatsapp', receberAtualizações);


module.exports = rastreio;

