# 🖼️ Image Converter — GitHub Pages

> Conversor de imagens client-side publicado no GitHub Pages.  
> Toda a conversão acontece **no navegador** — nenhum arquivo é enviado para servidores externos.

---

## 📋 Visão Geral

Aplicação web estática (HTML + CSS + JavaScript) hospedada no **GitHub Pages** que permite ao usuário converter imagens entre os formatos mais comuns — incluindo **HEIC/HEIF** (formato padrão de fotos do iPhone) — de forma rápida, segura e sem necessidade de instalação.

---

## ✅ Features

### F01 — Upload de Imagens
- Upload via **drag & drop** na área principal.
- Upload via **botão de seleção de arquivo** (`<input type="file">`).
- Suporte a **múltiplos arquivos** simultâneos.
- Preview (miniatura) de cada imagem carregada antes da conversão.
- Exibição de **nome do arquivo**, **tamanho** e **formato original** detectado.

### F02 — Formatos Suportados (Entrada)
| Formato       | Extensões          | Observação                        |
|---------------|--------------------|-----------------------------------|
| JPEG          | `.jpg`, `.jpeg`    | Formato mais comum                |
| PNG           | `.png`             | Suporte a transparência           |
| WebP          | `.webp`            | Formato moderno do Google         |
| GIF           | `.gif`             | Apenas primeiro frame (estático)  |
| BMP           | `.bmp`             | Bitmap sem compressão             |
| TIFF          | `.tif`, `.tiff`    | Comum em fotografia profissional  |
| SVG           | `.svg`             | Vetor → rasterização via Canvas   |
| ICO           | `.ico`             | Ícones                            |
| AVIF          | `.avif`            | Formato AV1 (se suportado pelo browser) |
| **HEIC/HEIF** | `.heic`, `.heif`   | 📱 Formato padrão de fotos do iPhone |

### F03 — Formatos de Saída (Conversão)
| Formato | Qualidade Ajustável | Observação                     |
|---------|---------------------|--------------------------------|
| JPEG    | ✅ Sim (1–100%)     | Ideal para fotos                |
| PNG     | ❌ Não (lossless)   | Ideal para gráficos/transparência |
| WebP    | ✅ Sim (1–100%)     | Melhor compressão moderna       |
| AVIF    | ✅ Sim (1–100%)     | Compressão de última geração    |
| BMP     | ❌ Não              | Sem compressão                  |
| GIF     | ❌ Não              | Frame único                     |

### F04 — Controle de Qualidade
- Slider de qualidade (1–100%) para formatos que suportam compressão lossy.
- Exibição em tempo real do **tamanho estimado** do arquivo de saída.
- Preset de qualidade rápida: `Baixa (30%)` · `Média (60%)` · `Alta (80%)` · `Máxima (100%)`.

### F05 — Redimensionamento (Opcional)
- Opção de redimensionar a imagem ao converter.
- Modos: **largura fixa**, **altura fixa** ou **ambas** (com trava de proporção).
- Presets comuns: `800px`, `1080px`, `1920px`, `Original`.

### F06 — Download
- Download individual de cada arquivo convertido.
- **Download em lote** (ZIP) quando múltiplas imagens são convertidas.
- Nome do arquivo de saída gerado automaticamente: `original_name.novo_formato`.

### F07 — Interface e UX
- Design responsivo (mobile-first) e moderno com **dark mode**.
- Animações suaves e micro-interações (hover, drag, progresso).
- Indicador de progresso por arquivo e geral.
- Feedback visual claro para estados: carregando, convertendo, concluído, erro.
- Suporte a **i18n** (Português e Inglês).

### F08 — Privacidade e Segurança
- **100% client-side** — nenhum dado sai do navegador.
- Badge/selo de privacidade visível na UI.
- Sem cookies, sem analytics invasivos, sem dependência de backend.

### F09 — PWA (Progressive Web App)
- Instalável como app no celular e desktop.
- Funciona offline após o primeiro carregamento.
- Service Worker para cache de assets.

---

## 🐛 Issues / Tarefas de Implementação

### 🏗️ Setup e Infraestrutura

