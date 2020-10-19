const express = require("express");
const app = express();
const port = 3000;

// Import Routes

const appRoutes = require("./routes/app");
const pokemonRoutes = require("./routes/pokemon");
// Routes

app.use("/", appRoutes);
app.use("/api", pokemonRoutes);

app.listen(process.env.PORT || port, () => {
  console.log(`Server Running on localhost, port:${port}`);
});
