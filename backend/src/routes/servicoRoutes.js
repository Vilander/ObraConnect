const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicoController");
const { verificarToken } = require("../middlewares/autenticacao");
const upload = require("../config/upload");

// --- 1. ROTAS ESPECÍFICAS  ---

// Meus Serviços (Precisa vir ANTES do /:id para não ser confundido com um ID)
router.get(
  "/meus-servicos",
  verificarToken,
  servicoController.listarMeusServicos,
);

// --- 2. ROTAS GERAIS E DINÂMICAS ---

// Listar todos os serviços (Pública)
router.get("/", servicoController.listarServicos);

// Buscar UM serviço específico pelo ID (Pública)
router.get("/:id", servicoController.buscarPorId);

// --- 3. ROTAS DE GERENCIAMENTO (POST, PUT, DELETE) ---

// Criar Serviço (Protegida + Upload de Imagem)
router.post(
  "/",
  verificarToken,
  upload.single("imagem"),
  servicoController.criarServico,
);

// Editar Serviço (Protegida)
router.put(
  "/:id",
  verificarToken,
  upload.single("imagem"),
  servicoController.editarServico,
);
// Deletar Serviço (Protegida)
router.delete("/:id", verificarToken, servicoController.deletarServico);

module.exports = router;
