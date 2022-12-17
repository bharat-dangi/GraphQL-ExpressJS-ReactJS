const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const {
  findClients,
  addClient,
  deleteClient,
} = require("../query/client.query");
const { findProjects } = require("../query/project.query");
const { clients, projects } = require("../sampleData");

//Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return findClients({ _id: parent.clientId });
      },
    },
  }),
});

//Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return findProjects({});
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return findProjects({ _id: args.id });
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return findClients({});
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return findClients({ _id: args.id });
      },
    },
  },
});

//Mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //Add CLient
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return addClient({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
      },
    },

    //Delete client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return deleteClient(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
