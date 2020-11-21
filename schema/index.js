import { GraphQLInt, GraphQLSchema, GraphQLString , GraphQLObjectType, GraphQLList, GraphQLNonNull } from "graphql";
import _ from "lodash" ; 
import axios from "axios";

// schema creation...
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString, resolve: (parent, _) =>  parent.id},
        name: { type: GraphQLString,  resolve: (parent, _) => parent.name },
        description: { type: GraphQLString, resolve: (parent, _) => parent.description },
        users: { 
            type: GraphQLList(UserType), 
            resolve: async (parent, _) => {
                const res = await axios.get(`http://localhost:3000/companies/${parent.id}/users`) 
                return res.data ; 
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString, resolve: (parent, _) => parent.id },
        firstName: {type: GraphQLString, resolve: (parent, _) => parent.firstName },
        age: {type: GraphQLInt, resolve: (parent, _) => parent.age },
        company: { 
            type: CompanyType, 
            resolve: async (parent, _args) => {
                console.log(parent);
                    const res = await axios.get(`http://localhost:3000/companies/${parent.companyId}`) 
                    return res.data ;
            }
        }
    })
});

// query by which we will fetch the data ... 
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType', 
    fields:{
        users: {
            type: GraphQLList(UserType),
            description: 'this searches for users',
            resolve: async (_, args) => {
                const res = await axios.get(`http://localhost:3000/users/`) 
                return res.data 
            }
        },
        companies: {
            type: GraphQLList(CompanyType),
            description: 'this searches for comapnies',
            resolve: async (_, args) => {
            const res = await axios.get(`http://localhost:3000/companies/`) 
            return res.data 
            }
        },
        user: {
            type: UserType,
            description: 'this searches for users for the specific id',
            args: { id: { type: GraphQLString }},
            resolve: async (_, args) => {
                    const res = await axios.get(`http://localhost:3000/users/${args.id}`) 
                    return res.data ;
            }
        },
       company:{
           type: CompanyType,
           description: 'this searches for comapnies for the specific id',
           args: { id: {type: GraphQLString }},
           resolve: async (_, args) => {
               const res = await axios.get(`http://localhost:3000/companies/${args.id}`)
               return res.data ; 
           }
       }
    }
});

// query by which we will make mutation ...
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{
        addUser: {
            type: UserType,
            args: {
                firstName: { type:  new GraphQLNonNull(GraphQLString) },
                age: {type:  new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve: async (_ , args) => {
                const res =  await axios.post('http://localhost:3000/users', { ...args })
                return res.data ; 
            }
        },

        deleteUser: {
            type: UserType,
            args: { id: {type: new GraphQLNonNull(GraphQLString) }},
            resolve: async (_, args) => {
                const res = await axios.delete(`http://localhost:3000/users/${args.id}`)
                return res.data ; 
            } 
        },

        editUser: {
            type: UserType,
            args: { 
                id: {type: new GraphQLNonNull(GraphQLString), resolve: (parent, _) => parent.id },
                firstName: {type:  GraphQLString},
                age: {type: GraphQLInt },
                companyId: {type: GraphQLString }
            },
            resolve: async (_parent, { id, firstName, age, companyId }) => {
                const res = await axios.put(`http://localhost:3000/users/${id}`, { firstName, age, companyId })
                return res.data ; 
            } 
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
