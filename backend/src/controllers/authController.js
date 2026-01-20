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

const tokenService = require("../services/tokenService");

exports.login = async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ erro: "Login e senha são obrigatórios!" });
  }

  try {
    // 1. Busca o usuário pelo login (ou email)
    const [usuarios] = await banco.query(
      "SELECT * FROM tb_usuario WHERE login = ? OR email = ?",
      [login, login],
    );

    // Se não achou ninguém
    if (usuarios.length === 0) {
      return res.status(401).json({ erro: "Login ou senha inválidos." });
    }

    const usuarioEncontrado = usuarios[0];

    // 2. Compara a senha enviada com a senha criptografada do banco
    const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Login ou senha inválidos." });
    }

    // 3. Se tudo deu certo, gera o Token
    const tokenAcesso = tokenService.gerarToken(usuarioEncontrado);

    // 4. Retorna os dados (sem a senha!)
    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token: tokenAcesso,
      usuario: {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome_usuario,
        tipo: usuarioEncontrado.tipo_usuario,
      },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao realizar login." });
  }
};

exports.obterPerfil = async (req, res) => {
  // req.usuario foi preenchido pelo Middleware
  res.status(200).json({
    mensagem: "Acesso autorizado!",
    dados_usuario: req.usuario,
  });
};
