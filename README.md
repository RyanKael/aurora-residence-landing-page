# Aurora Residence

Landing page imobiliária responsiva criada para apresentação de um lançamento residencial fictício e captação de leads em modo demonstrativo.

> Este projeto é uma demonstração fictícia desenvolvida exclusivamente para fins de estudo e portfólio. Aurora Residence, endereço, plantas, características, imagens, valores, contatos e demais informações apresentados não representam um empreendimento real.

## Sobre o projeto

Uma experiência editorial em off-white, champagne e verde profundo. Fotografias amplas, tipografia serifada e animações discretas apresentam o conceito do empreendimento e conduzem ao formulário. Sem frameworks, backend, banco de dados, login ou pagamentos.

## Preview

Demo: [adicionar link após GitHub Pages]

![Preview desktop do Aurora Residence](assets/preview.jpg)

Abra `index.html` no navegador. Todos os recursos necessários estão no repositório; não há dependência de fontes ou imagens externas em tempo de execução.

## Funcionalidades

- Header fixo com aparência adaptável, menu mobile, âncoras e retorno ao topo.
- Apresentação, oito diferenciais, oito fotos e mapa conceitual próprio.
- Galeria com lightbox, contador, anterior/próximo, setas do teclado e Escape.
- Três plantas SVG originais com ampliação. A seleção atualiza o formulário e a mensagem de WhatsApp.
- Modais com `dialog` nativo, contenção de foco, retorno ao acionador e fechamento pelo fundo.
- Validação de nome, telefone, e-mail e consentimento; mensagens junto aos campos e confirmação acessível.
- Formulário sem envio ou armazenamento no modo padrão.
- WhatsApp configurável; o número fictício abre um aviso com a mensagem demonstrativa.
- Foco visível, link para pular navegação e respeito a `prefers-reduced-motion`.

## Tecnologias

HTML5 semântico, CSS3 (Grid, Flexbox, media queries), JavaScript puro e SVG. Sem instalação ou compilação para uso. Navegadores modernos com suporte a `dialog`, IntersectionObserver e AbortSignal.timeout são recomendados.

## Responsividade

Layouts para 320, 375, 425, 768, 1024 e 1440 px. Galeria e cards se reorganizam, o formulário passa para uma coluna e a navegação vira menu expansível. Imagens fora do topo usam lazy loading; fotografias são comprimidas e hospedadas localmente.

## Formulário

Configuração no início de `js/script.js`:

```js
const FORM_ENDPOINT = '';
```

Vazio: valida os campos, mostra a confirmação de demonstração e limpa o formulário. Nenhuma informação pessoal vai para servidor, cookies ou armazenamento local. Não existe CRM conectado.

Preenchido: faz POST JSON com `name`, `phone`, `email`, `interest` e `consent`. Considera respostas HTTP 2xx sucesso, aplica timeout de 15 segundos e preserva os campos quando ocorre erro. O endpoint deve aceitar CORS para o domínio publicado. Teste o contrato do seu provedor antes de ativar.

### Integração futura

- **Formspree:** crie um formulário no serviço e configure sua URL pública como `FORM_ENDPOINT`; confira o formato esperado e teste o recebimento. O código já solicita resposta JSON.
- **EmailJS:** adapte o trecho de envio ao SDK/API e ao template do serviço. Use somente identificadores públicos permitidos no navegador; restrinja origens e habilite proteção contra abuso. Não coloque credenciais privadas no frontend.
- **Netlify Forms:** requer deploy no Netlify, atributos de detecção no HTML, campo `form-name` e envio codificado como formulário. Não basta preencher `FORM_ENDPOINT`; adapte o markup e o POST. Esse processamento não é oferecido pelo GitHub Pages.
- **API própria:** disponibilize uma rota HTTPS com validação no servidor, limitação de requisições, proteção antispam e integração ao CRM/e-mail. Segredos ficam no ambiente do servidor.

Para operação real, substitua os avisos demonstrativos, revise consentimento e política de privacidade, defina retenção de dados e valide o fluxo ponta a ponta.

## Integração WhatsApp

```js
const WHATSAPP_NUMBER = '5500000000000';
```

O número é fictício e não abre conversa. Ao substituir por um número válido no formato internacional, apenas com dígitos (país + DDD + número), o botão passa a abrir `wa.me` com mensagem codificada. A planta escolhida é incluída quando disponível. `WHATSAPP_MESSAGE` personaliza o texto inicial.

## Estrutura do projeto

