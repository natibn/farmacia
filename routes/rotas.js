const { Router } = require('express');
const { login } = require('../controllers/segurancaController');
const { rotasCategorias } = require('./rotasCategorias');
const { rotasProdutos } = require('./rotasProdutos');

const rotas = new Router();

rotas.route("/login").post(login)  

rotas.use(rotasCategorias, rotasProdutos);

module.exports = rotas;
