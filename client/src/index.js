
import React from "react"
import App from "./App.js"
import ReactDOM from "react-dom"
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
  } from "@apollo/client";
  import { createUploadLink } from 'apollo-upload-client'

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
      uri: "http://localhost:4000/graphql",
    }),
  });
  
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById("root")
  );