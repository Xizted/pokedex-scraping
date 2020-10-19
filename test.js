const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(300000);
  await page.goto(`https://www.pokemon.com/us/pokedex/charizard`, {
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
  console.log(pokemon);
})();
