# 📡 Exemplos de Integração com API - Frontend

## 🔧 Configuração Inicial

### 1. Criar arquivo de configuração da API

Crie um arquivo `/configuracao/api.js`:

```javascript
// Configuração base da API
const API_BASE_URL = 'http://localhost:3000/api';

// Função auxiliar para fazer requisições
export const fazerRequisicao = async (endpoint, opcoes = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    const configuracao = {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...opcoes.headers,
      },
    };

    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, configuracao);
    
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.mensagem || erro.erro || 'Erro na requisição');
    }

    return await resposta.json();
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    throw erro;
  }
};

export default API_BASE_URL;
```

### 2. Gerenciamento de Autenticação

Crie um arquivo `/utilitarios/autenticacao.js`:

```javascript
// Salvar token e dados do usuário
export const salvarAutenticacao = (token, usuario) => {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
};

// Obter token
export const obterToken = () => {
  return localStorage.getItem('token');
};

// Obter dados do usuário
export const obterUsuario = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

// Verificar se está logado
export const estaAutenticado = () => {
  return !!localStorage.getItem('token');
};

// Limpar autenticação (logout)
export const limparAutenticacao = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};
```

## 📝 Exemplos de Uso nos Componentes

### Login.jsx - Versão Integrada

```javascript
import { useState } from 'react';
import { User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { fazerRequisicao } from '../configuracao/api';
import { salvarAutenticacao } from '../utilitarios/autenticacao';

export function Login({ realizarLogin }) {
  const [ehCadastro, setEhCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  
  const [dadosLogin, setDadosLogin] = useState({
    login: '',
    senha: ''
  });

  const [dadosCadastro, setDadosCadastro] = useState({
    login: '',
    senha: '',
    confirmarSenha: '',
    nomeUsuario: '',
    email: '',
    telefone: ''
  });

  const submeterLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagemErro('');
    
    try {
      const resposta = await fazerRequisicao('/login', {
        method: 'POST',
        body: JSON.stringify(dadosLogin)
      });

      // Salvar token e dados do usuário
      salvarAutenticacao(resposta.token, resposta.usuario);
      
      // Notificar componente pai
      realizarLogin(resposta.usuario);
      
    } catch (erro) {
      setMensagemErro(erro.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  const submeterCadastro = async (e) => {
    e.preventDefault();
    
    if (dadosCadastro.senha !== dadosCadastro.confirmarSenha) {
      setMensagemErro('As senhas não coincidem');
      return;
    }

    setCarregando(true);
    setMensagemErro('');
    
    try {
      const resposta = await fazerRequisicao('/criar-conta', {
        method: 'POST',
        body: JSON.stringify(dadosCadastro)
      });

      // Salvar token e dados do usuário
      salvarAutenticacao(resposta.token, resposta.usuario);
      
      // Notificar componente pai
      realizarLogin(resposta.usuario);
      
    } catch (erro) {
      setMensagemErro(erro.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5 bg-azul-claro">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="bg-white rounded shadow-lg p-4 p-md-5">
          {/* Mostrar mensagem de erro se houver */}
          {mensagemErro && (
            <div className="alert alert-danger" role="alert">
              {mensagemErro}
            </div>
          )}

          {/* ... resto do código do formulário ... */}
          
          <button
            type="submit"
            className="btn btn-laranja w-100 py-3 mt-2"
            disabled={carregando}
          >
            {carregando ? 'Carregando...' : (ehCadastro ? 'Criar Conta' : 'Entrar')}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Inicio.jsx - Versão Integrada

```javascript
import { Search, Star, Heart, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fazerRequisicao } from '../configuracao/api';

