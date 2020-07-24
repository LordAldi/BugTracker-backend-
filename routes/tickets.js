const express = require("express");
const router = express.Router();
const { Ticket, validate, validateUpdate } = require("../models/ticket");

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
    .sort({ updated: 1 }); //1 asc -1 dsc
  // .select({ title: 1, description: 1, project: 1 });
  // .countDocuments();
  return tickets;
}
async function getTicketById(id) {
  const ticket = await Ticket.findById(id);
  return ticket;
}
async function updateTicket(id, data) {
  const ticket = await Ticket.findOneAndUpdate(
    { _id: id },
    { ...data },
    { new: true }
  );

  return ticket;
}
async function removeTicket(id) {
  const ticket = await Ticket.findOneAndRemove({ _id: id });
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
  const { error } = validate(req.body);
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
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const ticket = await updateTicket(req.params.id, req.body);

    if (!ticket)
      return res.status(404).send("Ticket with the given ID was not found");
    res.send(ticket);
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ticket = await removeTicket(req.params.id);
    if (!ticket)
      return res.status(404).send("Ticket with the given ID was not found");
    res.send({ ...ticket._doc, message: "Ticket deleted successfully" });
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
});

module.exports = router;
