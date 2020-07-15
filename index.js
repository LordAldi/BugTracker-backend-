const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

const tickets = [
  {
    id: 1,
    title: "hallo",
    description: "world",
    project: "test project",
    created: "",
    updated: "",
    assigenedTo: "",
    attachment: "",
    priority: "low, medium,high, critical",
    type: "error report, feature request, service request, other",
    owner: "",
    history: "",
  },
  {
    id: 2,
    title: "hallo2",
    description: "world 2",
    project: "test project 2",
    created: "",
    updated: "",
    assigenedTo: "",
    attachment: "",
    priority: "low, medium,high, critical",
    type: "error report, feature request, service request, other",
    owner: "",
    history: "",
  },
  {
    id: 3,
    title: "hallo3",
    description: "world 3",
    project: "test project 2",
    created: "",
    updated: "",
    assigenedTo: "",
    attachment: "",
    priority: "low, medium,high, critical",
    type: "error report, feature request, service request, other",
    owner: "",
    history: "",
  },
  {
    id: 4,
    title: "hallo4",
    description: "world 4",
    project: "test project 2",
    created: "",
    updated: "",
    assigenedTo: "",
    attachment: "",
    priority: "low, medium,high, critical",
    type: "error report, feature request, service request, other",
    owner: "",
    history: "",
  },
];

app.get("/", (req, res) => {
  res.send("hallo world");
});
app.get("/api/tickets", (req, res) => {
  res.send(tickets);
});
app.get("/api/tickets/:id", (req, res) => {
  const ticket = tickets.find((t) => t.id === parseInt(req.params.id));
  if (!ticket)
    return res.status(404).send("Ticket with the given ID was not found");
  res.send(ticket);
});
app.post("/api/tickets", (req, res) => {
  const { error } = validateTicket(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const ticket = {
    ...tickets[0],
    id: tickets.length + 1,
    title: req.body.title,
    description: req.body.description,
    project: `project${tickets.length + 1}`,
  };
  tickets.push(ticket);
  res.send(ticket);
});

app.put("/api/tickets/:id", (req, res) => {
  const ticket = tickets.find((t) => t.id === parseInt(req.params.id));
  if (!ticket)
    return res.status(404).send("Ticket with the given ID was not found");

  const { error } = validateTicket(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  ticket.title = req.body.title;
  ticket.description = req.body.description;
  res.send(ticket);
});

app.delete("/api/tickets/:id", (req, res) => {
  const ticket = tickets.find((t) => t.id === parseInt(req.params.id));
  if (!ticket)
    return res.status(404).send("Ticket with the given ID was not found");

  const index = tickets.indexOf(ticket);
  tickets.splice(index, 1);

  res.send(ticket);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));

validateTicket = (ticket) => {
  const schema = {
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
  };
  return Joi.validate(ticket, schema);
};
