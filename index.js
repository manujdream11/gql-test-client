const gql = require("graphql-tag");
const createPersistedQueryLink = require("apollo-link-persisted-queries").createPersistedQueryLink;
const ApolloClient = require("apollo-client").ApolloClient;
const ApolloLink = require("apollo-link");
const fetch = require("node-fetch");
const createHttpLink = require("apollo-link-http").createHttpLink;
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;

const httpLink = createHttpLink({
    uri: "http://localhost:4000",
    fetch: fetch
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

const link = ApolloLink.from([
    createPersistedQueryLink({ useGETForHashedQueries: true }),
    httpLink
]);

const persistentClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});

const run = async function () {
    for(let i=0; i<5; i++) {
        let start = new Date().getTime();
        let res = await persistentClient.query({
            query: gql`{ media(id: 930) {title}}`
        });
        let end = new Date().getTime();
        console.log(end-start);
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

run().then(res => console.log(res));
