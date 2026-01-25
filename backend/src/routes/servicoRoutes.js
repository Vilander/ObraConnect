const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicoController");
const { verificarToken } = require("../middlewares/autenticacao");
const upload = require("../config/upload");

// Rota Pública: Qualquer um pode ver os serviços
router.get("/", servicoController.listarServicos);
router.get("/:id", servicoController.buscarPorId);

// Rota Protegida: Apenas quem tem token pode tentar criar
// (E o controller verifica se é prestador)
router.post(
  "/",
  verificarToken,
  upload.single("imagem"),
  servicoController.criarServico,
);

// Rota Protegida: Editar (precisa do ID na URL)
router.put("/:id", verificarToken, servicoController.editarServico);

// Rota Protegida: Deletar
router.delete("/:id", verificarToken, servicoController.deletarServico);

module.exports = router;
