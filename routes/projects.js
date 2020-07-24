const express = require("express");
const router = express.Router();
const { Project, validate, validateUpdate } = require("../models/project");

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
  const { error } = validate(req.body);
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
  const { error } = validateUpdate(req.body);
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

module.exports = router;
