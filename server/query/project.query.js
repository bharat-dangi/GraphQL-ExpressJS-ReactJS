const projectModel = require("../models/project.model");

const findProjects = async (query) => {
  try {
    const fetchedProjects = await projectModel.find(query);
    return fetchedProjects;
  } catch (error) {
    return error.message;
  }
};

const addProject = async (data) => {
  try {
    const newProject = new projectModel(data);
    return newProject.save();
  } catch (error) {
    return error.message;
  }
};

const deleteProject = async (id) => {
  try {
    return await projectModel.findByIdAndRemove(id);
  } catch (error) {
    return error.message;
  }
};

const updateProject = async (id, data) => {
  try {
    return await projectModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
  } catch (error) {
    return error.message;
  }
};

module.exports = { findProjects, addProject, deleteProject, updateProject };
