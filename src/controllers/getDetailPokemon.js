const puppeteer = require("puppeteer");
const { url } = require("../config/config.json");

const getDetailPokemon = async (id, pokemonList) => {
  const [pokemon] = pokemonList.filter((pokemon) => `#${pokemon.id}` === id);

  if (!pokemon) throw new Error("El id no es valido");

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: false
    });
    const page = await browser.newPage();
    // page.setDefaultNavigationTimeout(100000);
    await page.goto(`${url}/${pokemon.name.toLowerCase()}`, {
      waitUntil: "networkidle0",
    });

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
