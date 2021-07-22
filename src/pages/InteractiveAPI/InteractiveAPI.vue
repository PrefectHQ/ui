<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import { print } from 'graphql'
import React from 'react'
import ReactDOM from 'react-dom'
import GraphiQL from 'graphiql'

export default {
  data() {
    return {
      defaultQuery:
        this.role === 'READ_ONLY_USER'
          ? 'Sorry, this page is not available to Read-only users.'
          : `# Enter your query or mutation here
# Example:

query { hello }

# Queries are limited to 100 results, inline query limits under 100 will be respected
# To paginate results, add the 'offset' argument`,
      readOnly: this.role === 'READ_ONLY_USER',
      queriesWithoutLimits: [
        'agent',
        'agents',
        '_aggregate',
        'api',
        'auth_info',
        'authInfo',
        // *_by_pk queries are helper queries that don't have offset and limit
        // arguments since by their nature they return just 1 result using a
        // UUID!
        '_by_pk',
        'hello',
        'preview_invoice',
        'reference',
        'reference_data',
        'task_tag_limit',
        'taskTagUsage',
        'task_tag_usage',
        'mapped_children',
        'permissions_info',
        'secretNames',
        'secret_names',
        'secretValue',
        'secret_value',
        'users'
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['authorizationToken']),
    ...mapGetters('api', ['url']),
    ...mapGetters('tenant', ['role'])
  },
  async mounted() {
    let urlQuery
    if (this.$route.query.query) {
      urlQuery = print(gql`
        ${this.$route.query.query}
      `)
    }
    const fetcher = params => {
      params.query = this.addQueryLimits(params.query)
      return fetch(this.url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.authorizationToken}`,
          'X-Prefect-Interactive-API': 'true'
        },
        body: JSON.stringify(params)
      }).then(res => {
        return res.json()
      })
    }
    const encodeComponent = component => {
      return encodeURIComponent(component)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22')
    }
    const encodeQuery = query => {
      let variables = ''
      if (this.$router.history.current.query.variables) {
        variables =
          '&variables=' +
          encodeComponent(this.$router.history.current.query.variables)
      }
      return this.$router.push('?query=' + encodeComponent(query) + variables)
    }
    const encodeVariables = vars => {
      let query = '?query='
      if (this.$router.history.current.query.query) {
        query += encodeComponent(this.$router.history.current.query.query)
      }
      return this.$router.push(query + '&variables=' + encodeComponent(vars))
    }
    /* eslint-disable no-undef */
    ReactDOM.render(
      React.createElement(GraphiQL, {
        fetcher,
        query: urlQuery,
        defaultQuery: this.defaultQuery,
        readOnly: this.readOnly,
        onEditQuery: encodeQuery,
        onEditVariables: encodeVariables
      }),
      /* eslint-enable no-undef */
      document.getElementById('graphiql')
    )
  },
  methods: {
    addQueryLimits(query) {
      if (query.includes('IntrospectionQuery')) return query
      const queryObject = gql`
        ${query}
      `

      // Mutations don't need to be limited (and also limits are supported on mutations)
      if (queryObject.definitions?.[0]?.operation == 'mutation') return query

      queryObject.definitions[0].selectionSet.selections.forEach(selection => {
        // Exclude queries that do not support limiting
        let exclude = false
        this.queriesWithoutLimits.forEach(query => {
          exclude = selection.name.value.includes(query) ? true : exclude
        })

        if (exclude) return

        let limitArg = {
          kind: 'Argument',
          manual: true,
          name: { kind: 'Name', value: 'limit' },
          value: {
            kind: 'IntValue',
            value: 100
          }
        }

        let limitIndex = selection.arguments.findIndex(
          arg => arg.name.value == 'limit'
        )

        if (
          limitIndex > -1 &&
          selection.arguments[limitIndex].value.value > 100
        ) {
          selection.arguments[limitIndex] = limitArg
        } else if (limitIndex == -1) {
          selection.arguments.push(limitArg)
        }
      })

      return print(queryObject)
    }
  }
}
</script>

<template>
  <div
    id="graphiql"
    style="height: calc(100vh - 64px);
    padding-bottom: 0;"
  ></div>
</template>

<style lang="scss">
@import '../../styles/graphiql.css';
$toolbar-black: var(--v-appBackground-base);
$divider-gray: var(--v-appForeground-base);
$brackets-gray: var(--v-utilGrayMid-base);
/* stylelint-disable selector-class-pattern */
/* since we're not writing these class names, we can't abide by stylelint's naming rules */
.CodeMirror-info {
  // this popover isn't technically inside the container
  background: $divider-gray;

  .info-description {
    color: var(--v-utilGrayDark-base);
  }

  .type-name {
    color: var(--v-accentCyan-base);
  }

  .field-name {
    color: var(--v-accentOrange-base);
  }
}

.graphiql-container {
  /* overall styles */
  .CodeMirror {
    background: var(--v-appForeground-base) !important;
  }

  .CodeMirror-cursor {
    border-left: 1px solid $brackets-gray;
  }

  .CodeMirror-hints {
    background: $divider-gray;

    /* stylelint-disable-next-line selector-max-compound-selectors */
    .CodeMirror-hint,
    .CodeMirror-hint-information .content {
      color: var(--v-utilGrayDark-base);
    }
  }

  .CodeMirror-gutters,
  .result-window .CodeMirror-gutters,
  .resultWrap,
  .secondary-editor-title {
    background: $toolbar-black;
    border: 0;
    color: var(--v-utilGrayDark-base);
  }

  .secondary-editor {
    height: 28px;
  }

  .secondary-editor-title > div {
    color: var(--v-utilGrayDark-base) !important;
  }

  button,
  input {
    color: var(--v-utilGrayDark-base);
  }
  /* History and Documentation sidebars */
  .historyPaneWrap {
    z-index: 4 !important; // keeps history panel under sidenav
  }

  .doc-explorer-title-bar,
  .history-title-bar {
    background: $toolbar-black;
    color: var(--v-utilGrayDark-base);
    height: 40px;
    padding: 0 8px;

    .history-title,
    .doc-explorer-title {
      margin-top: 14px;
      overflow: hidden;
      padding: 0 0 0 10px;
    }

    .docExplorerHide {
      padding-top: 22px;
    }
  }

  .doc-category-title {
    border-bottom: 1px solid $divider-gray;
  }

  .history-contents,
  .doc-explorer-contents {
    background: $toolbar-black;
    border-top: 2px solid $divider-gray;
    color: var(--v-utilGrayDark-base);
    top: 40px;
  }

  .history-contents li {
    border-bottom: 1px solid $divider-gray;

    &:hover,
    &:focus {
      background: var(--v-accentPink-base);
    }

    /* stylelint-disable-next-line selector-max-compound-selectors */
    button:not(.history-label) {
      font-size: 20px;
    }
  }

  .search-box {
    input {
      padding: 6px 24px;
    }

    .search-box-clear {
      background: $divider-gray;
    }
  }

  .doc-category {
    * {
      color: $brackets-gray;
    }

    /* stylelint-disable-next-line selector-max-compound-selectors */
    .doc-category-title,
    .field-short-description > * {
      color: var(--v-utilGrayDark-base);
    }

    .field-name {
      color: var(--v-accentCyan-base);
    }

    .arg-name {
      color: var(--v-accentOrange-base);
    }

    .type-name {
      color: var(--v-codeBlue-base);
    }
  }

  /* Top nav */
  .topBar {
    background: $toolbar-black;
    border-bottom: 2px solid $divider-gray;
    height: 42px;

    /* stylelint-disable-next-line a11y/no-display-none */
    .title {
      display: none;
    }

    .execute-button {
      background: var(--v-accentPink-base);
      border: 0;
      box-shadow: none;
      height: 32px;
      width: 32px;
      /* stylelint-disable-next-line selector-max-compound-selectors */
      * {
        fill: var(--v-secondaryGrayLight-base);
      }
      /* stylelint-disable-next-line a11y/no-outline-none */
      &:focus {
        box-shadow: 0 0 4px 3px var(--v-primary-base);
        outline: none;
      }
    }

    .toolbar-button {
      background: $divider-gray;
      box-shadow: none;
      color: var(--v-utilGrayDark-base);
      padding: 2px 8px;
    }
  }

  .docExplorerShow {
    background: $divider-gray;
    border: 0;
    box-shadow: none;
    color: var(--v-utilGrayDark-base);
    padding: 2px 8px;

    &::before {
      border-left: 2px solid var(--v-utilGrayDark-base);
      border-top: 2px solid var(--v-utilGrayDark-base);
    }
  }

  .doc-explorer-back {
    background: $divider-gray;
    border-radius: 3px;
    color: var(--v-utilGrayDark-base);
    height: 25px;
    margin: 8px 0 0;
    overflow: hidden;
    padding: 2px 8px;

    &::before {
      border-left: 2px solid var(--v-utilGrayDark-base);
      border-top: 2px solid var(--v-utilGrayDark-base);
    }
  }
  /* code colors */
  .cm-keyword,
  .cm-def {
    color: var(--v-codePink-base);
  }

  .cm-property {
    color: var(--v-codeBlue-base);
  }

  .cm-string {
    color: var(--v-accentOrange-base);
  }

  .cm-variable,
  .cm-attribute {
    color: var(--v-accentOrange-base);
  }

  .cm-punctuation,
  .cm-ws {
    color: $brackets-gray;
  }
  /* scrollbar styling */
  ::-webkit-scrollbar-thumb {
    background: radial-gradient($divider-gray, var(--v-appForeground-darken2));
    border-radius: 6px;
  }

  ::-webkit-scrollbar-track,
  .CodeMirror-vscrollbar,
  .CodeMirror-hscrollbar {
    background-color: transparent;
    scrollbar-color: transparent;
  }

  ::-webkit-scrollbar {
    background-color: transparent;
    width: 10px;
  }

  /* stylelint-disable-next-line a11y/no-display-none */
  ::-webkit-scrollbar-button {
    display: none;
  }
}
</style>
