const clientModel = require("../models/client.model");

const findClients = async (query) => {
  try {
    const fetchedClients = await clientModel.find(query);
    return fetchedClients;
  } catch (error) {
    return error.message;
  }
};

const addClient = async (client) => {
  try {
    const newClient = await clientModel(client);
    return newClient.save();
  } catch (error) {
    return error.message;
  }
};

const deleteClient = async (id) => {
  try {
    return await clientModel.findByIdAndRemove(id);
  } catch (error) {
    return error.message;
  }
};

module.exports = { findClients, addClient, deleteClient };
