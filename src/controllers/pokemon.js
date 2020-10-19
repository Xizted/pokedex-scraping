const puppeteer = require("puppeteer");
const { url } = require("../config/config.json");

const getPokemons = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
     page.setDefaultNavigationTimeout(100000);
    await page.goto(`${url}/`, {
      waitUntil: "networkidle0",
    });
    const pokemons = await page.evaluate(() => {
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
    });

    await browser.close();
    return pokemons;
  } catch (e) {
    return e;
  }
};

const getPokemon = async (name) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(100000);
    await page.goto(`${url}/${name.toLowerCase()}`, {
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
    return e;
  }
};

module.exports = {
  getPokemons,
  getPokemon,
};
