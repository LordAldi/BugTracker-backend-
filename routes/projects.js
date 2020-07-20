const express = require("express");
const router = express.Router();
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
async function createProject(data) {
  //   const { name, description, createdBy, modifiedBy, targetEnd } = data;
  const project = new Project({
    ...data,
  });
  return project;
}
async function getProjects(query) {
  const pageNumber = query.pn;
  const pageSize = query.pz;
  const projects = await Project.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ modified: 1 }); //1 asc -1 dsc
  // .select({ title: 1, description: 1, project: 1 });
  // .countDocuments();
  return projects;
}
async function getProjectById(id) {
  const project = await Project.findById(id);
  return project;
}
async function updateProject(id, data) {
  const project = await Project.findOneAndUpdate(
    { _id: id },
    { ...data },
    { new: true }
  );

  return project;
}
async function removeProject(id) {
  const project = await Project.findOneAndRemove({ _id: id });
  return project;
}

router.get("/", async (req, res) => {
  const projects = await getProjects(req.query);
  res.send(projects);
});
router.get("/:id", async (req, res) => {
  const project = await getProjectById(req.params.id);
  if (!project)
    return res.status(404).send("project with the given ID was not found");
  res.send(project);
});
router.post("/", async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let project = await createProject(req.body);
  try {
    project = await project.save();
    res.send(project);
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateUpdateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const project = await updateProject(req.params.id, req.body);

    if (!project)
      return res.status(404).send("project with the given ID was not found");
    res.send(project);
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await removeProject(req.params.id);
    if (!project)
      return res.status(404).send("Project with the given ID was not found");
    res.send({ ...project._doc, message: "Project deleted successfully" });
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
});

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
module.exports = router;