export function Inicio({ navegarPara, estaLogado }) {
  const [servicos, setServicos] = useState([]);
  const [servicosFiltrados, setServicosFiltrados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarServicos();
    if (estaLogado) {
      buscarFavoritos();
    }
  }, [estaLogado]);

  const buscarServicos = async () => {
    try {
      setCarregando(true);
      const dados = await fazerRequisicao('/servicos');
      setServicos(dados);
      setServicosFiltrados(dados);
    } catch (erro) {
      console.error('Erro ao buscar serviços:', erro);
      alert('Erro ao carregar serviços. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const buscarFavoritos = async () => {
    try {
      const dados = await fazerRequisicao('/favoritos');
      setFavoritos(dados.map(f => f.idServico));
    } catch (erro) {
      console.error('Erro ao buscar favoritos:', erro);
    }
  };

  const alternarFavorito = async (idServico) => {
    if (!estaLogado) {
      alert('Você precisa estar logado para favoritar serviços');
      return;
    }

    try {
      const ehFavorito = favoritos.includes(idServico);
      
      await fazerRequisicao('/favoritos', {
        method: ehFavorito ? 'DELETE' : 'POST',
        body: JSON.stringify({ idServico })
      });

      setFavoritos(anterior =>
        ehFavorito
          ? anterior.filter(id => id !== idServico)
          : [...anterior, idServico]
      );
    } catch (erro) {
      console.error('Erro ao alterar favorito:', erro);
      alert('Erro ao favoritar serviço. Tente novamente.');
    }
  };

  if (carregando) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-laranja-principal" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-cinza mt-3">Carregando serviços...</p>
        </div>
      </div>
    );
  }

  return (
    // ... resto do código ...
  );
}
```

### DetalheServico.jsx - Versão Integrada

```javascript
import { Star, Phone, Mail, Calendar, Heart, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fazerRequisicao } from '../configuracao/api';

