const banco = require("../config/database");

exports.criarServico = async (req, res) => {
  // Pegamos os dados do usuário logado (que o middleware colocou no req.usuario)
  const usuarioLogado = req.usuario;

  // 1. REGRA DE NEGÓCIO: Apenas prestadores podem criar serviços
  if (
    usuarioLogado.tipo_usuario !== "prestador" &&
    usuarioLogado.tipo_usuario !== "admin"
  ) {
    return res
      .status(403)
      .json({ erro: "Apenas prestadores podem cadastrar serviços!" });
  }

  const { titulo, descricao, valor, imagem, categorias } = req.body;

  // 2. Validação Básica
  if (!titulo || !descricao) {
    return res
      .status(400)
      .json({ erro: "Título e Descrição são obrigatórios." });
  }

  try {
    // 3. Insere o serviço no banco
    // O id_usuario vem do token (segurança), não do corpo da requisição
    const [resultado] = await banco.query(
      `INSERT INTO tb_servico (id_usuario, nome_prestador, desc_servico, imagem_url, data_cadastro) 
             VALUES (?, ?, ?, ?, NOW())`,
      [usuarioLogado.id, titulo, descricao, imagem],
    );

    const idNovoServico = resultado.insertId;

    // 4. (Opcional/Futuro) Aqui faríamos o vínculo com as categorias (tb_categoria_atendida)
    // Por enquanto, vamos focar em criar o serviço principal.

    res.status(201).json({
      mensagem: "Serviço criado com sucesso!",
      id_servico: idNovoServico,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar serviço." });
  }
};

// Função para listar todos os serviços (Pública)
exports.listarServicos = async (req, res) => {
  try {
    const [servicos] = await banco.query(`
            SELECT s.*, u.nome_usuario 
            FROM tb_servico s
            JOIN tb_usuario u ON s.id_usuario = u.id
        `);

    res.status(200).json(servicos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar serviços." });
  }
};
