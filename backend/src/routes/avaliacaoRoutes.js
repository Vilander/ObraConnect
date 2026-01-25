const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");
const { verificarToken } = require("../middlewares/autenticacao");

// Criar avaliação (Precisa estar logado)
router.post("/", verificarToken, avaliacaoController.criarAvaliacao);

router.get("/recebidas", verificarToken, avaliacaoController.listarRecebidas);
// Ver avaliações de um serviço (Público)
// Exemplo de uso: /api/avaliacoes/servico/1
router.get("/servico/:id_servico", avaliacaoController.listarAvaliacoes);

module.exports = router;
