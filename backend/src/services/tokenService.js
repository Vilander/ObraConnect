const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.gerarToken = (usuario) => {
  // O que vai escrito dentro do crachá (Token)
  const dadosToken = {
    id: usuario.id,
    login: usuario.login,
    email: usuario.email,
    tipo_usuario: usuario.tipo_usuario,
  };

  // Gera o token assinado com nosso SEGREDO
  // expiresIn: '24h' significa que o login dura 1 dia
  return jwt.sign(dadosToken, process.env.SEGREDO_JWT, {
    expiresIn: "24h",
  });
};
