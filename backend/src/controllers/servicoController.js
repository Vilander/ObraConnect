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

// EDITAR SERVIÇO
exports.editarServico = async (req, res) => {
    const { id } = req.params; // Pega o ID da URL (ex: /servicos/1)
    const { titulo, descricao, imagem } = req.body;
    const usuarioLogado = req.usuario;

    try {
        // 1. Verifica se o serviço existe e quem é o dono
        const [servicos] = await banco.query('SELECT * FROM tb_servico WHERE id = ?', [id]);
        
        if (servicos.length === 0) {
            return res.status(404).json({ erro: "Serviço não encontrado." });
        }

        const servico = servicos[0];

        // 2. REGRA DE SEGURANÇA: Só o dono pode mexer
        if (servico.id_usuario !== usuarioLogado.id && usuarioLogado.tipo_usuario !== 'admin') {
            return res.status(403).json({ erro: "Você não tem permissão para alterar este serviço." });
        }

        // 3. Atualiza no banco
        await banco.query(
            'UPDATE tb_servico SET nome_prestador = ?, desc_servico = ?, imagem_url = ? WHERE id = ?',
            [titulo, descricao, imagem, id]
        );

        res.status(200).json({ mensagem: "Serviço atualizado com sucesso!" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar serviço." });
    }
};

// DELETAR SERVIÇO (Soft Delete - Apenas desativa)
exports.deletarServico = async (req, res) => {
    const { id } = req.params;
    const usuarioLogado = req.usuario;

    try {
      const [servicos] = await banco.query(
        "SELECT * FROM tb_servico WHERE id = ?",
        [id],
      );

      if (servicos.length === 0) {
        return res.status(404).json({ erro: "Serviço não encontrado." });
      }

      if (
        servicos[0].id_usuario !== usuarioLogado.id &&
        usuarioLogado.tipo_usuario !== "admin"
      ) {
        return res
          .status(403)
          .json({ erro: "Você não tem permissão para deletar este serviço." });
      }

      // "Soft Delete": Não apagamos de verdade (DELETE), apenas desativamos (UPDATE) para manter histórico
      await banco.query("UPDATE tb_servico SET ativo = 0 WHERE id = ?", [id]);

      res.status(200).json({ mensagem: "Serviço removido com sucesso!" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao deletar serviço." });
    }
};