# ✅ CHECKLIST FINAL - Conversão Tailwind to Bootstrap

## 🎯 Verificação Pré-Deploy

Antes de fazer deploy da sua aplicação, execute este checklist:

---

## 📋 Checklist de Verificação Técnica

### 1. **Dependências & Build**

- [ ] Executou `npm install` no frontend
- [ ] Executou `npm run dev` sem erros
- [ ] Nenhuma mensagem de erro sobre Tailwind
- [ ] Nenhuma mensagem de erro sobre módulos não encontrados
- [ ] O servidor rodou em `http://localhost:3000` (ou porta configurada)

### 2. **CSS & Imports**

- [ ] `index.css` tem apenas Bootstrap e CSS customizado
- [ ] Bootstrap CDN está comentado ou removido de comentário se necessário
- [ ] Variáveis CSS do `:root` estão intactas
- [ ] Nenhuma referência a `@tailwindcss` nos arquivos
- [ ] Nenhuma referência a `@import "tailwindcss"`

### 3. **HTML**

- [ ] `index.html` contém script Bootstrap CDN
- [ ] Script está APÓS o arquivo React principal
- [ ] Sem erros de suporte do navegador

### 4. **Componentes - Navegação**

- [ ] Navbar aparece corretamente
- [ ] Logo e nome "ObraConnect" visível
- [ ] Botão toggle mobile funciona (clica e abre menu)
- [ ] Links de navegação funcionam
- [ ] Dropdown de usuário abre e fecha
- [ ] Botão "Login" está visível para não logado
- [ ] Cores estão corretas (azul marinho fundo)

### 5. **Componentes - Login/Cadastro**

- [ ] Página de login carrega
- [ ] Formulário renderiza corretamente
- [ ] Inputs têm placeholder visível
- [ ] Botão "Entrar" está laranja
- [ ] Link "Cadastre-se aqui" funciona
- [ ] Ao clicar em cadastro, muda para formulário de cadastro
- [ ] Campos de cadastro aparecem (nome, email, etc)
- [ ] Checkbox "Quero oferecer meus serviços" está visível
- [ ] Botão "Criar Conta" funciona
- [ ] Ao fazer login/cadastro, redireciona para início

### 6. **Componentes - Início/Home**

- [ ] Seção hero aparece com background azul claro
- [ ] Título "Encontre os Melhores Profissionais" está visível
- [ ] Barra de busca funciona
- [ ] Grid de serviços renderiza (com placeholders se vazio)
- [ ] Cards aparecem com:
  - [ ] Imagem do serviço
  - [ ] Nome do prestador
  - [ ] Descrição (truncada em 2 linhas)
  - [ ] Rating com estrelas
  - [ ] Botão "Ver Detalhes"
  - [ ] Botão de favoritar (coração)
- [ ] Filtros aparecem no desktop (escondidos no mobile)
- [ ] Botão "Filtros" aparece no mobile
- [ ] Responsividade:
  - [ ] 320px (mobile) - 1 coluna
  - [ ] 768px (tablet) - 2 colunas
  - [ ] 1024px+ (desktop) - 3 colunas

### 7. **Componentes - Detalhe Serviço**

- [ ] Abre ao clicar em "Ver Detalhes"
- [ ] Header azul marinho com informações do serviço
- [ ] Imagem e descrição do serviço aparecem
- [ ] Avaliações renderizam corretamente
- [ ] Formulário de avaliação aparece (se logado)
- [ ] Botão WhatsApp está funcional
- [ ] Preço visível no header

### 8. **Componentes - Cadastro de Serviço** (Se logado e prestador)

- [ ] Abre pela navbar "Anunciar Serviço"
- [ ] Título "Anuncie seu Serviço" visível
- [ ] Formulário com campos:
  - [ ] Título (input text)
  - [ ] Categoria (select dropdown)
  - [ ] Descrição (textarea)
  - [ ] Upload de imagem (drag & drop area)
- [ ] Botão "Publicar Serviço" funciona
- [ ] Upload de imagem mostra preview
- [ ] Redirecionará para início após sucesso

### 9. **Componentes - Meus Serviços** (Se logado e prestador)

- [ ] Abre na navbar dropdown do usuário
- [ ] Título "Gerenciar Meus Anúncios" visível
- [ ] Grid de serviços renderiza
- [ ] Cada card mostra:
  - [ ] Imagem
  - [ ] Título
  - [ ] Descrição truncada
  - [ ] Botão "Editar"
  - [ ] Botão "Excluir"
- [ ] Botão "+ Novo Serviço" abre cadastro
- [ ] Botões funcionam corretamente

### 10. **Componentes - Editar Serviço**

- [ ] Abre ao clicar "Editar" em um serviço
- [ ] Formulário pré-preenchido com dados
- [ ] Preview de imagem atual
- [ ] Pode mudar imagem
- [ ] Botão "Salvar Alterações" funciona
- [ ] Volta para "Meus Serviços" após salvar

### 11. **Componentes - Minhas Avaliações** (Se logado e prestador)

- [ ] Abre na navbar dropdown do usuário
- [ ] Header com estatísticas:
  - [ ] Total de avaliações
  - [ ] Média de notas
- [ ] Lista de avaliações renderiza:
  - [ ] Nome do avaliador
  - [ ] Data da avaliação
  - [ ] Notas (preço, tempo, higiene, educação)
  - [ ] Comentário
- [ ] Se sem avaliações, mostra mensagem vazia

### 12. **Diálogos/Modais**

- [ ] Alert dialog aparece para avisos
- [ ] Confirmação dialog aparece para ações destrutivas
- [ ] Botão "Confirmar" e "Cancelar" funcionam
- [ ] Overlay escuro funciona (clica para fechar)
- [ ] Animação suave de entrada/saída

