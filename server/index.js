const express = require("express");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const colors = require("colors");
const cors = require("cors");
const dbConfig = require("./config/db.config");

const PORT = process.env.PORT || 5000;

const app = express();

//Connect to database
dbConfig();
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send("Working");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
