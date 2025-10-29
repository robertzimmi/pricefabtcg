const fs = require('fs');
const fetch = require('node-fetch'); // se não instalou: npm install node-fetch@2

const BEARER_TOKEN = "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjYXJkdHJhZGVyLXByb2R1Y3Rpb24iLCJzdWIiOiJhcHA6MTA4MjgiLCJhdWQiOiJhcHA6MTA4MjgiLCJleHAiOjQ5MTQ5NTA1NzksImp0aSI6ImMxYjQyOGM5LWNhYTQtNGEwNi1iZDU4LTA3NDI1ZDU1YWY2NiIsImlhdCI6MTc1OTI3Njk3OSwibmFtZSI6IlJvYmVydHppbW1pIEFwcCAyMDI0MDYyNDE5MTMyMSJ9.QTWTcd_hZYRosDo544CB_Y6Net99sGf78fIu-0ttbrDE6RTTmleaRa3-pDqN1fsFzJd6cam8_ic6R-xOHCGXQZLoTtyg99_H6kGbqDPFAVjvStEQgSoxR_uf3Jta-rAJMIIAkQwsRFGCP_H8WC0bS591c7WBKB2s-xcehVNKTcqnpaO3Vs-C_INtIfvp18MKeGILyCy3SlnAiPtgZ_c0L8eM1bFlXVV0oTQ665skZWaCrJkZLwf75sopP7AIuMGCZpGhoe-UMWUKi9gNnUdrO75enJR4w4Yuhoh7ezJ2jsfgDPRmDNzivC6v9yfJy-du3ZEOztpMt68SFXXDZU0xdQ";
const BASE_URL = "https://api.cardtrader.com/api/v2";
const EXPANSION_URL = `${BASE_URL}/marketplace/products?expansion_id=`;

// MOCK_EXPANSIONS do mock_expansions.ts
const MOCK_EXPANSIONS = [
  { id: 2170, code: "wtr", name: "Welcome to Rathe" },
  { id: 2171, code: "arc", name: "Arcane Rising" },
  { id: 2172, code: "cru", name: "Crucible of War" },
  { id: 2173, code: "mon", name: "Monarch - Unlimited" },
  { id: 2194, code: "lgs", name: "Armory Events" },
  { id: 2202, code: "fabpro", name: "Flesh and Blood Promos" },
  { id: 2409, code: "ele", name: "Tales of Aria - Unlimited" },
  { id: 2599, code: "op", name: "Organized Play" },
  { id: 2601, code: "jdg", name: "Judge Promos" },
  { id: 2902, code: "evr1", name: "Everfest - First" },
  { id: 3030, code: "1hp", name: "History Pack 1" },
  { id: 3031, code: "upr", name: "Uprising" },
  { id: 3068, code: "cru1", name: "Crucible of War - First" },
  { id: 3073, code: "arc1", name: "Arcane Rising - First" },
  { id: 3074, code: "mon1", name: "Monarch - First" },
  { id: 3075, code: "ele1", name: "Tales of Aria - First" },
  { id: 3130, code: "dyn", name: "Dynasty" },
  { id: 3223, code: "out", name: "Outsiders" },
  { id: 3267, code: "her", name: "Hero Card Promos" },
  { id: 3362, code: "dtd", name: "Dusk till dawn" },
  { id: 3465, code: "evo", name: "Bright Lights" },
  { id: 3559, code: "heh", name: "Heavy Hitters" },
  { id: 3783, code: "ros", name: "Rosetta" },
  { id: 3911, code: "rap", name: "Rosetta - Archive Pack" },
  { id: 3912, code: "map", name: "Part the Mistveil - Archive Pack" },
  { id: 3938, code: "hnt", name: "The Hunted" },
  { id: 3973, code: "gap", name: "Archive Mastery Pack - Guardian" },
  { id: 4055, code: "gem", name: "GEM Pack" },
  { id: 4116, code: "sea", name: "High Seas" },
  { id: 4153, code: "mpg", name: "Mastery Pack: Guardian" },
  { id: 4156, code: "sea-t", name: "High Seas - Treasure Pack" },
  { id: 4251, code: "sup", name: "Super Slam" },
];

async function fetchData() {
  try {
    const allCards = [];

    for (const expansion of MOCK_EXPANSIONS) {
      const response = await fetch(`${EXPANSION_URL}${expansion.id}`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });

      if (!response.ok) {
        console.error(`Falha ao buscar dados para expansion ID ${expansion.id}:`, response.statusText);
        continue;
      }

      const data = await response.json();

      // data é do tipo ResponseData = { id: Card[] }
      // Os valores são arrays de Cards, então juntamos todos
      const cardsArrays = Object.values(data);
      const cards = cardsArrays.flat();

      // Filtra apenas os cards assinados
      const signedCards = cards.filter(card => card.properties_hash?.signed === true);

      allCards.push(...signedCards);

      // Delay de 500ms para não exceder o rate limit
      await new Promise(r => setTimeout(r, 500));
    }

    salvarNomesEmArquivo(allCards);
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
  }
}

function salvarNomesEmArquivo(cards) {
  // Pega o nome em inglês de cada card
  const nomes = cards.map(card => card.name_en).join('\n');

  fs.writeFile('nomes_das_cartas.txt', nomes, err => {
    if (err) {
      console.error("Erro ao salvar arquivo:", err);
    } else {
      console.log("Arquivo nomes_das_cartas.txt salvo com sucesso!");
    }
  });
}

fetchData();
