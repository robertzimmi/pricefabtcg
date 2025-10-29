const fetch = require("node-fetch"); // npm install node-fetch@2
const { MOCK_EXPANSIONS } = require("./mock_expansions");
const BEARER_TOKEN = process.env.BEARER_TOKEN;
const BASE_URL = "https://api.cardtrader.com/api/v2";

// cartas e limites individuais em euros
const CARDS_TO_CHECK = {
  "Command and Conquer": 73,
  "Enlightened Strike": 32,
  "Mask of Momentum": 73,
  "The Weakest Link": 32,
  "Erase Face": 16,
  "Censor": 9,
  "Shelter from the Storm": 73,
};

// delay em ms
const delay = ms => new Promise(r => setTimeout(r, ms));

// quebra array em chunks
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function getEuroToBRL() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
    const data = await res.json();
    return data.rates.BRL;
  } catch (err) {
    return 5.5;
  }
}

async function fetchCardData(expansion, EURO_TO_BRL) {
  const url = `${BASE_URL}/marketplace/products?expansion_id=${expansion.id}`;
  try {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } });
    if (!resp.ok) {
      console.log(`❌ Expansão ${expansion.name} retornou status ${resp.status}`);
      return [];
    }
    const data = await resp.json();
    const allCards = Object.values(data).flat();

    return allCards
      .filter(c => c.name_en && c.price && CARDS_TO_CHECK.hasOwnProperty(c.name_en))
      .map(c => {
        const priceEuro = c.price.cents / 100;
        return {
          expansion: expansion.name,
          name: c.name_en,
          priceEuro,
          priceBRL: priceEuro * EURO_TO_BRL,
          condition: c.properties_hash?.condition || "N/A",
          language: c.properties_hash?.fab_language || "N/A",
          signed: c.properties_hash?.signed ? "Sim" : "Não",
          limit: CARDS_TO_CHECK[c.name_en],
        };
      })
      .filter(item => item.priceEuro <= item.limit);
  } catch (err) {
    console.error(`❌ Erro ao buscar expansão ${expansion.name}:`, err);
    return [];
  }
}

async function fetchAllCardsWithRateLimit() {
  const EURO_TO_BRL = await getEuroToBRL();
  console.log(`💱 1 Euro = R$${EURO_TO_BRL.toFixed(2)}\n`);

  const chunks = chunkArray(MOCK_EXPANSIONS, 10); // máximo 10 requisições por segundo
  const allFoundCards = [];

  for (const [i, chunk] of chunks.entries()) {
    console.log(`➡️ Processando lote ${i + 1} de ${chunks.length} (até 10 requisições)`);
    const results = await Promise.all(chunk.map(exp => fetchCardData(exp, EURO_TO_BRL)));
    allFoundCards.push(...results.flat());
    if (i < chunks.length - 1) await delay(1000); // espera 1s antes do próximo lote
  }

  allFoundCards.forEach(c => {
    console.log(`✅ [${c.expansion}] ${c.name} - €${c.priceEuro.toFixed(2)} / R$${c.priceBRL.toFixed(2)} - ${c.condition} - ${c.language} - Assinada: ${c.signed} - Limite: €${c.limit}`);
  });

  console.log(`🎯 Total de cartas encontradas: ${allFoundCards.length}`);
}

// Executa
fetchAllCardsWithRateLimit();