#### Issue #1 — Inicializar projeto
**Labels:** `setup`, `priority: high`  
- Criar estrutura do projeto (HTML + CSS + JS vanilla ou Vite).
- Configurar GitHub Actions para deploy automático no GitHub Pages.
- Criar `README.md`, `LICENSE` e `.gitignore`.

#### Issue #2 — Configurar CI/CD para GitHub Pages
**Labels:** `setup`, `devops`  
- Workflow do GitHub Actions para build e deploy.
- Branch de deploy: `gh-pages` ou `main` (diretório `/docs`).
- Testar deploy automatizado.

---

### 🎨 Interface

#### Issue #3 — Criar layout principal e design system
**Labels:** `ui`, `priority: high`  
- Definir paleta de cores, tipografia (Google Fonts) e tokens de design.
- Implementar dark mode com toggle.
- Layout responsivo com CSS Grid/Flexbox.
- Glassmorphism e gradientes modernos.

#### Issue #4 — Implementar área de drag & drop
**Labels:** `ui`, `feature`  
- Zona de drop com animação visual ao arrastar arquivo.
- Fallback para input de arquivo em dispositivos sem suporte a drag & drop.
- Validação de tipo de arquivo no drop.

#### Issue #5 — Criar componente de preview de imagem
**Labels:** `ui`, `feature`  
- Grid de miniaturas das imagens carregadas.
- Exibir metadados: nome, tamanho, dimensões, formato.
- Botão de remover imagem individual da fila.

#### Issue #6 — Implementar barra de progresso
**Labels:** `ui`, `ux`  
- Progresso individual por arquivo.
- Progresso geral (barra ou porcentagem).
- Estados visuais: aguardando → convertendo → concluído → erro.

#### Issue #7 — Implementar seletor de formato e qualidade
**Labels:** `ui`, `feature`  
- Dropdown de formato de saída.
- Slider de qualidade com presets.
- Preview do tamanho estimado em tempo real.

---

### ⚙️ Motor de Conversão

#### Issue #8 — Implementar conversão via Canvas API
**Labels:** `core`, `priority: high`  
- Carregar imagem no `<canvas>` via `Image()`.
- Exportar via `canvas.toBlob()` / `canvas.toDataURL()` para JPEG, PNG, WebP.
- Gerenciar qualidade no `toBlob()`.