export function DetalheServico({ idServico, navegarPara, estaLogado }) {
  const [servico, setServico] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mostrarFormularioAvaliacao, setMostrarFormularioAvaliacao] = useState(false);
  const [ehFavorito, setEhFavorito] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    notaPreco: 5,
    notaTempoExecucao: 5,
    notaHigiene: 5,
    notaEducacao: 5,
    comentario: ''
  });

  useEffect(() => {
    buscarDadosServico();
  }, [idServico]);

  const buscarDadosServico = async () => {
    try {
      setCarregando(true);
      
      // Buscar dados do serviço
      const dadosServico = await fazerRequisicao(`/servico/${idServico}`);
      setServico(dadosServico);
      
      // Buscar avaliações
      const dadosAvaliacoes = await fazerRequisicao(`/servico/${idServico}/avaliacoes`);
      setAvaliacoes(dadosAvaliacoes);
      
      // Verificar se é favorito (se estiver logado)
      if (estaLogado) {
        const favoritos = await fazerRequisicao('/favoritos');
        setEhFavorito(favoritos.some(f => f.idServico === idServico));
      }
      
    } catch (erro) {
      console.error('Erro ao buscar dados do serviço:', erro);
      alert('Erro ao carregar serviço. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const realizarContratacao = async () => {
    if (!estaLogado) {
      alert('Você precisa estar logado para contratar um serviço');
      navegarPara('login');
      return;
    }

    try {
      await fazerRequisicao(`/servico/${idServico}/contratar`, {
        method: 'POST'
      });
      
      alert('Solicitação de contratação enviada! O profissional entrará em contato em breve.');
    } catch (erro) {
      console.error('Erro ao contratar:', erro);
      alert('Erro ao enviar solicitação. Tente novamente.');
    }
  };

  const submeterAvaliacao = async (e) => {
    e.preventDefault();

    if (!estaLogado) {
      alert('Você precisa estar logado para avaliar um serviço');
      return;
    }

    try {
      setEnviandoAvaliacao(true);
      
      await fazerRequisicao('/avaliacoes', {
        method: 'POST',
        body: JSON.stringify({
          idServico,
          ...novaAvaliacao
        })
      });

      alert('Avaliação enviada com sucesso!');
      setMostrarFormularioAvaliacao(false);
      setNovaAvaliacao({
        notaPreco: 5,
        notaTempoExecucao: 5,
        notaHigiene: 5,
        notaEducacao: 5,
        comentario: ''
      });
      
      // Recarregar avaliações
      await buscarDadosServico();
      
    } catch (erro) {
      console.error('Erro ao enviar avaliação:', erro);
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-laranja-principal" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    // ... resto do código ...
  );
}
```

### CadastrarServico.jsx - Versão Integrada

```javascript
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { fazerRequisicao } from '../configuracao/api';

export function CadastrarServico({ navegarPara }) {
  const [dadosFormulario, setDadosFormulario] = useState({
    nomePrestador: '',
    descServico: '',
    email: '',
    telefoneContato: '',
    categoriasSelecionadas: []
  });
  const [enviando, setEnviando] = useState(false);

  const submeterFormulario = async (e) => {
    e.preventDefault();

    if (dadosFormulario.categoriasSelecionadas.length === 0) {
      alert('Por favor, selecione pelo menos uma categoria');
      return;
    }

    if (dadosFormulario.descServico.length < 50) {
      alert('A descrição deve ter no mínimo 50 caracteres');
      return;
    }

    try {
      setEnviando(true);
      
      await fazerRequisicao('/servicos/cadastrar', {
        method: 'POST',
        body: JSON.stringify(dadosFormulario)
      });

      alert('Serviço cadastrado com sucesso!');
      navegarPara('inicio');
      
    } catch (erro) {
      console.error('Erro ao cadastrar serviço:', erro);
      alert('Erro ao cadastrar serviço. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    // ... resto do código com botão disabled={enviando} ...
  );
}
```

### MinhasAvaliacoes.jsx - Versão Integrada

```javascript
import { Star, ArrowLeft, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fazerRequisicao } from '../configuracao/api';

export function MinhasAvaliacoes({ navegarPara }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarAvaliacoes();
  }, []);

  const buscarAvaliacoes = async () => {
    try {
      setCarregando(true);
      const dados = await fazerRequisicao('/avaliacoes');
      setAvaliacoes(dados);
    } catch (erro) {
      console.error('Erro ao buscar avaliações:', erro);
      alert('Erro ao carregar avaliações. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const excluirAvaliacao = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    try {
      await fazerRequisicao(`/avaliacoes/${id}`, {
        method: 'DELETE'
      });

      setAvaliacoes(avaliacoes.filter(av => av.id !== id));
      alert('Avaliação excluída com sucesso!');
    } catch (erro) {
      console.error('Erro ao excluir avaliação:', erro);
      alert('Erro ao excluir avaliação. Tente novamente.');
    }
  };

  if (carregando) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-laranja-principal" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    // ... resto do código ...
  );
}
```

## 🎨 Componente de Loading Reutilizável

Crie `/componentes/Carregando.jsx`:

```javascript
export function Carregando({ mensagem = 'Carregando...' }) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-laranja-principal mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">{mensagem}</span>
        </div>
        <p className="text-cinza">{mensagem}</p>
      </div>
    </div>
  );
}
```

## 🚨 Componente de Erro Reutilizável

Crie `/componentes/MensagemErro.jsx`:

```javascript
export function MensagemErro({ mensagem, aoFechar }) {
  if (!mensagem) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Erro!</strong> {mensagem}
      {aoFechar && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={aoFechar}
          aria-label="Fechar"
        />
      )}
    </div>
  );
}
```

## 📊 Hook Personalizado para Requisições

Crie `/hooks/usarRequisicao.js`:

```javascript
import { useState, useCallback } from 'react';
import { fazerRequisicao } from '../configuracao/api';

export function usarRequisicao() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const executar = useCallback(async (endpoint, opcoes = {}) => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await fazerRequisicao(endpoint, opcoes);
      return dados;
    } catch (err) {
      setErro(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  return { executar, carregando, erro };
}
```

Uso:

```javascript
const { executar, carregando, erro } = usarRequisicao();

const buscarServicos = async () => {
  try {
    const dados = await executar('/servicos');
    setServicos(dados);
  } catch (err) {
    // Erro já está no estado
  }
};
```

---

**Dica**: Sempre trate erros de forma adequada e forneça feedback visual ao usuário!
