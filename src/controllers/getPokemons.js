const puppeteer = require("puppeteer");
const { url } = require("../config/config.json");

const scrapeInfiniteScrollItems = async (
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000
) => {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(scrollDelay);
    }
  } catch (e) {}
  return items;
};

const pokemonsList = () => {
  const idPokemons = document.querySelectorAll(".pokemon-info > .id");
  const namePokemons = document.querySelectorAll(".pokemon-info > h5");
  const typesPokemons = document.querySelectorAll(".pokemon-info");

  let pokemonsList = [];

  for (let i = 0; i < namePokemons.length; i++) {
    let types = typesPokemons[i].children;
    const pokemon = {
      id: idPokemons[i].innerText,
      name: namePokemons[i].innerText,
      types: [...types].slice(2).map((type) => type.innerText),
    };
    pokemonsList.push(pokemon);
  }

  return pokemonsList;
};

const getPokemons = async () => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1440,
      height: 900,
    });
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
    );
    // page.setDefaultNavigationTimeout(100000);
    await page.goto(`${url}/`, {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("a#loadMore");
    await page.click("a#loadMore");
    await page.waitFor(10000);
    const pokemons = await scrapeInfiniteScrollItems(page, pokemonsList, 893);

    await browser.close();
    return pokemons;
  } catch (e) {
    throw e;
  }
};

module.exports = getPokemons;
