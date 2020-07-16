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
  })
  .then(() => debug("Connected to MongoDb"))
  .catch((err) => console.error("Could not connect to mongoDB..."));
app.use(express.json());
app.use(helmet());
app.use("/api/tickets", tickets);
app.use("/", home);
const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  project: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  assigenedTo: [String],
  attachment: [String],
  priority: String,
  type: String,
  owner: String,
  history: [String],
});
const Ticket = mongoose.model("ticket", ticketSchema);

async function createTicket() {
  const ticket = new Ticket({
    title: "world",
    description: "this is",
    project: "meeaaww",
    assigenedTo: ["usera", "user b"],
    attachment: [],
    priority: "high",
    type: "feature request",
    owner: "usera",
    history: [""],
  });

  const result = await ticket.save();
  debug(result);
}
async function getTickets() {
  const pageNumber = 1;
  const pageSize = 10;
  const tickets = await Ticket.find({ priority: "high" })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ title: 1 }) //1 asc -1 dsc
    .select({ title: 1, description: 1, project: 1 });
  // .countDocuments();
  debug(tickets);
}
async function updateTicket(id) {
  // const ticket = await Ticket.findById(id);
  // if (!ticket) return;
  // ticket.set({
  //   title: "new title",
  //   project: "new project",
  // });
  // const result = await ticket.save();

  // const result = await Ticket.updateOne(
  //   { _id: id },
  //   {
  //     $set: {
  //       title: "new title new",
  //       project: "new project new",
  //     },
  //   }
  // );

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    {
      $set: {
        title: "new2",
        project: "new2  new",
      },
    },
    { new: true }
  );

  debug(ticket);
}
async function removeTicket(id) {
  const result = await Ticket.deleteOne({ _id: id });
  debug(result);
}
// createTicket();
// getTickets();
// updateTicket("5f0fb91b5ac9095664ea0368");
removeTicket("5f0fb91b5ac9095664ea0368");

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug(`Morgan enabled`);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
