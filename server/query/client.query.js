const clientModel = require("../models/client.model");

const findClients = async (query) => {
  try {
    const fetchedClients = await clientModel.find(query);
    return fetchedClients;
  } catch (error) {
    return error.message;
  }
};

module.exports = { findClients };
