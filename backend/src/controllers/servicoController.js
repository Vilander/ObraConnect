const banco = require("../config/database");

// =========================================================
// 1. MÉTODOS DE LEITURA (Públicos e Listagens)
// =========================================================

// Listar todos os serviços (Pública)
exports.listarServicos = async (req, res) => {
  try {
    const [servicos] = await banco.query(`
      SELECT s.*, u.nome_usuario 
      FROM tb_servico s
      JOIN tb_usuario u ON s.id_usuario = u.id
      ORDER BY s.id DESC
    `);

    res.status(200).json(servicos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar serviços." });
  }
};

// Buscar um serviço específico pelo ID (Pública)
exports.buscarPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [servicos] = await banco.query(
      `
      SELECT s.*, u.nome_usuario, u.email, u.telefone 
      FROM tb_servico s
      JOIN tb_usuario u ON s.id_usuario = u.id
      WHERE s.id = ?
      `,
      [id],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    res.status(200).json(servicos[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar detalhes do serviço." });
  }
};

// Listar apenas serviços do usuário logado
exports.listarMeusServicos = async (req, res) => {
  const usuarioLogado = req.usuario;

  try {
    const [servicos] = await banco.query(
      `
      SELECT * FROM tb_servico 
      WHERE id_usuario = ?
      ORDER BY id DESC
      `,
      [usuarioLogado.id],
    );

    res.status(200).json(servicos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar seus serviços." });
  }
};

// =========================================================
// 2. MÉTODOS DE ESCRITA (Criar, Editar, Deletar)
// =========================================================

// Criar novo serviço
exports.criarServico = async (req, res) => {
  const usuarioLogado = req.usuario;

  // Validação de Permissão
  if (
    usuarioLogado.tipo_usuario !== "prestador" &&
    usuarioLogado.tipo_usuario !== "admin"
  ) {
    return res
      .status(403)
      .json({ erro: "Apenas prestadores podem cadastrar serviços!" });
  }

  const arquivo = req.file;
  const { titulo, descricao } = req.body; // Removi 'valor' que não estamos usando no banco

  if (!titulo || !descricao) {
    return res
      .status(400)
      .json({ erro: "Título e Descrição são obrigatórios." });
  }

  // Caminho da Imagem
  let caminhoImagem = null;
  if (arquivo) {
    caminhoImagem = `http://localhost:3001/uploads/${arquivo.filename}`;
  }

  try {
    const [resultado] = await banco.query(
      `INSERT INTO tb_servico (id_usuario, nome_prestador, titulo, desc_servico, imagem_url, data_cadastro) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [usuarioLogado.id, usuarioLogado.nome, titulo, descricao, caminhoImagem],
    );

    res.status(201).json({
      mensagem: "Serviço criado com sucesso!",
      id_servico: resultado.insertId,
      imagem: caminhoImagem,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar serviço." });
  }
};

// Atualizar serviço (PUT)
exports.editarServico = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao } = req.body;
  const usuarioLogado = req.usuario;

  try {
    // 1. Verifica existência
    const [servicos] = await banco.query(
      "SELECT * FROM tb_servico WHERE id = ?",
      [id],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    // 2. Verifica permissão (Dono)
    if (servicos[0].id_usuario !== usuarioLogado.id) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para editar este serviço." });
    }

    // 3. Monta Query Dinâmica
    let sql = "UPDATE tb_servico SET titulo = ?, desc_servico = ?";
    let params = [titulo, descricao];

    if (req.file) {
      const imagemUrl = `http://localhost:3001/uploads/${req.file.filename}`;
      sql += ", imagem_url = ?";
      params.push(imagemUrl);
    }

    sql += " WHERE id = ?";
    params.push(id);

    await banco.query(sql, params);

    res.status(200).json({ mensagem: "Serviço atualizado com sucesso!" });
  } catch (erro) {
    console.error("Erro SQL:", erro);
    res
      .status(500)
      .json({ erro: "Erro ao atualizar serviço no banco de dados." });
  }
};

// Deletar serviço (DELETE)
exports.deletarServico = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.usuario;

  try {
    // 1. Verifica existência
    const [servicos] = await banco.query(
      "SELECT * FROM tb_servico WHERE id = ?",
      [id],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    // 2. Verifica permissão (Dono ou Admin)
    if (
      servicos[0].id_usuario !== usuarioLogado.id &&
      usuarioLogado.tipo_usuario !== "admin"
    ) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para deletar este serviço." });
    }

    // 3. Deleta de verdade (Para garantir que suma da lista)
    await banco.query("DELETE FROM tb_servico WHERE id = ?", [id]);

    res.status(200).json({ mensagem: "Serviço removido com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao deletar serviço." });
  }
};
