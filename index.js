const debug = require("debug")("BugTracker:startup");
const mongoose = require("mongoose");
//set DEBUG=BugTracker:startup,BugTracker:db || BugTracker:*
//set DEBUG=BugTracker:startup nodemon index.js
// const dbDebugger = require("debug")("BugTracker:db");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");

const tickets = require("./routes/tickets");
const home = require("./routes/home");
const express = require("express");
const app = express();
mongoose
  .connect(config.get("mongodb.server"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => debug("Connected to MongoDb"))
  .catch((err) => console.error("Could not connect to mongoDB..."));
app.use(express.json());
app.use(helmet());
app.use("/api/tickets", tickets);
app.use("/", home);

// createTicket();
// getTickets();
// updateTicket("5f0fb91b5ac9095664ea0368");
// removeTicket("5f0fb91b5ac9095664ea0368");

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug(`Morgan enabled`);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
