import { GraphQLInt, GraphQLSchema, GraphQLString , GraphQLObjectType, GraphQLList, GraphQLNonNull } from "graphql";
import _ from "lodash" ; 
import axios from "axios";

// schema creation...
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: { 
            type: GraphQLList(UserType), 
            resolve: async (parent, args) => {
                const res = await axios.get(`http://localhost:3000/companies/${parent.id}/users`) 
                return res.data ; 
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: { 
            type: CompanyType, 
            resolve: async (parent, args) => {
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
        user: {
            type: UserType,
            args: { id: { type: GraphQLString }},
            resolve: async (parent, args) => {
                    const res = await axios.get(`http://localhost:3000/users/${args.id}`) 
                    return res.data ;
            }
        },
       company:{
           type: CompanyType,
           args: { id: {type: GraphQLString }},
           resolve: async (parent, args) => {
               const res = await axios.get(`http://localhost:3000/companies/${args.id}`)
               return res.data ; 
           }
       }
    }
});

// queries by which we will make mutation..
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
            resolve: async (parent , args) => {
                const res =  await axios.post('http://localhost:3000/users', { ...args })
                return res.data ; 
            }
        },

        deleteUser: {
            type: UserType,
            args: { id: {type: new GraphQLNonNull(GraphQLString) }},
            resolve: async (parent, args) => {
                const res = await axios.delete(`http://localhost:3000/users/${args.id}`)
                return res.data ; 
            } 
        },

        editUser: {
            type: UserType,
            args: { 
                id: {type: new GraphQLNonNull(GraphQLString) },
                firstName: {type:  GraphQLString},
                age: {type: GraphQLInt },
                companyId: {type: GraphQLString }
            },
            resolve: async (parent, {id, firstName, age, companyId}) =>{
                const res = await axios.put(`http://localhost:3000/users/${id}`, {firstName, age, companyId})
                return res.data ; 
            } 
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
