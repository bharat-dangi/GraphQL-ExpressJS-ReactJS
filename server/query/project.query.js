const projectModel = require("../models/project.model");

const findProjects = async (query) => {
  try {
    const fetchedProjects = await projectModel.find(query);
    return fetchedProjects;
  } catch (error) {
    return error.message;
  }
};

module.exports = { findProjects };
