const banco = require("../config/database");

// CRIAR NOVA AVALIAÇÃO
exports.criarAvaliacao = async (req, res) => {
  const usuarioLogado = req.usuario;
  const {
    id_servico,
    nota_preco,
    nota_tempo,
    nota_higiene,
    nota_educacao,
    comentario,
  } = req.body;

  // 1. Validação: Notas devem ser de 1 a 5
  if (nota_preco < 1 || nota_preco > 5 || nota_tempo < 1 || nota_tempo > 5) {
    return res.status(400).json({ erro: "As notas devem ser entre 1 e 5." });
  }

  try {
    // 2. Verifica se o usuário JÁ avaliou este serviço (Evitar duplicidade)
    const [existente] = await banco.query(
      "SELECT * FROM tb_avaliacao WHERE id_servico = ? AND id_usuario = ?",
      [id_servico, usuarioLogado.id],
    );

    if (existente.length > 0) {
      return res.status(409).json({ erro: "Você já avaliou este serviço!" });
    }

    // 3. Insere a avaliação
    await banco.query(
      `INSERT INTO tb_avaliacao 
            (id_servico, id_usuario, nota_preco, nota_tempo_execucao, nota_higiene, nota_educacao, comentario, data_avaliacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id_servico,
        usuarioLogado.id,
        nota_preco,
        nota_tempo,
        nota_higiene,
        nota_educacao,
        comentario,
      ],
    );

    // 4. MÁGICA: Recalcula a média do serviço e atualiza a tabela tb_servico
    // A média é: (soma das 4 notas) / 4
    await banco.query(
      `
            UPDATE tb_servico SET 
                nota_media = (
                    SELECT AVG((nota_preco + nota_tempo_execucao + nota_higiene + nota_educacao) / 4)
                    FROM tb_avaliacao WHERE id_servico = ?
                ),
                total_avaliacoes = (
                    SELECT COUNT(*) FROM tb_avaliacao WHERE id_servico = ?
                )
            WHERE id = ?
        `,
      [id_servico, id_servico, id_servico],
    );

    res.status(201).json({ mensagem: "Avaliação enviada com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao salvar avaliação." });
  }
};

// LISTAR AVALIAÇÕES DE UM SERVIÇO
exports.listarAvaliacoes = async (req, res) => {
  const { id_servico } = req.params;

  try {
    const [avaliacoes] = await banco.query(
      `
            SELECT a.*, u.nome_usuario 
            FROM tb_avaliacao a
            JOIN tb_usuario u ON a.id_usuario = u.id
            WHERE a.id_servico = ?
            ORDER BY a.data_avaliacao DESC
        `,
      [id_servico],
    );

    res.status(200).json(avaliacoes);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar avaliações." });
  }
};
