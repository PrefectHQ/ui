<script>
import CardTitle from '@/components/Card-Title'
import LastTenRuns from '@/components/LastTenRuns'
import ScheduleToggle from '@/components/ScheduleToggle'

import { formatTime } from '@/mixins/formatTimeMixin'
import { mapGetters } from 'vuex'
import debounce from 'lodash.debounce'

const serverHeaders = [
  {
    text: 'Name',
    value: 'name',
    width: '20%'
  },
  {
    text: 'Schedule',
    value: 'schedule',
    sortable: false,
    align: 'center',
    width: '20%'
  },
  {
    text: 'Project',
    value: 'project',
    sortable: false,
    width: '15%'
  },
  {
    text: 'Version',
    value: 'version',
    sortable: false,
    width: '7.5%'
  },
  {
    text: 'Created On',
    value: 'created',
    width: '15%'
  }
]

const serverHeadersPost = [
  {
    text: 'Run History',
    value: 'flow_runs',
    sortable: false,
    width: '25%'
  }
]

const cloudHeaders = [
  {
    text: 'Created By',
    value: 'created_by.username',
    sortable: false,
    width: '12.5%'
  }
]

export default {
  components: {
    CardTitle,
    LastTenRuns,
    ScheduleToggle
  },
  filters: {},
  mixins: [formatTime],
  props: {
    projectId: {
      required: false,
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      flows: [],
      limit: 15,
      loading: 0,
      page: 1,
      search:
        this.$route && this.$route.query && this.$route.query.flows
          ? this.$route.query.flows
          : null,
      showArchived:
        this.$route && this.$route.query && this.$route.query.archived,
      sortBy: 'name',
      sortDesc: false
    }
  },
  computed: {
    ...mapGetters('api', ['isCloud']),
    ...mapGetters('tenant', ['tenant']),
    ...mapGetters('user', ['timezone']),
    headers() {
      return [
        ...(this.showArchived
          ? [
              {
                text: '',
                value: 'archived',
                width: 5
              }
            ]
          : []),
        ...serverHeaders,
        ...(this.isCloud ? cloudHeaders : []),
        ...serverHeadersPost
      ]
    },
    placeholderMessage() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return `Search by Flow, ${!this.isCloud ? 'or' : ''} Project${
          this.isCloud ? ', or User' : ''
        } `
      }
      return ''
    },
    searchFormatted() {
      if (!this.search) return null
      return `%${this.search}%`
    },
    nullProject() {
      if (!this.search) return null
      return this.search.toLowerCase() == 'no project'
    },
    validUUID() {
      if (!this.search) return false

      const UUIDRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/

      // Call .trim() to get rid of whitespace on the ends of the
      // string before making the query
      return UUIDRegex.test(this.search.trim())
    }
  },
  watch: {
    search(val) {
      this.$router.replace({
        query: { ...this.$route.query, flows: val }
      })
    },
    showArchived(val) {
      let query = { ...this.$route.query }

      if (val) {
        query.archived = true
      } else {
        delete query.archived
      }
      this.$router.replace({
        query: query
      })
    }
  },
  methods: {
    async handleTableSearchInput(e) {
      this.loading++
      this.debounceSearch(e)
    },
    debounceSearch: debounce(function(e) {
      this.loading--
      this.search = e
    }, 500)
  },
  apollo: {
    flows: {
      query() {
        return require('@/graphql/Dashboard/flows.js').default(this.isCloud)
      },
      variables() {
        let sortBy = {}
        if (this.sortBy) {
          if (this.isCloud && this.sortBy.includes('created_by.username')) {
            sortBy['created_by'] = {}
            sortBy['created_by']['username'] = this.sortDesc ? 'desc' : 'asc'
          } else if (Object.keys(this.sortBy) < 1) {
            sortBy = { name: 'asc' }
          } else {
            sortBy[`${this.sortBy}`] = this.sortDesc ? 'desc' : 'asc'
          }
        }

        let searchParams = [
          { archived: { _eq: this.showArchived ? null : false } },
          { project_id: { _eq: this.projectId ? this.projectId : null } }
        ]

        let orParams = [
          {
            name: { _ilike: this.searchFormatted }
          },
          { project: { name: { _ilike: this.searchFormatted } } }
        ]

        if (this.nullProject) {
          searchParams.pop()
          searchParams.push({ project_id: { _is_null: true } })
          return {
            limit: this.limit,
            offset: this.limit * (this.page - 1),
            orderBy: sortBy,
            searchParams: {
              _and: [...searchParams]
            }
          }
        }

        if (this.validUUID) {
          orParams.push({ id: { _eq: this.search } })
        }

        if (this.isCloud) {
          orParams.push({
            created_by: { username: { _ilike: this.searchFormatted } }
          })
        }

        return {
          limit: this.limit,
          offset: this.limit * (this.page - 1),
          orderBy: sortBy,
          searchParams: {
            _and: [...searchParams, { _or: [...orParams] }]
          }
        }
      },
      loadingKey: 'loading',
      pollInterval: 60000,
      update: data => {
        return data?.flow
      }
    },
    flowCount: {
      query: require('@/graphql/Dashboard/flow-count.gql'),
      variables() {
        let searchParams = [
          { archived: { _eq: this.showArchived ? null : false } },
          { project_id: { _eq: this.projectId ? this.projectId : null } }
        ]

        let orParams = [
          {
            name: { _ilike: this.searchFormatted }
          },
          { project: { name: { _ilike: this.searchFormatted } } }
        ]

        if (this.nullProject) {
          searchParams.pop()
          searchParams.push({ project_id: { _is_null: true } })
          return {
            searchParams: {
              _and: [...searchParams]
            }
          }
        }

        if (this.validUUID) {
          orParams.push({ id: { _eq: this.search } })
        }

        if (this.isCloud) {
          orParams.push({
            created_by: { username: { _ilike: this.searchFormatted } }
          })
        }

        return {
          searchParams: { _and: [...searchParams, { _or: [...orParams] }] }
        }
      },
      loadingKey: 'loading',
      pollInterval: 60000,
      update: data => data?.flowCount?.aggregate?.count
    }
  }
}
</script>

