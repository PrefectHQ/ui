import Vue from 'vue'
import VueApollo from 'vue-apollo'
import {
  createApolloClient,
  restartWebsockets
} from 'vue-cli-plugin-apollo/graphql-client'
import store from '@/store/index'
import { setContext } from 'apollo-link-context'

import { ApolloLink, Observable } from 'apollo-link'

import { BatchHttpLink } from 'apollo-link-batch-http'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from '@apollo/client'
import LogRocket from 'logrocket'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'authorization_token'

function isExpired(expiry) {
  return new Date().getTime() > expiry
}

function notExpired(expiry) {
  return !isExpired(expiry)
}

let errors = 0,
  apiErrors = 0

const { VUE_APP_REQUEST_CREDENTIALS_MODE: credentials } = process.env

const batchLink = new BatchHttpLink({
  batchMax: 25,
  batchInterval: 2000,
  credentials,
  uri: () => store.getters['api/url']
})

const httpLink = new HttpLink({
  credentials,
  uri: () => store.getters['api/url']
})

// Resets the cache and stops requests if
// the backend has changed
const backendMiddleware = new ApolloLink((operation, forward) => {
  const context = operation.getContext()
  if (context.headers?.['X-Backend'] !== store.getters['api/backend']) {
    defaultApolloClient.cache.reset()
    return
  }
  return forward(operation).map(response => {
    errors = 0
    apiErrors = 0
    return response
  })
})

// Used to identify the request in the server
const headerMiddleware = setContext((_, { headers }) => {
  headers['X-Prefect-UI'] = true
  headers['X-Backend'] = store.getters['api/backend']
  headers['X-Prefect-Tenant-ID'] = store.getters['tenant/tenant'].id
  headers['X-Prefect-User-ID'] = store.getters['user/user'].id

  return {
    headers: {
      ...headers
    }
  }
})

// After requests have been made, formats errors for the JS console
// to easily track the error sources in collapsible traces
const errorAfterware = onError(
  ({ response, operation, graphQLErrors, networkError, forward }) => {
    // Only throw the API error once in a row
    // (prevents spamming the console when there's no connection)
    if (operation.operationName === 'Api') {
      if (apiErrors > 0) {
        // TODO: fix this
        Observable
        // return Observable.of()
      }
      apiErrors++
    }

    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.groupCollapsed(
        `%c${operation.operationName || 'Unnamed Query'} error`,
        'color: #D64292; font-weight:bold;'
      )
      console.log('Operation: ', operation)

      if (graphQLErrors?.length > 0) {
        console.group('%cGraphQL Errors', 'color: #CA9800; font-weight:bold;')
        graphQLErrors?.forEach(error => {
          console.group(
            `%c${error.extensions?.code || 'ERROR'}`,
            'color: #B11A04; font-weight:bold;'
          )
          console.log(`Message: ${error.message}`)
          console.log('Full log: ', error)
          console.groupEnd()
        })
        console.groupEnd()
      }

      if (networkError) {
        console.group('%cNetwork Error', 'color: #CA9800; font-weight:bold;')
        console.log(networkError)
        console.groupEnd()
      }
      console.groupEnd()
      /* eslint-enable no-console */
    }

    if (
      store.getters['api/isCloud'] &&
      graphQLErrors?.[0].message === 'Operation timed out'
    ) {
      LogRocket.captureException(operation, {
        type: 'Timeout'
      })
      // For now we just capture Cloud errors,
      // we can expand this if it's helpful for debugging later
    } else if (
      (store.getters['api/isCloud'] && graphQLErrors) ||
      networkError
    ) {
      if (graphQLErrors) {
        LogRocket.captureException(graphQLErrors, {
          type: 'GraphQL Errors'
        })
      } else if (networkError)
        LogRocket.captureException(networkError, {
          type: 'Network Error'
        })
    }

    if (response) {
      response.errors = null
    }
    errors++
    if (errors > 10) {
      defaultApolloClient.stop()
    }
    // Can return Observable.of returned from error link to supress errors
    //  otherwise return forward(operation)
    // for a single retry of the failure
    // if (process.env.NODE_ENV !== 'production') return Observable.of()
    return forward(operation)
  }
)

export { errorAfterware }

// Adds authorization headers to requests headed for the Cloud API;
// just forwards requests if headed for a Server API
const authMiddleware = setContext(async (_, { headers }) => {
  if (store.getters['api/isServer']) {
    return {
      headers: {
        ...headers
      }
    }
  }

  const bearer = `Bearer ${store.getters['auth/authorizationToken']}`
  return {
    headers: {
      ...headers,
      authorization: bearer,
      'authorization-expiry': store.getters['auth/authorizationTokenExpiry']
    }
  }
})

// The last link in the chain before the request is sent;
// Checks that the request should be sent based on authorization header expiration
// and stops the request if it shouldn't be
const terminalRequestLink = new ApolloLink((operation, forward) => {
  if (store.getters['api/isServer']) return forward(operation)

  const context = operation.getContext()
  const expiration = context.headers?.['authorization-expiry']

  // If there's no expiration, we forward the operation
  if (!expiration) return forward(operation)

  // otherwise we check that the authorization header hasn't expired before
  // forwarding the request
  if (notExpired(expiration)) return forward(operation)
})

// Apollo link chain; acts as middleware for GraphQL queries
const link = ApolloLink.from([
  authMiddleware,
  headerMiddleware,
  backendMiddleware,
  errorAfterware,
  terminalRequestLink,
  batchLink
])

const fallbackLink = ApolloLink.from([
  authMiddleware,
  headerMiddleware,
  backendMiddleware,
  errorAfterware,
  terminalRequestLink,
  httpLink
])

export const cache = new InMemoryCache({
  resultCaching: false
})

// Config
export const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint: () => store.getters['api/url'],
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint: null,
  //'ws://localhost:4300',
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  defaultHttpLink: false,
  link: link,

  // Override default cache
  cache: cache,

  // Override the way the Authorization header is set
  // getAuth: () => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
  queryDeduplication: true
}

let defaultApolloClient
let fallbackApolloClient

// Create apollo client
export const createApolloProvider = (options = defaultOptions) => {
  const { apolloClient, wsClient } = createApolloClient({
    id: 'initial',
    ...options
  })
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network'
      },
      $subscription: {
        errorPolicy: 'all'
      }
    }
  })
  return apolloProvider
}

export const clearCache = () => {
  defaultApolloClient.cache.reset()
}

export const defaultApolloProvider = createApolloProvider()
defaultApolloClient = defaultApolloProvider.defaultClient
export { defaultApolloClient }

// This is the client we use that is not subject to the stop/restarts of the application
export const fallbackApolloProvider = createApolloProvider({
  ...defaultOptions,
  link: fallbackLink
})
fallbackApolloClient = fallbackApolloProvider.defaultClient
export { fallbackApolloClient }

export async function apolloOnLogin(apolloClient) {
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  await apolloClient.clearStore()
}

export async function apolloOnLogout(apolloClient) {
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  await apolloClient.clearStore()
}
