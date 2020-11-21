import express from 'express';
import { graphqlHTTP } from 'express-graphql'; // ES6
import UserSchema from "./schema";

// import homeController from './controller/homeController';

const app = express();

app.use("/graphql" , graphqlHTTP({
    schema: UserSchema,
    graphiql: true,
}));

// app.use("/", homeController);

// tslint:disable-next-line: no-console
app.listen(4001, () => console.log("app is listeing on port 4001"));