### 13. **Responsividade Geral**

- [ ] Mobile (375px):
  - [ ] Navbar colapsada
  - [ ] Menu abre/fecha corretamente
  - [ ] Textos legíveis
  - [ ] Touches funcionam
  - [ ] Sem overflow horizontal
- [ ] Tablet (768px):
  - [ ] 2 colunas de cards
  - [ ] Menu expandido
  - [ ] Layout balanceado
- [ ] Desktop (1024px+):
  - [ ] 3-4 colunas de cards
  - [ ] Filtros na lateral
  - [ ] Layout completo

### 14. **Performance & Console**

- [ ] Abra Developer Tools (F12)
- [ ] Aba "Console":
  - [ ] Nenhum erro vermelho
  - [ ] Nenhum warning sobre Tailwind
  - [ ] Nenhum warning "undefined is not a function"
- [ ] Aba "Network":
  - [ ] CSS carregado do CDN
  - [ ] JS Bundle carregado
  - [ ] Imagens carregam corretamente
- [ ] Aba "Lighthouse":
  - [ ] Score > 80 em Performance

### 15. **Cores & Estilos Visuais**

- [ ] Cores customizadas aplicadas corretamente:
  - [ ] Azul marinho (#0B213E) em navbar/headers
  - [ ] Laranja (#FF6600) em botões CTA
  - [ ] Azul claro (#E6F3FF) em backgrounds
  - [ ] Cinza (#666666) em textos secundários
  - [ ] Amarelo (#FFD700) em estrelas/ratings
- [ ] Botões têm estado hover visível
- [ ] Bordas e sombras estão sutis
- [ ] Espaçamento consistente

### 16. **Animações**

- [ ] Spinner de loading gira suavemente
- [ ] Transições de página são suaves
- [ ] Hover effects em cards funcionam

### 17. **Funcionalidades de API**

- [ ] Pode fazer login (chama `/api/auth/login`)
- [ ] Pode cadastrar (chama `/api/auth/registro`)
- [ ] Pode buscar serviços (chama `/api/servicos`)
- [ ] Pode criar serviço (chama `POST /api/servicos`)
- [ ] Pode editar serviço (chama `PUT /api/servicos/:id`)
- [ ] Pode deletar serviço (chama `DELETE /api/servicos/:id`)
- [ ] Pode enviar avaliação (chama `POST /api/avaliacoes`)
- [ ] Pode buscar avaliações (chama `/api/avaliacoes/servico/:id`)
- [ ] Erros de API mostram mensagens corretas

### 18. **Autenticação**

- [ ] Token salvo em localStorage
- [ ] Usuário salvo em localStorage
- [ ] Logout limpa localStorage
- [ ] Página de login esconde navbar
- [ ] Botões de ação mostram apenas se logado
- [ ] Logout redireciona para início como visitante

### 19. **Validações**

- [ ] Login sem credenciais mostra erro
- [ ] Cadastro com senhas diferentes mostra erro
- [ ] Upload de arquivo valida tipo
- [ ] Campos obrigatórios validam

### 20. **Cross-Browser**

- [ ] Chrome/Chromium ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Edge ✅

---

## 🐛 Se Encontrar Problemas

### Problema: "Bootstrap is not defined"

**Checklist:**

- [ ] Script Bootstrap no final de index.html
- [ ] CDN link correto
- [ ] Sem typos na URL
- [ ] npm install executado
      → **Solução**: Re-add bootstrap script ou `npm install bootstrap`

### Problema: Estilos não aplicando

**Checklist:**

- [ ] index.css importa Bootstrap primeiro
- [ ] Classes Bootstrap estão corretas (sem typos)
- [ ] !important nos CSS custom se necessário
- [ ] Sem conflitos com classes antigas
      → **Solução**: Limpe cache (Ctrl+Shift+Delete) e recarregue

### Problema: Componentes não aparecem

**Checklist:**

- [ ] API backend rodando em http://localhost:3001
- [ ] CORS habilitado no backend
- [ ] Token sendo enviado correto
- [ ] Console mostra erros
      → **Solução**: Verifique logs do backend

### Problema: Menu mobile não abre

**Checklist:**

- [ ] Script Bootstrap included
- [ ] Atributo `data-bs-toggle="collapse"`
- [ ] ID do collapse correto
- [ ] Nenhum CSS conflitante
      → **Solução**: Inspecione elementos no DevTools

---

## 🚀 Build para Produção

Após validar tudo:

```bash
npm run build
```

Irá gerar pasta `build/` pronta para deploy.

---

## ✨ Pontos Críticos para Lembrar

1. **Bootstrap DEVE estar importado** antes de qualquer outro CSS
2. **Script Bootstrap DEVE estar** no final do HTML (após React)
3. **Não use mais classes Tailwind** - apenas Bootstrap e custom
4. **Variáveis CSS funcionam** tanto com Tailwind quanto Bootstrap
5. **Mobile first** - Bootstrap é responsivo por padrão

---

## 📊 Assinatura de Qualidade

```
✅ HTML semântico
✅ CSS organizado
✅ JavaScript limpo
✅ Responsivo
✅ Acessível
✅ Performance otimizada
✅ Sem dependências desnecessárias
✅ Pronto para produção
```

---

## 🎉 Pronto para Deploy!

Se todas as caixas estão ✅, sua aplicação está:

```
✨ PRONTA PARA PRODUÇÃO ✨
```

---

**Data de Criação**: 6 de fevereiro de 2026
**Versão**: 1.0
**Status**: FINAL ✅