#### Issue #9 — Implementar suporte a HEIC/HEIF
**Labels:** `core`, `priority: high`, `heic`  
- Integrar biblioteca [`heic2any`](https://github.com/nichenqin/heic2any) para decodificar HEIC client-side.
- Converter HEIC → Blob intermediário (PNG/JPEG) → formato de saída desejado.
- Tratar erros de arquivos HEIC corrompidos ou não suportados.
- Testar com fotos reais de iPhone (Live Photos, HDR).

#### Issue #10 — Implementar suporte a TIFF
**Labels:** `core`, `feature`  
- Integrar biblioteca [`UTIF.js`](https://github.com/nichenqin/UTIF.js) ou similar para decodificar TIFF.
- Renderizar TIFF no canvas para conversão.

#### Issue #11 — Implementar suporte a AVIF (saída)
**Labels:** `core`, `feature`  
- Verificar suporte nativo do browser (`canvas.toBlob('image/avif')`).
- Exibir aviso se o browser não suportar AVIF.
- Fallback gracioso para browsers sem suporte.

#### Issue #12 — Implementar rasterização de SVG
**Labels:** `core`, `feature`  
- Carregar SVG como `Image()` e renderizar no canvas.
- Permitir definir dimensões de saída (SVG é vetor, precisa de tamanho alvo).

#### Issue #13 — Implementar redimensionamento
**Labels:** `core`, `feature`  
- Redimensionar via canvas antes da exportação.
- Manter proporção (aspect ratio lock).
- Presets de tamanho + input customizado.

---

### 📦 Download e Exportação

#### Issue #14 — Implementar download individual
**Labels:** `feature`, `download`  
- Criar link de download via `URL.createObjectURL()`.
- Nomear arquivo automaticamente com a extensão correta.

#### Issue #15 — Implementar download em lote (ZIP)
**Labels:** `feature`, `download`  
- Integrar [`JSZip`](https://stuk.github.io/jszip/) para empacotar múltiplos arquivos.
- Gerar e baixar o `.zip` com todos os arquivos convertidos.
- Indicador de progresso durante a criação do ZIP.

---

### 🌐 PWA e Offline

#### Issue #16 — Configurar PWA
**Labels:** `pwa`, `enhancement`  
- Criar `manifest.json` com ícones, nome e cores do tema.
- Implementar Service Worker para cache de assets estáticos.
- Testar instalação no Chrome, Safari e Firefox.

#### Issue #17 — Suporte offline
**Labels:** `pwa`, `enhancement`  
- Cache das bibliotecas JS (heic2any, JSZip, etc.) no Service Worker.
- Garantir que a conversão funcione 100% offline após primeiro acesso.

---

### 🌍 Internacionalização

#### Issue #18 — Implementar i18n (PT/EN)
**Labels:** `i18n`, `enhancement`  
- Sistema de tradução client-side com `data-i18n` ou similar.
- Detecção automática do idioma do navegador.
- Toggle manual de idioma na UI.
- Traduzir todos os textos e mensagens de erro.

---

### 🧪 Testes e Qualidade

#### Issue #19 — Testar conversão com formatos reais
**Labels:** `testing`, `priority: high`  
- Testar HEIC de iPhone (diferentes versões do iOS).
- Testar imagens grandes (>20 MB, >50 MP).
- Testar GIF animado (deve converter apenas primeiro frame com aviso).
- Testar SVG com elementos complexos (filtros, gradientes, fontes).
- Testar TIFF multi-página.

#### Issue #20 — Testar responsividade e acessibilidade
**Labels:** `testing`, `a11y`  
- Testar em dispositivos móveis reais (iOS Safari, Android Chrome).
- Verificar navegação por teclado.
- Verificar contraste e tamanhos de fonte (WCAG 2.1 AA).
- Labels em todos os inputs e áreas interativas.

#### Issue #21 — Performance e limites
**Labels:** `testing`, `performance`  
- Definir limite máximo de tamanho de arquivo (ex: 50 MB).
- Usar Web Workers para conversão pesada (não bloquear a UI).
- Lazy loading de bibliotecas (heic2any só carrega quando necessário).

---

### 📖 Documentação

#### Issue #22 — Escrever README completo
**Labels:** `docs`  
- Descrição do projeto.
- Screenshots/GIFs de demonstração.
- Formatos suportados.
- Como contribuir.
- Licença.

#### Issue #23 — Criar página de landing/about
**Labels:** `docs`, `ui`  
- Seção explicando como funciona.
- FAQ (ex: "Meus arquivos são enviados para algum servidor?" → Não!).
- Link para o repositório no GitHub.

---

## 🗺️ Roadmap

```
v1.0 — MVP
├── Upload (drag & drop + seletor)
├── Conversão: JPEG ↔ PNG ↔ WebP ↔ HEIC (entrada)
├── Controle de qualidade
├── Download individual
├── Deploy no GitHub Pages
└── Design responsivo + dark mode

v1.1 — Melhorias
├── Download em lote (ZIP)
├── Redimensionamento
├── Suporte TIFF e AVIF
├── i18n (PT/EN)
└── PWA + Offline

v2.0 — Avançado
├── Web Workers para conversão em background
├── Comparação antes/depois (side by side)
├── Metadados EXIF (visualizar e remover)
├── Batch rename (renomear em lote)
└── Compressão otimizada com WASM
```

---

## 🛠️ Stack Técnica

| Camada          | Tecnologia                        |
|-----------------|-----------------------------------|
| **Estrutura**   | HTML5 semântico                   |
| **Estilo**      | CSS vanilla (variáveis, grid, transitions) |
| **Lógica**      | JavaScript ES2022+                |
| **HEIC**        | `heic2any` (client-side)          |
| **TIFF**        | `UTIF.js`                         |
| **ZIP**         | `JSZip`                           |
| **PWA**         | Service Worker + manifest.json    |
| **Deploy**      | GitHub Pages + GitHub Actions     |
| **Bundler**     | Vite (opcional, para dev + build) |

---

## 📌 Dependências Principais

```json
{
  "heic2any": "^0.6.7",
  "jszip": "^3.10.1",
  "utif": "^3.1.0"
}
```

---

> **Nota:** Todas as conversões são feitas inteiramente no navegador do usuário. Nenhum arquivo é enviado para servidores. Privacidade total. 🔒
