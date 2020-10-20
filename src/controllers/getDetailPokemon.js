const puppeteer = require("puppeteer");
const { url } = require("../config/config.json");

const getDetailPokemon = async (id) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1440,
      height: 900,
    });
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
    );
    page.setDefaultNavigationTimeout(100000);
    await page.goto(`${url}/`, {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector(
      "section.section.pokedex-results.overflow-visible > ul > li"
    );
    await page.waitForSelector("#searchInput");
    await page.waitForSelector("#search");
    await page.focus("#searchInput");
    await page.keyboard.type(id);
    await page.click("#search");
    await page.waitForTimeout(3000);
    await page.waitForSelector(
      "section.section.pokedex-results.overflow-visible > ul > li > figure > a"
    );
    await page.click(
      "section.section.pokedex-results.overflow-visible > ul > li > figure > a"
    );
    await page.waitForTimeout(3000);
    const pokemon = await page.evaluate(() => {
      const [name, id] = document
        .querySelector(".pokedex-pokemon-pagination-title > div")
        .innerText.split(" ");

      const [
        height,
        weight,
        genderSpan,
        category,
        abilities,
      ] = document.querySelectorAll(".attribute-value");
      const [...genders] = genderSpan.children;
      const genderArr = genders.map((gender) => gender.className.slice(10, -7));
      const types = document
        .querySelector(".dtm-type")
        .innerText.split(/[\r\n]+/);
      const weaknesses = document
        .querySelector(".dtm-weaknesses")
        .innerText.split(/[\r\n]+/);
      types.shift();
      weaknesses.shift();

      return {
        id,
        name,
        height: height.innerText,
        weight: weight.innerText,
        gender: genderArr,
        category: category.innerText,
        abilities: abilities.innerText,
        types,
        weaknesses,
      };
    });

    await browser.close();
    return pokemon;
  } catch (e) {
    throw e;
  }
};

module.exports = getDetailPokemon;
