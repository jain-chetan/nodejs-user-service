const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./router/router")
const app = express();
const port = process.env.PORT || 3001;
require("./config/mongoose")(app);
app.use(bodyParser.json());

app.use("/users", usersRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});