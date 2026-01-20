const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verificarToken } = require("../middlewares/autenticacao");

// Quando chegar um POST em /registro, chama o controlador
router.post("/registro", authController.registrarUsuario);
router.post("/login", authController.login);
router.get("/perfil", verificarToken, authController.obterPerfil);

module.exports = router;