<template>
  <v-card class="pa-2" tile>
    <CardTitle title="Flows" icon="pi-flow">
      <div slot="action" class="flex align-center justify-end">
        <v-text-field
          :value="search"
          class="flow-search"
          dense
          hide-details
          single-line
          solo
          flat
          :placeholder="placeholderMessage"
          prepend-inner-icon="search"
          autocomplete="new-password"
          style="min-width: 400px;"
          @input="handleTableSearchInput"
        />
      </div>
    </CardTitle>

    <v-card-text class="pa-0 pl-8">
      <v-data-table
        fixed-header
        :search.sync="search"
        :mobile-breakpoint="960"
        :loading="loading > 0"
        loading-text="Loading your flows..."
        :header-props="{ 'sort-icon': 'arrow_drop_up' }"
        :items="flows"
        :headers="headers"
        :page.sync="page"
        :items-per-page.sync="limit"
        class="ma-2 overflow-table"
        must-sort
        :no-data-text="
          `You have no flows${projectId ? ' in this project!' : '!'}`
        "
        :server-items-length="flowCount"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :class="{ 'fixed-table': $vuetify.breakpoint.mdAndUp }"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'first_page',
          itemsPerPageOptions: [10, 15, 25, 50],
          lastIcon: 'last_page',
          prevIcon: 'keyboard_arrow_left',
          nextIcon: 'keyboard_arrow_right'
        }"
      >
        <template #item.archived="{ item }">
          <truncate :content="item.archived ? 'Archived' : 'Active'">
            <v-icon small dark :color="item.archived ? 'accentPink' : 'green'">
              {{ item.archived ? 'archive' : 'pi-flow' }}
            </v-icon>
          </truncate>
        </template>

        <template #item.name="{ item }">
          <truncate :content="item.name">
            <router-link
              class="link"
              :data-cy="
                'flow-link|' +
                  item.name +
                  '|' +
                  (item.archived ? 'archived' : 'active') +
                  '-' +
                  item.version
              "
              :to="{
                name: 'flow',
                params: { id: item.flow_group.id, tenant: tenant.slug }
              }"
            >
              <span>{{ item.name }}</span>
            </router-link>
          </truncate>
        </template>

        <template #item.project="{ item }">
          <truncate :content="item.project && item.project.name">
            <router-link
              v-if="item.project"
              class="link"
              :to="{
                name: 'project',
                params: { id: item.project.id, tenant: tenant.slug }
              }"
            >
              <span>{{ item.project.name }}</span>
            </router-link>
            <span v-else class="text-overline">no project</span>
          </truncate>
        </template>

        <template #item.schedule="{ item }">
          <ScheduleToggle :flow="item" :flow-group="item.flow_group" />
        </template>

        <template #item.flow_runs="{ item }">
          <div class="position-relative allow-overflow" style="height: 55px;">
            <LastTenRuns :flow-id="item.id" :archived="item.archived" />
          </div>
        </template>

        <template #item.created="{ item }">
          <truncate :content="formatTime(item.created)" />
        </template>

        <template #item.created_by.username="{ item }">
          <truncate
            :content="item.created_by ? item.created_by.username : null"
          />
        </template>

        <!-- eslint-disable vue/no-template-shadow -->
        <template #body.append="{ headers }">
          <td :colspan="headers.length">
            <v-row justify="end">
              <v-switch
                v-model="showArchived"
                class="archived-checkbox mr-7"
                label="Show Archived"
              ></v-switch>
            </v-row>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.flow-search {
  border-radius: 0 !important;
  font-size: 0.85rem;

  .v-icon {
    font-size: 20px !important;
  }
}
</style>
