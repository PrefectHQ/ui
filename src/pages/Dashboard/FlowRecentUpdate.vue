<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      recentlyUpdatedFlow: null,
      loading: 0,
      fiveMinutesAgoIsoString: new Date().toISOString()
    }
  },
  created() {
    this.computeFiveMinutesAgoIsoString()
  },
  computed: {
    ...mapGetters('api', ['isCloud']),
    ...mapGetters('tenant', ['tenant']),
    ...mapGetters('user', ['user']),
    minutesSinceUpdateText() {
      if (this.recentlyUpdatedFlow === undefined) {
        return ''
      }
      const diffMins = Math.floor(
        ((new Date() -
          (new Date(this.recentlyUpdatedFlow.updated) % 86400000)) %
          3600000) /
          60000
      )
      if (diffMins === 0) {
        return 'less than a minute ago'
      }
      return diffMins.toString() + ' minutes ago'
    }
  },
  methods: {
    computeFiveMinutesAgoIsoString() {
      var fiveMinutesAgo = new Date()
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)
      this.fiveMinutesAgoIsoString = fiveMinutesAgo.toISOString()
    }
  },
  apollo: {
    recentlyUpdatedFlow: {
      query() {
        return require('@/graphql/Dashboard/flows.js').default(this.isCloud)
      },
      variables() {
        let sortBy = {
          updated: 'desc'
        }

        let searchParams = [
          { archived: { _eq: false } },
          { updated: { _gte: this.fiveMinutesAgoIsoString } }
        ]

        if (this.isCloud) {
          searchParams.push({ created_by_user_id: { _eq: this.user.id } })
        }

        return {
          limit: 1,
          orderBy: sortBy,
          searchParams: {
            _and: [...searchParams]
          }
        }
      },
      loadingKey: 'loading',
      pollInterval: 1000,
      update(data) {
        this.computeFiveMinutesAgoIsoString()
        this.$emit('recentlyUpdatedFlow', data?.flow[0])
        return data?.flow[0]
      }
    }
  }
}
</script>

<template>
  <v-card v-if="!!recentlyUpdatedFlow" class="pa-4">
    Flow
    <span class="flow-name"> {{ recentlyUpdatedFlow.name }} </span>
    in project
    <span class="project-name"> {{ recentlyUpdatedFlow.project.name }} </span>
    was updated
    {{ minutesSinceUpdateText }}
    <router-link
      class="v-btn float-right medium"
      :data-cy="
        'flow-link|' +
          recentlyUpdatedFlow.name +
          '|' +
          (recentlyUpdatedFlow.archived ? 'archived' : 'active') +
          '-' +
          recentlyUpdatedFlow.version
      "
      :to="{
        name: 'flow',
        params: { id: recentlyUpdatedFlow.flow_group.id, tenant: tenant.slug }
      }"
    >
      Go to flow
    </router-link>
  </v-card>
</template>

<style lang="scss" scoped>
.flow-name {
  font-weight: bold;
}
.project-name {
  font-weight: bold;
}
</style>
