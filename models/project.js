const Joi = require("joi");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  description: String,
  created: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  modified: { type: Date, default: Date.now },
  modifiedBy: { type: String, required: true },
  targetEnd: { type: Date },
  actualEnd: { type: Date },
  isFinish: { type: Boolean, required: true, default: false },
});
const Project = mongoose.model("project", projectSchema);

validateProject = (project) => {
  const schema = {
    name: Joi.string().min(3).required(),
    description: Joi.string(),
    createdBy: Joi.string().required(),
    modifiedBy: Joi.string().required(),
  };
  return Joi.validate(project, schema);
};
validateUpdateProject = (project) => {
  const schema = {
    name: Joi.string().min(3),
    description: Joi.string(),
    modifiedBy: Joi.string().required(),
    isFinish: Joi.bool(),
  };
  return Joi.validate(project, schema);
};

exports.Project = Project;
exports.validate = validateProject;
exports.validateUpdate = validateUpdateProject;