```text
/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── images/       # Fotos locais e três plantas SVG
│   └── icons/favicon.svg
├── tests/smoke.cjs   # Verificações de navegador opcionais
├── README.md
├── .gitignore
└── .nojekyll
```

## Como executar

Abra `index.html` diretamente, ou use um servidor estático:

```sh
python -m http.server 4173
```

Acesse `http://localhost:4173`. Para encerrar, pressione Ctrl+C. Não há etapa de build.

## Como adaptar para um cliente real

1. Substitua logo, favicon, nome e todos os textos no HTML.
2. Troque fotos e plantas por materiais autorizados. Atualize seus textos alternativos, as listas `gallery` e `plans` e as características reais.
3. Atualize endereço, mapa, proximidades verificadas, telefone e e-mail no rodapé.
4. Configure `WHATSAPP_NUMBER`, `WHATSAPP_MESSAGE` e o envio do formulário.
5. Personalize cores e fontes nas variáveis de `css/style.css`.
6. Atualize title, description e Open Graph. Na publicação real, use URL absoluta para `og:image`, adicione `og:url` e canonical com o domínio final.
7. Configure domínio e HTTPS no provedor escolhido, revise privacidade e teste os leads antes da divulgação.

## Publicação

### GitHub Pages

1. Crie um repositório e envie os arquivos preservando a estrutura. `index.html` deve ficar na raiz.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.
4. Salve e aguarde a publicação. A URL será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
5. Atualize o link de Demo e os metadados Open Graph com a URL publicada.

Todos os caminhos são relativos, compatíveis com subpastas do GitHub Pages. `.nojekyll` dispensa processamento Jekyll. Nenhum repositório remoto ou domínio foi criado por este projeto.

### Outros provedores

No Netlify ou Vercel, use projeto estático, sem comando de build, com a raiz como diretório de publicação. Na hospedagem tradicional, copie o conteúdo para a pasta pública. Recursos específicos de cada serviço exigem configuração própria.

## Imagens e elementos demonstrativos

As fotografias são referências visuais do Unsplash e não retratam o Aurora Residence. Consulte a [licença do Unsplash](https://unsplash.com/license) e substitua por imagens autorizadas para uso comercial de um cliente. O projeto não afirma autoria das fotografias.

Fontes de imagem (identificadores do CDN `images.unsplash.com`):

| Arquivo | Identificador |
| --- | --- |
| fachada.jpg | photo-1460317442991-0ec209397118 |
| sala.jpg | photo-1600210492486-724fe5c67fb0 |
| varanda.jpg | photo-1773101883557-740cfff2e2a0 (Franco Debartolo) |
| cozinha.jpg | photo-1556912172-45b7abe8b7e1 |
| lazer.jpg | photo-1572331165267-854da2b10ccc |
| piscina.jpg | photo-1576013551627-0cc20b96c2a7 |
| academia.jpg | photo-1534438327276-14e5300c3a48 |
| externa.jpg | photo-1600607688969-a5bfcd646154 |

Plantas, favicon e mapa foram construídos para esta demonstração. Plantas não possuem escala ou validade técnica; áreas, endereço, tempos, disponibilidade e contatos são fictícios. Não há prêmios, certificações ou depoimentos inventados. O domínio `.example` do e-mail é reservado a exemplos.

## Testes

O arquivo `tests/smoke.cjs` usa Playwright e Chrome em modo headless para verificar seis larguras, âncoras, imagens, menu mobile, galeria, setas, Escape, foco, plantas, WhatsApp demonstrativo, formulário e abertura direta. A dependência é exclusiva dos testes, não da página.

Execute com Playwright disponível no ambiente: `node tests/smoke.cjs`. A variável `PLAYWRIGHT_PATH` pode indicar uma instalação existente. Evidências são salvas em `test-results/` (ignorado pelo Git).

Validação realizada em 13/10/2026: seis larguras aprovadas sem overflow horizontal; imagens carregadas; âncoras, menus, galeria, teclado, foco, três plantas, WhatsApp demonstrativo, formulário vazio/inválido/válido, ausência de POST no modo demo, retorno ao topo e abertura via `file://` aprovados. Console sem erros. Testes realizados no Chrome headless; não substituem testes em dispositivos físicos ou em Safari/Firefox. Hospedagem remota ainda não publicada.

## Possíveis melhorias futuras

Fotos próprias em AVIF/WebP com `srcset`, tour virtual autorizado, plantas técnicas reais, integração com CRM, proteção antispam no servidor e métricas com consentimento adequado. Uma auditoria com leitores de tela e testes em aparelhos iOS/Android reais complementam os testes de navegador.

