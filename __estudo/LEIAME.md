# ObraConnect - Marketplace de Serviços de Construção Civil

## 📋 Descrição

Marketplace web de serviços de construção civil desenvolvido com React e Bootstrap 5. Conecta profissionais qualificados com clientes que precisam de serviços de obras e reformas.

## 🎨 Paleta de Cores

O projeto utiliza as seguintes cores personalizadas:

- **Amarelo**: `#fee63e`
- **Amarelo Ouro**: `#fbd455`
- **Azul Claro**: `#b2c0e3`
- **Azul Marinho**: `#024768` (cor principal)
- **Branco**: `#fdfdfd`
- **Cinza**: `#858585`
- **Laranja Principal**: `#f16319`
- **Marrom Escuro**: `#7d4200`
- **Marrom Suave**: `#945b50`
- **Verde Escuro**: `#2d6617`
- **Vermelho Escuro**: `#b31816`
- **Vinho**: `#99302a`

## 🏗️ Estrutura do Projeto

```
/
├── App.jsx                          # Componente principal da aplicação
├── componentes/                     # Pasta com todos os componentes
│   ├── Cabecalho.jsx               # Cabeçalho com navegação
│   ├── Login.jsx                   # Tela de login e cadastro
│   ├── Inicio.jsx                  # Página inicial com listagem de serviços
│   ├── DetalheServico.jsx          # Página de detalhes do serviço
│   ├── CadastrarServico.jsx        # Formulário de cadastro de serviço
│   └── MinhasAvaliacoes.jsx        # Página de avaliações do usuário
├── styles/
│   └── globals.css                 # Estilos globais e variáveis CSS
└── LEIAME.md                       # Este arquivo
```

## 📦 Categorias de Serviços

O marketplace oferece 30 categorias de serviços:

1. Arquiteto(a)
2. Armador(a) de Ferragens
3. Azulejista / Pisagista
4. Bombeiro(a) Hidráulico / Encanador(a)
5. Calheiro(a)
6. Carpinteiro(a)
7. Desentupidor(a)
8. Designer de Interiores
9. Eletricista
10. Engenheiro(a) Civil
11. Gesseiro(a)
12. Impermeabilizador(a)
13. Instalador(a) de Ar Condicionado
14. Instalador(a) de Drywall
15. Instalador(a) de Gás
16. Instalador(a) de Sistemas de Segurança
17. Jardineiro(a) / Paisagista
18. Limpador(a) Pós-Obra
19. Marceneiro(a)
20. Marido de Aluguel
21. Mestre de Obras
22. Montador(a) de Andaimes
23. Montador(a) de Móveis
24. Terraplanagem
25. Pedreiro(a)
26. Pintor(a)
27. Serralheiro(a)
28. Técnico(a) em Edificações
29. Topógrafo(a)
30. Vidraceiro(a)

## ⚙️ Funcionalidades

### Autenticação
- ✅ Tela de login
- ✅ Tela de cadastro de usuário
- ✅ Proteção de rotas (páginas que exigem login)

### Página Inicial (Home)
- ✅ Listagem de serviços em cards
- ✅ Busca por nome de profissional, descrição ou categoria
- ✅ Filtro lateral por categoria (30 categorias)
- ✅ Botão de favoritar serviços
- ✅ Design responsivo (mobile e desktop)

### Detalhes do Serviço
- ✅ Informações completas do prestador
- ✅ Avaliações com notas detalhadas (Preço, Tempo, Higiene, Educação)
- ✅ Formulário para deixar avaliação
- ✅ Botão de contratar serviço
- ✅ Botão de favoritar

### Cadastro de Serviço
- ✅ Formulário completo de cadastro
- ✅ Seleção de múltiplas categorias
- ✅ Campos para informações de contato
- ✅ Dicas para um bom cadastro

### Minhas Avaliações
- ✅ Listagem de todas as avaliações do usuário
- ✅ Visualização de notas detalhadas
- ✅ Exclusão de avaliações
- ✅ Estatísticas das avaliações
- ✅ Acesso rápido à página do serviço avaliado

## 🔗 Integração com Backend

O projeto está preparado para integração com backend Node.js/Express e banco de dados MySQL. Todos os componentes possuem comentários `TODO` indicando onde conectar com as APIs.

### Rotas esperadas do Backend:

```javascript
// Autenticação
POST /login                          // Login de usuário
POST /criar-conta                    // Cadastro de novo usuário

// Serviços
GET /servicos                        // Listar todos os serviços
GET /servico/:id                     // Buscar serviço específico
POST /servicos/cadastrar             // Cadastrar novo serviço
POST /servico/:id/contratar          // Solicitar contratação

// Avaliações
GET /avaliacoes                      // Buscar avaliações do usuário logado
POST /avaliacoes                     // Criar nova avaliação
DELETE /avaliacoes/:id               // Excluir avaliação

// Favoritos
POST /favoritos                      // Adicionar/remover favorito
```

### Estrutura de Dados Esperada:

#### Serviço
```javascript
{
  id: number,
  nomePrestador: string,
  descServico: string,
  categorias: string[],
  imagem: string,
  notaMedia: number,
  totalAvaliacoes: number,
  telefoneContato: string,
  email?: string,
  dataCadastro: string
}
```

#### Avaliação
```javascript
{
  id: number,
  idUsuario: number,
  idServico: number,
  nomeUsuario: string,
  nomePrestador: string,
  notaPreco: number,           // 1-5
  notaTempoExecucao: number,   // 1-5
  notaHigiene: number,         // 1-5
  notaEducacao: number,        // 1-5
  comentario: string,
  dataAvaliacao: string
}
```

#### Usuário
```javascript
{
  nome: string,
  email: string,
  login: string,
  telefone?: string
}
```

## 🎯 Próximos Passos para Integração

1. **Configurar o Backend Node.js/Express**
   - Criar servidor Express
   - Configurar conexão com MySQL
   - Implementar rotas da API
   - Adicionar autenticação JWT

2. **Conectar o Frontend**
   - Descomentar as chamadas fetch() nos componentes
   - Substituir a URL `http://localhost:3000` pela URL do seu backend
   - Implementar gerenciamento de tokens de autenticação
   - Adicionar tratamento de erros

3. **Banco de Dados**
   - Criar as tabelas necessárias (usuários, serviços, categorias, avaliações, favoritos)
   - Popular com dados iniciais
   - Configurar relacionamentos

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto:
```bash
npm run dev
```

3. Acesse no navegador:
```
http://localhost:5173
```

## 📱 Responsividade

O projeto é totalmente responsivo e foi testado para:
- Desktop (1920x1080 e superior)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção de interfaces
- **Bootstrap 5** - Framework CSS para design responsivo
- **Lucide React** - Biblioteca de ícones
- **JavaScript (ES6+)** - Linguagem de programação
- **CSS Variables** - Para cores personalizadas

## 📝 Observações

- Todos os arquivos e variáveis estão em **português brasileiro (pt-BR)**
- O projeto usa **JavaScript puro (.jsx)** ao invés de TypeScript
- Dados mockados estão disponíveis para demonstração
- Comentários `TODO` indicam pontos de integração com backend
- Encoding: **UTF-8**

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração.

---

**Desenvolvido com ❤️ para conectar profissionais de construção civil**
