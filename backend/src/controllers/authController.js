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

  try {
    // 1. Busca o usuário pelo login ou email
    const [usuarios] = await banco.query(
      "SELECT * FROM tb_usuario WHERE login = ? OR email = ?",
      [login, login],
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }

    const usuario = usuarios[0];

    // 2. Verifica a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }

    // 3. Gera o Token
    const token = tokenService.gerarToken(usuario);

    // 4. Retorna o Token e os dados do usuário
    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome_usuario,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
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

// PROMOVER USUÁRIO A PRESTADOR
exports.tornarPrestador = async (req, res) => {
  const usuarioLogado = req.usuario; // Vem do token atual

  try {
    // 1. Atualiza no Banco
    await banco.query(
      'UPDATE tb_usuario SET tipo_usuario = "prestador" WHERE id = ?',
      [usuarioLogado.id],
    );

    // 2. Busca os dados atualizados do usuário para gerar novo token
    const [usuarios] = await banco.query(
      "SELECT * FROM tb_usuario WHERE id = ?",
      [usuarioLogado.id],
    );
    const usuarioAtualizado = usuarios[0];

    // 3. Gera um NOVO TOKEN (com o cargo "prestador" dentro dele)
    const novoToken = tokenService.gerarToken(usuarioAtualizado);

    res.status(200).json({
      mensagem: "Parabéns! Agora você é um prestador.",
      token: novoToken,
      usuario: {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome_usuario,
        tipo_usuario: "prestador",
      },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar perfil." });
  }
};
