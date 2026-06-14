// Banco de dados de padrões de candlestick - Mestre das Velas (Avançado)
// Cada padrão tem: nome, sinal (alta/baixa/indecisao), velas (OHLC), dica e explicação
// dificuldade: iniciante | intermediario | avancado | expert

const PATTERNS = [
  // ===================== 1 VELA =====================
  {
    id: 1, nome: "Marubozu de Alta", sinal: "alta", dificuldade: "intermediario",
    velas: [{o:5, h:12, l:5, c:12}],
    dica: "Vela cheia, sem pavios. Abertura = mínima, fechamento = máxima.",
    explicacao: "Compradores dominaram do início ao fim, sem hesitação. Forte continuação de alta."
  },
  {
    id: 2, nome: "Marubozu de Baixa", sinal: "baixa", dificuldade: "intermediario",
    velas: [{o:12, h:12, l:5, c:5}],
    dica: "Vela cheia, sem pavios. Abertura = máxima, fechamento = mínima.",
    explicacao: "Vendedores controlaram o pregão inteiro. Forte continuação de baixa."
  },
  {
    id: 3, nome: "Doji", sinal: "indecisao", dificuldade: "iniciante",
    velas: [{o:9, h:13, l:5, c:9.2}],
    dica: "Abertura e fechamento quase iguais. Corpo minúsculo no meio dos pavios.",
    explicacao: "Equilíbrio entre compradores e vendedores. Indica possível reversão ou pausa."
  },
  {
    id: 4, nome: "Doji Pernas Longas", sinal: "indecisao", dificuldade: "intermediario",
    velas: [{o:9, h:15, l:3, c:9.1}],
    dica: "Doji com pavios muito longos para os dois lados.",
    explicacao: "Grande indecisão e volatilidade. Mercado testou extremos e voltou ao centro."
  },
  {
    id: 5, nome: "Estrela Cadente (Shooting Star)", sinal: "baixa", dificuldade: "intermediario",
    velas: [{o:10.2, h:13.6, l:8.5, c:10.3}],
    dica: "Pavio superior longo. Corpo pequeno na parte inferior.",
    explicacao: "Indica rejeição de preços altos. Vendedores empurraram o preço de volta."
  },
  {
    id: 6, nome: "Martelo (Hammer)", sinal: "alta", dificuldade: "iniciante",
    velas: [{o:8.3, h:8.6, l:5, c:8.5}],
    dica: "Pavio inferior longo (2-3x o corpo). Corpo pequeno no topo.",
    explicacao: "Compradores rejeitaram preços baixos e levaram o preço de volta para cima."
  },
  {
    id: 7, nome: "Homem Pendurado (Hanging Man)", sinal: "baixa", dificuldade: "intermediario",
    velas: [{o:10.5, h:10.8, l:7.2, c:10.3}],
    dica: "Igual ao martelo, mas aparece após tendência de alta.",
    explicacao: "Pavio inferior longo mostra que vendedores começaram a pressionar, mesmo após alta."
  },
  {
    id: 8, nome: "Pinça de Alta (Inverted Hammer)", sinal: "alta", dificuldade: "intermediario",
    velas: [{o:8.4, h:11.5, l:8.2, c:8.6}],
    dica: "Pavio superior longo, corpo pequeno na base, após queda.",
    explicacao: "Compradores testaram preços mais altos. Sinal inicial de possível reversão de alta."
  },
  {
    id: 9, nome: "Pião de Alta (Spinning Top)", sinal: "indecisao", dificuldade: "intermediario",
    velas: [{o:9, h:12.5, l:5.5, c:9.6}],
    dica: "Corpo pequeno verde, pavios longos dos dois lados.",
    explicacao: "Forte indecisão. Nenhum lado conseguiu controlar o movimento."
  },
  {
    id: 10, nome: "Pião de Baixa (Spinning Top)", sinal: "indecisao", dificuldade: "intermediario",
    velas: [{o:9.6, h:12.5, l:5.5, c:9}],
    dica: "Corpo pequeno vermelho, pavios longos dos dois lados.",
    explicacao: "Indecisão acentuada, geralmente após movimento forte. Mercado em pausa."
  },
  {
    id: 11, nome: "Vela Longa de Alta (Long Bullish)", sinal: "alta", dificuldade: "iniciante",
    velas: [{o:5.5, h:12.8, l:5.2, c:12.5}],
    dica: "Corpo verde grande, pavios curtos.",
    explicacao: "Compradores dominaram com força e convicção durante o pregão."
  },
  {
    id: 12, nome: "Vela Longa de Baixa (Long Bearish)", sinal: "baixa", dificuldade: "iniciante",
    velas: [{o:12.5, h:12.8, l:5.2, c:5.5}],
    dica: "Corpo vermelho grande, pavios curtos.",
    explicacao: "Vendedores dominaram com força e convicção durante o pregão."
  },
  {
    id: 13, nome: "Dragonfly Doji", sinal: "alta", dificuldade: "avancado",
    velas: [{o:10, h:10.1, l:4, c:10}],
    dica: "Abertura, fechamento e máxima quase no mesmo nível. Pavio inferior enorme.",
    explicacao: "Forte rejeição de preços baixos. Compradores assumiram o controle no fim."
  },
  {
    id: 14, nome: "Gravestone Doji", sinal: "baixa", dificuldade: "avancado",
    velas: [{o:6, h:12, l:5.9, c:6}],
    dica: "Abertura, fechamento e mínima quase no mesmo nível. Pavio superior enorme.",
    explicacao: "Forte rejeição de preços altos. Vendedores assumiram o controle no fim."
  },

  // ===================== 2 VELAS =====================
  {
    id: 15, nome: "Engolfo de Alta (Bullish Engulfing)", sinal: "alta", dificuldade: "iniciante",
    velas: [{o:10, h:10.2, l:7, c:7.3},{o:6.8, h:12.5, l:6.6, c:12.2}],
    dica: "Vela vermelha pequena seguida de vela verde grande que 'engole' a anterior.",
    explicacao: "Compradores tomaram controle total, superando toda a baixa anterior."
  },
  {
    id: 16, nome: "Engolfo de Baixa (Bearish Engulfing)", sinal: "baixa", dificuldade: "iniciante",
    velas: [{o:7.3, h:10.2, l:7, c:10},{o:12.2, h:12.5, l:6.6, c:6.8}],
    dica: "Vela verde pequena seguida de vela vermelha grande que 'engole' a anterior.",
    explicacao: "Vendedores tomaram controle total, revertendo toda a alta anterior."
  },
  {
    id: 17, nome: "Harami de Alta", sinal: "alta", dificuldade: "intermediario",
    velas: [{o:12, h:12.3, l:6, c:6.3},{o:8, h:9.5, l:7.8, c:9.2}],
    dica: "Vela vermelha grande seguida de vela verde pequena dentro do corpo da anterior.",
    explicacao: "Momentum de baixa perdendo força. Compradores começam a entrar com cautela."
  },
  {
    id: 18, nome: "Harami de Baixa", sinal: "baixa", dificuldade: "intermediario",
    velas: [{o:6.3, h:12.3, l:6, c:12},{o:9.2, h:9.5, l:7.8, c:8}],
    dica: "Vela verde grande seguida de vela vermelha pequena dentro do corpo da anterior.",
    explicacao: "Momentum de alta perdendo força. Vendedores começam a entrar com cautela."
  },
  {
    id: 19, nome: "Cruz Harami de Alta", sinal: "alta", dificuldade: "avancado",
    velas: [{o:12, h:12.3, l:6, c:6.3},{o:9, h:10.5, l:7.5, c:9.1}],
    dica: "Vela vermelha grande seguida de um Doji dentro de seu corpo.",
    explicacao: "Indecisão extrema após forte queda. Sinal mais forte de reversão que o Harami comum."
  },
  {
    id: 20, nome: "Cruz Harami de Baixa", sinal: "baixa", dificuldade: "avancado",
    velas: [{o:6.3, h:12.3, l:6, c:12},{o:9.1, h:10.5, l:7.5, c:9}],
    dica: "Vela verde grande seguida de um Doji dentro de seu corpo.",
    explicacao: "Indecisão extrema após forte alta. Sinal mais forte de reversão que o Harami comum."
  },
  {
    id: 21, nome: "Nuvem Negra (Dark Cloud Cover)", sinal: "baixa", dificuldade: "avancado",
    velas: [{o:6, h:12.5, l:5.8, c:12},{o:12.8, h:13, l:7.5, c:7.8}],
    dica: "Vela verde forte seguida de vela vermelha que abre acima e fecha abaixo de 50% do corpo anterior.",
    explicacao: "Reversão forte: vendedores recuperaram mais da metade do ganho anterior."
  },
  {
    id: 22, nome: "Linha Penetrante (Piercing Line)", sinal: "alta", dificuldade: "avancado",
    velas: [{o:12, h:12.2, l:6, c:6.5},{o:5.7, h:9.5, l:5.5, c:9.3}],
    dica: "Vela vermelha forte seguida de vela verde que abre abaixo e fecha acima de 50% do corpo anterior.",
    explicacao: "Reversão forte: compradores recuperaram mais da metade da queda anterior."
  },
  {
    id: 23, nome: "Bullish Meeting Line", sinal: "alta", dificuldade: "intermediario",
    velas: [{o:9.5, h:9.5, l:7.5, c:7.5},{o:5.4, h:7.5, l:3.3, c:7.5}],
    dica: "Duas velas com o mesmo fechamento. Primeira vermelha, segunda verde.",
    explicacao: "Os compradores conseguem levar o preço de volta ao mesmo nível."
  },
  {
    id: 24, nome: "Bearish Meeting Line", sinal: "baixa", dificuldade: "intermediario",
    velas: [{o:7.5, h:9.5, l:7.5, c:9.5},{o:7.5, h:11.6, l:7.5, c:11.4}],
    dica: "Duas velas com a mesma abertura. Primeira verde, segunda vermelha.",
    explicacao: "Os vendedores conseguem trazer o preço de volta ao nível de fechamento anterior."
  },
  {
    id: 25, nome: "Tweezer Top (Pinça de Topo)", sinal: "baixa", dificuldade: "avancado",
    velas: [{o:6, h:12.5, l:5.8, c:12.2},{o:12.3, h:12.5, l:7.5, c:7.7}],
    dica: "Duas velas com máximas praticamente idênticas. Primeira verde, segunda vermelha.",
    explicacao: "Resistência confirmada duas vezes. Reversão de topo provável."
  },
  {
    id: 26, nome: "Tweezer Bottom (Pinça de Fundo)", sinal: "alta", dificuldade: "avancado",
    velas: [{o:12.2, h:12.5, l:5.8, c:6},{o:7.7, h:12.5, l:7.5, c:12.3}],
    dica: "Duas velas com mínimas praticamente idênticas. Primeira vermelha, segunda verde.",
    explicacao: "Suporte confirmado duas vezes. Reversão de fundo provável."
  },
  {
    id: 27, nome: "Kicker de Alta", sinal: "alta", dificuldade: "expert",
    velas: [{o:12, h:12.2, l:9.5, c:9.7},{o:13, h:15.5, l:12.9, c:15.3}],
    dica: "Gap de alta entre as velas. Segunda vela abre muito acima do fechamento da primeira.",
    explicacao: "Mudança brusca de sentimento do mercado, geralmente por notícia. Sinal muito forte."
  },
  {
    id: 28, nome: "Kicker de Baixa", sinal: "baixa", dificuldade: "expert",
    velas: [{o:9.7, h:12.2, l:9.5, c:12},{o:8.7, h:8.8, l:5.2, c:5.4}],
    dica: "Gap de baixa entre as velas. Segunda vela abre muito abaixo do fechamento da primeira.",
    explicacao: "Mudança brusca de sentimento do mercado, geralmente por notícia. Sinal muito forte."
  },
  {
    id: 29, nome: "On-Neck Line", sinal: "baixa", dificuldade: "expert",
    velas: [{o:12.5, h:12.7, l:6, c:6.2},{o:5.6, h:6.5, l:5.4, c:6.2}],
    dica: "Vela vermelha forte seguida de vela verde pequena que fecha na mínima da anterior.",
    explicacao: "Tentativa fraca de recuperação. Continuação de baixa é o cenário mais provável."
  },
  {
    id: 30, nome: "In-Neck Line", sinal: "baixa", dificuldade: "expert",
    velas: [{o:12.5, h:12.7, l:6, c:6.2},{o:5.6, h:6.8, l:5.4, c:6.4}],
    dica: "Vela vermelha forte seguida de vela verde pequena que fecha levemente acima da mínima anterior.",
    explicacao: "Recuperação muito fraca dentro de tendência de baixa. Tendência tende a continuar."
  },
  {
    id: 31, nome: "Thrusting Line", sinal: "baixa", dificuldade: "expert",
    velas: [{o:12.5, h:12.7, l:6, c:6.2},{o:5.6, h:9.5, l:5.4, c:9.3}],
    dica: "Vela vermelha forte seguida de verde que fecha abaixo de 50% do corpo anterior.",
    explicacao: "Recuperação parcial mas insuficiente. Vendedores ainda controlam o cenário."
  },

  // ===================== 3 VELAS =====================
  {
    id: 32, nome: "Estrela da Manhã (Morning Star)", sinal: "alta", dificuldade: "intermediario",
    velas: [{o:12.5,h:12.7,l:6,c:6.2},{o:5.8,h:6.3,l:5,c:5.5},{o:6,h:11.5,l:5.8,c:11.2}],
    dica: "Vela vermelha grande, vela pequena (gap para baixo), vela verde grande.",
    explicacao: "Reversão clássica de fundo: vendedores exaustos, compradores retomam o controle."
  },
  {
    id: 33, nome: "Estrela da Noite (Evening Star)", sinal: "baixa", dificuldade: "intermediario",
    velas: [{o:6,h:12.2,l:5.8,c:12},{o:12.4,h:13,l:12,c:12.6},{o:12,h:12.2,l:6.5,c:6.8}],
    dica: "Vela verde grande, vela pequena (gap para cima), vela vermelha grande.",
    explicacao: "Reversão clássica de topo: compradores exaustos, vendedores retomam o controle."
  },
  {
    id: 34, nome: "Três Soldados Brancos", sinal: "alta", dificuldade: "intermediario",
    velas: [{o:5,h:8.3,l:4.8,c:8},{o:8,h:11.3,l:7.8,c:11},{o:11,h:14.3,l:10.8,c:14}],
    dica: "Três velas verdes consecutivas, cada uma abrindo dentro do corpo da anterior e fechando mais alto.",
    explicacao: "Forte tendência de alta sustentada, com compradores no controle por vários períodos."
  },
  {
    id: 35, nome: "Três Corvos Negros", sinal: "baixa", dificuldade: "intermediario",
    velas: [{o:14,h:14.3,l:10.8,c:11},{o:11,h:11.3,l:7.8,c:8},{o:8,h:8.3,l:4.8,c:5}],
    dica: "Três velas vermelhas consecutivas, cada uma abrindo dentro do corpo da anterior e fechando mais baixo.",
    explicacao: "Forte tendência de baixa sustentada, com vendedores no controle por vários períodos."
  },
  {
    id: 36, nome: "Três Métodos de Alta (Rising Three)", sinal: "alta", dificuldade: "avancado",
    velas: [{o:5,h:11.5,l:4.8,c:11.3},{o:11,h:11.4,l:8.5,c:9},{o:9,h:9.5,l:6,c:6.3}],
    dica: "Vela verde grande seguida de pequenas velas vermelhas em correção, sem romper a mínima inicial.",
    explicacao: "Pausa saudável dentro de tendência de alta. Espera-se continuação para cima."
  },
  {
    id: 37, nome: "Três Métodos de Baixa (Falling Three)", sinal: "baixa", dificuldade: "avancado",
    velas: [{o:11.3,h:11.5,l:4.8,c:5},{o:6,h:9,l:5.5,c:8.5},{o:8.5,h:11,l:8.3,c:10.5}],
    dica: "Vela vermelha grande seguida de pequenas velas verdes em correção, sem romper a máxima inicial.",
    explicacao: "Pausa dentro de tendência de baixa. Espera-se continuação para baixo."
  },
  {
    id: 38, nome: "Três Estrelas no Sul", sinal: "alta", dificuldade: "expert",
    velas: [{o:12,h:12.2,l:6,c:6.3},{o:11.8,h:11.9,l:7.5,c:7.8},{o:8.5,h:8.6,l:8,c:8.4}],
    dica: "Três velas vermelhas com pavios cada vez menores e corpos cada vez menores.",
    explicacao: "Pressão vendedora diminuindo gradualmente. Possível esgotamento da queda."
  },
  {
    id: 39, nome: "Stick Sandwich de Alta", sinal: "alta", dificuldade: "expert",
    velas: [{o:9.5,h:9.7,l:6,c:6.2},{o:6.5,h:11,l:6.3,c:10.8},{o:10.5,h:10.6,l:6.1,c:6.3}],
    dica: "Vermelha, verde, vermelha — as duas vermelhas com fechamentos quase iguais.",
    explicacao: "Suporte testado e respeitado duas vezes. Sinal de possível fundo."
  },
  {
    id: 40, nome: "Stick Sandwich de Baixa", sinal: "baixa", dificuldade: "expert",
    velas: [{o:6.2,h:9.7,l:6,c:9.5},{o:10.8,h:11,l:6.3,c:6.5},{o:6.3,h:10.6,l:6.1,c:10.5}],
    dica: "Verde, vermelha, verde — as duas verdes com fechamentos quase iguais.",
    explicacao: "Resistência testada e respeitada duas vezes. Sinal de possível topo."
  },
  {
    id: 41, nome: "Abandoned Baby de Alta", sinal: "alta", dificuldade: "expert",
    velas: [{o:12.5,h:12.7,l:8,c:8.2},{o:7,h:7.3,l:6.5,c:6.9},{o:8.5,h:12,l:8.3,c:11.8}],
    dica: "Vela vermelha, Doji isolado por gaps dos dois lados, depois vela verde forte.",
    explicacao: "Reversão extremamente rara e forte. O Doji 'isolado' marca o ponto exato de virada."
  },
  {
    id: 42, nome: "Abandoned Baby de Baixa", sinal: "baixa", dificuldade: "expert",
    velas: [{o:8.2,h:12.7,l:8,c:12.5},{o:6.9,h:7.3,l:6.5,c:7},{o:11.8,h:12,l:8.3,c:8.5}],
    dica: "Vela verde, Doji isolado por gaps dos dois lados, depois vela vermelha forte.",
    explicacao: "Reversão extremamente rara e forte no topo. O Doji marca o ponto exato de virada."
  },
  {
    id: 43, nome: "Three Inside Up", sinal: "alta", dificuldade: "avancado",
    velas: [{o:12,h:12.2,l:6,c:6.3},{o:8,h:9.5,l:7.8,c:9.2},{o:9.3,h:13,l:9.1,c:12.8}],
    dica: "Harami de alta seguido de uma terceira vela verde que confirma rompendo a máxima da primeira.",
    explicacao: "Confirmação do Harami: reversão de baixa para alta validada pela terceira vela."
  },
  {
    id: 44, nome: "Three Inside Down", sinal: "baixa", dificuldade: "avancado",
    velas: [{o:6.3,h:12.2,l:6,c:12},{o:9.2,h:9.5,l:7.8,c:8},{o:7.8,h:8,l:5,c:5.2}],
    dica: "Harami de baixa seguido de uma terceira vela vermelha que confirma rompendo a mínima da primeira.",
    explicacao: "Confirmação do Harami: reversão de alta para baixa validada pela terceira vela."
  },

  // ===================== 4 VELAS =====================
  {
    id: 45, nome: "Tower Top", sinal: "baixa", dificuldade: "avancado",
    velas: [{o:5,h:10.5,l:4.8,c:10.3},{o:10.3,h:12.6,l:10.2,c:12.4},{o:12.4,h:12.6,l:11,c:11.2},{o:11.2,h:11.3,l:6.4,c:6.6}],
    dica: "Alta forte → consolidação → queda forte. Forma de 'torre'.",
    explicacao: "Reversão de topo com distribuição. Os vendedores se preparam e atacam."
  },
  {
    id: 46, nome: "Tower Bottom", sinal: "alta", dificuldade: "avancado",
    velas: [{o:12.4,h:12.6,l:6.6,c:6.8},{o:6.8,h:7,l:6.5,c:6.7},{o:6.7,h:6.9,l:6.4,c:6.6},{o:6.6,h:11.5,l:6.5,c:11.3}],
    dica: "Queda forte → consolidação → alta forte. Forma de 'torre' invertida.",
    explicacao: "Reversão de fundo com acumulação. Os compradores se preparam e atacam."
  },
  {
    id: 47, nome: "Mat Hold (Suporte de Tapete)", sinal: "alta", dificuldade: "expert",
    velas: [{o:5,h:11.5,l:4.8,c:11.3},{o:11.4,h:11.6,l:9.5,c:9.8},{o:9.7,h:9.9,l:8.5,c:8.8},{o:8.9,h:13,l:8.8,c:12.8}],
    dica: "Vela verde forte, três pequenas de correção descendente, depois vela verde forte de continuação.",
    explicacao: "Padrão de continuação de alta. Pequena correção é absorvida e a tendência retoma."
  },
  {
    id: 48, nome: "Three Line Strike de Alta", sinal: "alta", dificuldade: "expert",
    velas: [{o:5,h:8.3,l:4.8,c:8},{o:8,h:11.3,l:7.8,c:11},{o:11,h:14.3,l:10.8,c:14},{o:14.2,h:14.3,l:4.9,c:5}],
    dica: "Três velas verdes consecutivas seguidas de uma vela vermelha que devolve todo o ganho.",
    explicacao: "Aparente reversão, mas estatisticamente é considerado padrão de continuação de alta."
  },
  {
    id: 49, nome: "Three Line Strike de Baixa", sinal: "baixa", dificuldade: "expert",
    velas: [{o:14,h:14.3,l:10.8,c:11},{o:11,h:11.3,l:7.8,c:8},{o:8,h:8.3,l:4.8,c:5},{o:4.9,h:14.2,l:4.8,c:14}],
    dica: "Três velas vermelhas consecutivas seguidas de uma vela verde que devolve toda a queda.",
    explicacao: "Aparente reversão, mas estatisticamente é considerado padrão de continuação de baixa."
  },
  {
    id: 50, nome: "Concealing Baby Swallow", sinal: "alta", dificuldade: "expert",
    velas: [{o:12,h:12.1,l:6,c:6.1},{o:11.8,h:11.9,l:5.8,c:5.9},{o:5.7,h:9,l:4,c:4.1},{o:3.9,h:9.5,l:3.8,c:9.2}],
    dica: "Dois Marubozus de baixa, depois vela com pavio que rompe a anterior, depois vela verde forte.",
    explicacao: "Padrão raro de reversão de fundo após queda intensa e exaustão dos vendedores."
  },
  {
    id: 51, nome: "Ladder Bottom", sinal: "alta", dificuldade: "expert",
    velas: [{o:12,h:12.2,l:9.5,c:9.7},{o:9.5,h:9.7,l:7,c:7.2},{o:7.2,h:7.4,l:4.5,c:4.7},{o:4.5,h:9,l:4.4,c:8.8}],
    dica: "Três vermelhas em escada descendente, seguidas de uma vela verde forte que abre com gap.",
    explicacao: "Reversão de fundo após queda gradual em 'escada'. Compradores retomam com força."
  },
  {
    id: 52, nome: "Deliberation (Velas de Deliberação)", sinal: "baixa", dificuldade: "expert",
    velas: [{o:5,h:8.3,l:4.8,c:8},{o:8,h:11.3,l:7.8,c:11},{o:11,h:11.6,l:10.8,c:11.4}],
    dica: "Duas velas verdes fortes seguidas de uma pequena verde com gap de alta, mas corpo minúsculo.",
    explicacao: "Tendência de alta perdendo força. Pequeno corpo final mostra hesitação dos compradores."
  },
  {
    id: 53, nome: "Upside Gap Two Crows", sinal: "baixa", dificuldade: "expert",
    velas: [{o:5,h:11.5,l:4.8,c:11.3},{o:12,h:12.5,l:11.5,c:11.8},{o:12.3,h:12.6,l:11,c:11.4}],
    dica: "Vela verde forte, gap de alta com vela vermelha pequena, depois outra vermelha que engole a anterior.",
    explicacao: "Sinal de alerta dentro de tendência de alta. Pressão vendedora surgindo no topo."
  }
];
