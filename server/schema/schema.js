const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const clientModel = require("../models/client.model");
const projectModel = require("../models/project.model");
const {
  findClients,
  addClient,
  deleteClient,
} = require("../query/client.query");
const {
  findProjects,
  addProject,
  deleteProject,
  updateProject,
} = require("../query/project.query");
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
      async resolve(parent, args) {
        const fetchedClients = await findClients({ _id: parent.clientId });
        return fetchedClients[0];
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
      async resolve(parent, args) {
        return await findProjects({});
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const fetchedProject = await findProjects({ _id: args.id });
        return fetchedProject[0];
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      async resolve(parent, args) {
        return await findClients({});
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const fetchedClient = await findClients({ _id: args.id });
        return fetchedClient[0];
      },
    },
  },
});

//Mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //Add a Client
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

    //Delete a client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        projectModel.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => {
            project.remove();
          });
        });
        return await deleteClient(args.id);
      },
    },

    //Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return addProject({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
      },
    },

    //Delete a project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        return await deleteProject(args.id);
      },
    },

    //Update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
      },
      async resolve(parent, args) {
        return await updateProject(args.id, {
          name: args.name,
          description: args.description,
          status: args.status,
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
