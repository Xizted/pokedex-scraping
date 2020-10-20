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
      e,
    });
  }
});

app.get("/pokemon/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pokemonList = await getPokemons();
    const pokemon = await getDetailPokemon(id, pokemonList);

    res.status(200).json({
      ok: true,
      mensaje: "Peticion realizada correctamente",
      pokemon,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      e,
    });
  }
});

module.exports = app;
