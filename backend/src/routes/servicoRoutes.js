const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicoController");
const { verificarToken } = require("../middlewares/autenticacao");

// Rota Pública: Qualquer um pode ver os serviços
router.get("/", servicoController.listarServicos);

// Rota Protegida: Apenas quem tem token pode tentar criar
// (E o controller verifica se é prestador)
router.post("/", verificarToken, servicoController.criarServico);

module.exports = router;
