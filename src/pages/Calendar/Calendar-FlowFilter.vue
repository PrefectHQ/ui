<script>
import { mapGetters } from 'vuex'
import { formatTime } from '@/mixins/formatTimeMixin'
import FlowName from '@/pages/Calendar/FlowName'

export default {
  components: {
    FlowName
  },
  mixins: [formatTime],
  props: {
    day: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      filters: [{ name: 'Flows' }],
      skip: false,
      show: true,
      loadingKey: 0,
      Ids: null,
      flowGroupIds: [],
      timeout: null,
      selectedFlow: 0
    }
  },
  computed: {
    ...mapGetters('api', ['connected']),
    ...mapGetters('tenant', ['tenant']),
    ...mapGetters('user', ['timezone']),
    ...mapGetters('api', ['backend']),
    start() {
      let days = 1
      const start =
        this.tzOffset(this.day) < 0
          ? this.subtractDay(this.day, days)
          : this.day
      return start
    },
    end() {
      let days = 1
      switch (this.type) {
        case '4day':
          days = this.tzOffset(this.day) > 0 ? 5 : 4
          break
        case 'day':
          days = this.tzOffset(this.day) > 0 ? 2 : 1
          break
      }
      return this.addDay(this.day, days)
    },
    queryVariables() {
      return {
        startTime: this.start,
        endTime: this.end
      }
    },
    allIds() {
      const allRuns =
        new Date(this.day) < new Date()
          ? [
              ...(this.flowRuns || []),
              ...(this.scheduledFlowRuns || []),
              ...(this.runningFlowRuns || []),
              ...(this.ongoingFlowRuns || []),
              ...(this.allFlows || [])
            ]
          : [
              ...(this.flowRuns || []),
              ...(this.scheduledFlowRuns || []),
              ...(this.allFlows || [])
            ]
      const runs = allRuns.reduce((accum, run) => {
        if (!run.flow_id && !run.flows) {
          return accum
        }
        if (run.flow_id) {
          if (this.selectFlow && this.selectFlow[0] === run.flow_id)
            return accum
          if (!accum[run.flow_id]) {
            accum[run.flow_id] = {
              active: true,
              id: run.flow_id
            }
          }
        }
        if (run.flows && run.flows[0]) {
          let flow = run.flows[0]
          let flowId = run.flows[0]?.id
          if (this.selectFlow && this.selectFlow[0] === flowId) return accum
          if (!accum[flowId]) {
            accum[flowId] = {
              name: flow.name,
              active: false,
              id: flowId,
              version: flow.version,
              fgId: run.id
            }
          } else {
            accum[flowId].name = flow.name
            accum[flowId].version = flow.version
            accum[flowId].fgId = run.id
          }
        }
        return accum
      }, {})
      let entries = Object.entries(runs)
      const ordered = entries.sort((a, b) =>
        a[1].active
          ? -1
          : b[1].active
          ? 1
          : a[1].name > b[1].name
          ? 1
          : b[1].name > a[1].name
          ? -1
          : 0
      )
      if (this.selectFlow) ordered.unshift(this.selectFlow)
      return ordered
    }
  },
  watch: {
    allIds(val) {
      if (val[0] && !this.selectFlow) this.$emit('update', this.allIds[0][0])
    },
    day() {
      this.flowGroupIds = []
      this.selectedFlow = 0
    }
  },
  created() {
    //creates a non-reactive property that isn't tracked by Vue - so that allIds does not reset
    this.selectFlow = null
    this.$emit('update', this.allIds[0])
  },
  methods: {
    handleSelectedFlow(flow, index) {
      this.selectedFlow = index
      this.selectFlow = flow
      this.$emit('update', flow[0])
    },
    updateFlowGroupList(flowGroupId) {
      this.flowGroupIds.push(flowGroupId)
    }
  },
  apollo: {
    flowRuns: {
      query: require('@/graphql/Calendar/calendar-flow-runs.gql'),
      variables() {
        return {
          startTime: this.start,
          endTime: this.end
        }
      },
      skip() {
        return this.skip
      },
      loadingKey: 'loadingKey',
      update: data => data.flow_run
    },
    scheduledFlowRuns: {
      query: require('@/graphql/Calendar/calendar-scheduled-flow-runs.gql'),
      variables() {
        return this.queryVariables
      },
      skip() {
        return this.skip
      },
      loadingKey: 'loadingKey',
      update: data => data.flow_run || []
    },
    runningFlowRuns: {
      query: require('@/graphql/Calendar/calendar-running-flow-runs.gql'),
      variables() {
        return this.queryVariables
      },
      skip() {
        return new Date(this.day) > new Date()
      },
      loadingKey: 'loadingKey',
      update: data => data.flow_run || []
    },
    ongoingFlowRuns: {
      query: require('@/graphql/Calendar/calendar-ongoing-flow-runs.gql'),
      variables() {
        return {
          startTime: this.start,
          endTime: this.day
        }
      },
      skip() {
        return new Date(this.day) > new Date()
      },
      loadingKey: 'loadingKey',
      update: data => data.flow_run || []
    },
    allFlows: {
      query: require('@/graphql/Calendar/calendar-flow-groups.gql'),
      skip() {
        return this.skip
      },
      loadingKey: 'loadingKey',
      update: data => data.flow_group
    }
  }
}
</script>

<template>
  <div v-if="connected" class="expansion text-center">
    <v-expansion-panels class="expansion" flat :value="0">
      <v-expansion-panel v-for="(filter, index) in filters" :key="index">
        <v-expansion-panel-header class=" py-0">
          {{ filter.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list height="60vh" class="pt-0">
            <v-progress-linear
              :indeterminate="loadingKey > 0"
            ></v-progress-linear>
            <v-list-item-group :value="selectedFlow" color="primary" mandatory>
              <v-list-item
                v-for="(item, inde) in allIds"
                :key="inde"
                dense
                class="pl-2"
              >
                <v-list-item-content
                  class=" pa-0"
                  @click="handleSelectedFlow(item, inde)"
                >
                  <v-list-item-subtitle class="font-weight-light ">
                    <FlowName
                      v-if="item"
                      :id="item[0]"
                      :name="item[1].name"
                      :version="item[1].version"
                      left
                      :active="item[1].active"
                      @fg="updateFlowGroupList"
                    />
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style lang="scss">
/* stylelint-disable */

.expansion > div {
  overflow: auto;
  background-color: var(--v-appBackground-base) !important;

  .theme--light > div {
    background-color: var(--v-appBackground-base) !important;
  }

  .theme--light.v-list {
    background-color: var(--v-appBackground-base) !important;
  }

  .v-expansion-panel-header {
    min-height: 20px;
  }
}

.circular {
  padding-top: 100px !important;
}
</style>
