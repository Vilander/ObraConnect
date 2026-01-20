const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Quando chegar um POST em /registro, chama o controlador acima
router.post("/registro", authController.registrarUsuario);

module.exports = router;
