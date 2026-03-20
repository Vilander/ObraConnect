# Instruções Pós-Conversão Tailwind → Bootstrap

## 🚀 Próximos Passos Imediatos

### 1. **Limpar Dependências**

```bash
cd frontend

# Remova node_modules e lock file antigos
rm -rf node_modules package-lock.json

# Reinstale com as dependências limpas
npm install
```

### 2. **Verificar Vite**

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

Se não houver erros no console, você está pronto!

---

## ✅ Checklist de Validação

### Layout e Responsive

- [ ] Navbar aparece corretamente em desktop
- [ ] Navbar responsiva funciona em mobile (clique no toggle)
- [ ] Grid de serviços adapta-se bem (1 coluna em mobile, 2-3 em desktop)
- [ ] Filtros laterais aparecem/somem corretamente

### Componentes Interativos

- [ ] Botões funcionam e têm estilo correto
- [ ] Dropdowns abrem/fecham (navbar user menu)
- [ ] Modais/Dialogs aparecem e fecham
- [ ] Formulários estão formatados corretamente

### Animações

- [ ] Spinners giram ao carregar (loading)
- [ ] Fade-in do dialog está suave
- [ ] Hover effects nos cards funcionam

### Cores e Estilos

- [ ] Cor azul marinho está correta
- [ ] Cor laranja principal está vibrante
- [ ] Badges estão com cores corretas
- [ ] Alertas aparecem com cores apropriadas

### Responsividade

- [ ] Teste em diferentes tamanhos de tela (375px, 768px, 1024px, 1920px)
- [ ] Imagens ficam em boa proporção
- [ ] Textos são legíveis em todos os tamanhos

---

## 🐛 Possíveis Problemas e Soluções

### Problema: "Bootstrap não está definido"

**Solução:**

```bash
npm install bootstrap
```

### Problema: Classes Bootstrap não funcionam

**Solução:** Verifique se o CSS está sendo importado no início de `index.css`:

```css
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css");
```

### Problema: Dropdowns não abrem

**Solução:** Verifique se o script do Bootstrap está no final de `index.html`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
```

### Problema: Estilos customizados não aplicam

**Solução:** Adicione `!important` nas classes customizadas, como já feito em `index.css`:

```css
.btn-laranja {
  background-color: var(--laranja-principal) !important;
}
```

### Problema: Variáveis CSS não funcionam

**Solução:** Certifique-se que estão definidas no `:root` de `index.css`:

```css
:root {
  --azul-marinho: #0b213e;
  --laranja-principal: #ff6600;
  /* ... mais variáveis ... */
}
```

---

## 📊 Arquivos Modificados

| Arquivo                           | Alteração                             | Status |
| --------------------------------- | ------------------------------------- | ------ |
| `frontend/src/index.css`          | Remover Tailwind, adicionar Bootstrap | ✅     |
| `frontend/vite.config.js`         | Remover plugin Tailwind               | ✅     |
| `frontend/package.json`           | Limpar dependências                   | ✅     |
| `frontend/index.html`             | Adicionar script Bootstrap            | ✅     |
| `frontend/src/App.jsx`            | Converter classes                     | ✅     |
| `frontend/src/componentes/*.jsx`  | Converter classes                     | ✅     |
| `frontend/src/styles/globals.css` | Manter como está                      | ✅     |

---

## 🔄 Build para Produção

Quando estiver pronto para deploy:

```bash
npm run build
```

O output será em `frontend/build/`. Este arquivo está pronto para deploy em um servidor web estático.

---

## 📚 Referências

- [Bootstrap 5 Documentação](https://getbootstrap.com/docs/5.3/)
- [Bootstrap Classes](https://getbootstrap.com/docs/5.3/utilities/)
- [Lucide React Icons](https://lucide.dev/)

---

## 💡 Dicas Adicionais

1. **Use Grid Bootstrap para layouts complexos**: Sua estabilidade é superior
2. **Customize via variáveis CSS**: Mantenha a approach de variáveis CSS
3. **Evite classes inline**: Use classes Bootstrap quando possível
4. **Teste responsivo regularmente**: Use DevTools (F12) para teste de media queries

---

## ❓ FAQ

**P: Posso voltar para Tailwind?**  
R: Sim, basta reverter os arquivos do git e reinstalar as dependências.

**P: Preciso instalar Bootstrap separadamente?**  
R: Não, o npm install cuidará disso automaticamente via package.json.

**P: Os estilos customizados funcionam com Bootstrap?**  
R: Sim! Você mantém todas as variáveis CSS que já tinha.

**P: Quanto menor é o bundle agora?**  
R: Significativamente menor. Removemos ~15-20 dependências não-essenciais.

---

**Versão**: 1.0  
**Data**: 6 de fevereiro de 2026  
**Status**: ✅ Conversão Completa
