<script>
import AutoCard from '@/pages/Dashboard/Automations/AutomationCard'

export default {
  components: {
    AutoCard
  },
  props: {
    flow: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      loadingHook: 0,
      loadCards: false,
      sortedHooks: []
    }
  },
  watch: {
    hooks() {
      this.sortHooks()
    }
  },
  methods: {
    async sortHooks() {
      this.loadCards = true
      const hooks = this.hooks ? [...this.hooks] : []
      let filtered = hooks.filter(hook =>
        hook.event_tags.flow_group_id?.includes(this.flow.flow_group_id)
      )
      const slaFlows = hooks.filter(
        hook => hook.event_tags.flow_sla_config_id != null
      )
      for (let i = 0; i < slaFlows.length; i++) {
        const { data } = await this.$apollo.query({
          query: require('@/graphql/Automations/flow-config-by-pk.gql'),
          variables: {
            flowSLAConfigId: slaFlows[i].event_tags.flow_sla_config_id[0]
          }
        })
        if (
          data.flow_sla_config_by_pk.flow_groups[0].flow_group_id ==
          this.flow.flow_group_id
        ) {
          filtered.push(slaFlows[i])
        }
      }
      const sorted = filtered.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      )
      this.sortedHooks = sorted
      this.loadCards = false
    }
  },
  apollo: {
    hooks: {
      query() {
        return require('@/graphql/Automations/flow-only-hooks.gql')
      },
      variables() {
        return {}
      },
      loadingKey: 'loadingHook',
      update: data => data?.hook
    }
  }
}
</script>

<template>
  <v-card class="pa-2 mt-2" tile>
    <v-list-item dense class="px-0">
      <v-list-item-avatar class="mr-2" tile>
        <v-icon class="icon">
          fad fa-random
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="position: relative;">
        <v-list-item-title class="text-h6 pb-1">
          <div>
            Automations
          </div>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="ml-12 mr-2"></v-divider>

    <v-card-text class="full-height position-relative">
      <v-row>
        <v-col cols="12" class="pb-0">
          <div
            >Displaying automations for this flow. To see all automations or
            manage automations, go to the main
            <router-link :to="{ name: 'dashboard', query: { automations: '' } }"
              >dashboard</router-link
            >.</div
          >
        </v-col>
        <v-progress-circular
          v-if="!sortedHooks.length && loadingHook > 0"
          class="mx-auto my-4"
          indeterminate
          color="primary"
        />
        <v-col
          v-if="!sortedHooks.length && loadingHook == 0 && !loadCards"
          class="text-center text-h6 py-8"
          >There are no automations associated with this flow.</v-col
        >
        <v-col v-for="(hook, i) in sortedHooks" :key="i" cols="12">
          <v-skeleton-loader
            v-if="loadingHook > 0 || loadCards"
            type="list-item-avatar-three-line"
            height="72"
          ></v-skeleton-loader
          ><AutoCard v-else :hook="hook" :can-edit="false" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.full-height {
  min-height: 68vh;
}
.icon {
  height: 24px;
}
</style>
