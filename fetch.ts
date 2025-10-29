// get your BEARER_TOKEN key here: https://www.cardtrader.com/docs/api/full/reference
const BEARER_TOKEN = "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjYXJkdHJhZGVyLXByb2R1Y3Rpb24iLCJzdWIiOiJhcHA6MTA4MjgiLCJhdWQiOiJhcHA6MTA4MjgiLCJleHAiOjQ5MTQ5NTA1NzksImp0aSI6ImMxYjQyOGM5LWNhYTQtNGEwNi1iZDU4LTA3NDI1ZDU1YWY2NiIsImlhdCI6MTc1OTI3Njk3OSwibmFtZSI6IlJvYmVydHppbW1pIEFwcCAyMDI0MDYyNDE5MTMyMSJ9.QTWTcd_hZYRosDo544CB_Y6Net99sGf78fIu-0ttbrDE6RTTmleaRa3-pDqN1fsFzJd6cam8_ic6R-xOHCGXQZLoTtyg99_H6kGbqDPFAVjvStEQgSoxR_uf3Jta-rAJMIIAkQwsRFGCP_H8WC0bS591c7WBKB2s-xcehVNKTcqnpaO3Vs-C_INtIfvp18MKeGILyCy3SlnAiPtgZ_c0L8eM1bFlXVV0oTQ665skZWaCrJkZLwf75sopP7AIuMGCZpGhoe-UMWUKi9gNnUdrO75enJR4w4Yuhoh7ezJ2jsfgDPRmDNzivC6v9yfJy-du3ZEOztpMt68SFXXDZU0xdQ";
const BASE_URL = "https://api.cardtrader.com/api/v2";
const EXPANSION_URL = `${BASE_URL}/marketplace/products?expansion_id=`;
const allData: Card[] = [];
// ...Card, ResponseData from types.ts
// ...MOCK_EXPANSIONS from mock_expansions.ts

const fetchData = async () => {
  try {
    for (const expansion of MOCK_EXPANSIONS) {
      const response = await fetch(`${EXPANSION_URL}${expansion.id}`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data for expansion ID ${expansion.id}`
        );
      }
      const data = (await response.json()) as ResponseData;
      const filteredData = Object.values(data).flatMap(
        (array) =>
          array.filter(
            (item: Card) => item.properties_hash.signed === true
          ) as Card[]
      );

      allData.push(filteredData);

      // Add a delay of 500ms (2 requests per second)
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setData(allData.flat());
  } catch (error) {
    // add error handling
  } finally {
    console.log({ allData });
  }
};

fetchData();

function setData(arg0: Card[]) {
  throw new Error("Function not implemented.");
}
