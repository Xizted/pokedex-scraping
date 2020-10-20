const express = require("express");
const app = express();
const getPokemons = require("../controllers/getPokemons");
const getDetailPokemon = require("../controllers/getDetailPokemon");

app.get("/pokemon", async (req, res) => {
  try {
    const pokemons = await getPokemons();

    res.status(200).json({
      ok: true,
      pokemons,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        name: e.name,
        message: e.message,
      },
    });
  }
});

app.get("/pokemon/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(parseInt(id)))
      throw new Error(`ID invalido, el ID debe ser valores numericos`);
    if (id.length != 3)
      throw new Error(`ID invalido, el ID debe contener 3 valores numericos`);
    const pokemon = await getDetailPokemon(id);
    res.status(200).json({
      ok: true,
      mensaje: "Peticion realizada correctamente",
      pokemon,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        name: e.name,
        message: e.message,
      },
    });
  }
});

module.exports = app;
