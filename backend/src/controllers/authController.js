const banco = require("../config/database");
const bcrypt = require("bcryptjs");

exports.registrarUsuario = async (req, res) => {
  // 1. Recebe os dados do formulário
  const { nome_usuario, email, senha, login, tipo_usuario } = req.body;

  // 2. Validação simples: tudo foi preenchido?
  if (!nome_usuario || !email || !senha || !login) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  try {
    // 3. Verifica se usuário já existe
    const [usuariosExistentes] = await banco.query(
      "SELECT * FROM tb_usuario WHERE email = ? OR login = ?",
      [email, login],
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ erro: "Usuário ou Email já cadastrados." });
    }

    // 4. CRIPTOGRAFIA bcrypt
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // 5. Define tipo de usuário (padrão 'usuario' se não vier nada)
    const tipoFinal = tipo_usuario || "usuario";

    // 6. Insere no banco com a senha SEGURA
    const [resultado] = await banco.query(
      "INSERT INTO tb_usuario (nome_usuario, email, senha, login, tipo_usuario, data_cadastro) VALUES (?, ?, ?, ?, ?, NOW())",
      [nome_usuario, email, senhaCriptografada, login, tipoFinal],
    );

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      id_usuario: resultado.insertId,
      usuario: nome_usuario,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar usuário." });
  }
};
