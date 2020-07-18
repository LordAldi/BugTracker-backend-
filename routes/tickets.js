const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  description: String,
  project: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  assigenedTo: [String],
  attachment: [String],
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high", "critical"],
    lowercase: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["error report", "feature request", "service request", "other"],
    lowercase: true,
  },
  owner: { type: String, required: true },
  history: [String],
});
const Ticket = mongoose.model("ticket", ticketSchema);

async function createTicket(data) {
  const {
    title,
    description,
    project,
    assigenedTo,
    attachment,
    priority,
    type,
    owner,
  } = data;
  const ticket = new Ticket({
    title: title,
    description: description,
    project: project,
    assigenedTo: assigenedTo,
    attachment: attachment,
    priority: priority,
    type: type,
    owner: owner,
  });
  return ticket;
}
async function getTickets(query) {
  const pageNumber = query.pn;
  const pageSize = query.pz;
  const tickets = await Ticket.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ title: 1 }); //1 asc -1 dsc
  // .select({ title: 1, description: 1, project: 1 });
  // .countDocuments();
  return tickets;
}
async function getTicketById(id) {
  const ticket = await Ticket.findById(id);
  return ticket;
}
async function updateTicket(id, data) {
  const ticket = await Ticket.findByIdAndUpdate(
    id,
    {
      $set: {
        ...data,
      },
    },
    { new: true }
  );

  return ticket;
}
async function removeTicket(id) {
  const ticket = await Ticket.findByIdAndRemove(id);
  return ticket;
}

router.get("/", async (req, res) => {
  const tickets = await getTickets(req.query);
  res.send(tickets);
});
router.get("/:id", async (req, res) => {
  const ticket = await getTicketById(req.params.id);
  if (!ticket)
    return res.status(404).send("Ticket with the given ID was not found");
  res.send(ticket);
});
router.post("/", async (req, res) => {
  const { error } = validateTicket(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let ticket = await createTicket(req.body);
  try {
    ticket = await ticket.save();
    res.send(ticket);
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateUpdateTicket(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ticket = await updateTicket(req.params.id, req.body);

  if (!ticket)
    return res.status(404).send("Ticket with the given ID was not found");

  try {
    console.log("try");
    res.send(ticket);
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
});

router.delete("/:id", async (req, res) => {
  const ticket = await removeTicket(req.params.id);
  if (!ticket)
    return res.status(404).send("Ticket with the given ID was not found");

  try {
    ticket = await ticket.save();
    res.send(ticket);
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
});

validateTicket = (ticket) => {
  const schema = {
    title: Joi.string().min(3).required(),
    description: Joi.string(),
    project: Joi.string().min(3).required(),
    assigenedTo: Joi.array(),
    attachment: Joi.array(),
    priority: Joi.string().required(),
    type: Joi.string().required(),
    owner: Joi.string().required(),
  };
  return Joi.validate(ticket, schema);
};
validateUpdateTicket = (ticket) => {
  const schema = {
    title: Joi.string().min(3),
    description: Joi.string(),
    project: Joi.string().min(3),
    assigenedTo: Joi.array(),
    attachment: Joi.array(),
    priority: Joi.string(),
    type: Joi.string(),
    owner: Joi.string(),
  };
  return Joi.validate(ticket, schema);
};
module.exports = router;
