const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verificarToken = (req, res, next) => {
  // 1. Busca o token no cabeçalho da requisição (Header)
  // O formato esperado é: "Bearer <token_aqui>"
  const cabecalhoAuth = req.headers["authorization"];

  // Se não tiver cabeçalho, barra na hora
  if (!cabecalhoAuth) {
    return res
      .status(401)
      .json({ erro: "Acesso negado. Token não fornecido." });
  }

  // 2. Separa a palavra "Bearer" do token em si
  // Divide "Bearer eyJhb..." em ["Bearer", "eyJhb..."]
  const token = cabecalhoAuth.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ erro: "Acesso negado. Formato de token inválido." });
  }

  try {
    // 3. Verifica se o token é válido usando nossa SENHA SECRETA
    const verificado = jwt.verify(token, process.env.SEGREDO_JWT);

    // 4. Se for válido, coloca os dados do usuário dentro da requisição
    req.usuario = verificado;

    // 5. "Pode passar": chama a próxima função (next)
    next();
  } catch (erro) {
    res.status(403).json({ erro: "Token inválido ou expirado." });
  }
};
