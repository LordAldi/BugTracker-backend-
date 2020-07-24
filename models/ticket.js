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

validateTicket = (ticket) => {
  const schema = {
    title: Joi.string().min(3).required(),
    description: Joi.string(),
    project: Joi.string().min(3).required(),
    assigenedTo: Joi.array(),
    attachment: Joi.array(),
    priority: Joi.string()
      .valid(["low", "medium", "high", "critical"])
      .required(),
    type: Joi.string()
      .valid(["error report", "feature request", "service request", "other"])
      .required(),
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
    priority: Joi.string().valid(["low", "medium", "high", "critical"]),
    type: Joi.string().valid([
      "error report",
      "feature request",
      "service request",
      "other",
    ]),
    owner: Joi.string(),
  };
  return Joi.validate(ticket, schema);
};

exports.Ticket = Ticket;
exports.validate = validateTicket;
exports.validateUpdate = validateUpdateTicket;
