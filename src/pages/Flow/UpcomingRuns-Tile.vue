<script>
import { mapGetters } from 'vuex'
import CardTitle from '@/components/Card-Title'
import ClearLate from '@/components/SystemActions/ClearLate'
import ConcurrencyInfo from '@/components/ConcurrencyInfo'
import DurationSpan from '@/components/DurationSpan'
import LabelWarning from '@/components/LabelWarning'
import WorkQueue from '@/components/SystemActions/WorkQueue'

import { runFlowNowMixin } from '@/mixins/runFlowNow'
import { formatTime } from '@/mixins/formatTimeMixin'

export default {
  components: {
    CardTitle,
    ClearLate,
    ConcurrencyInfo,
    DurationSpan,
    LabelWarning,
    WorkQueue
  },
  mixins: [runFlowNowMixin, formatTime],
  props: {
    aggregate: {
      type: Boolean,
      default: () => false
    },
    flow: {
      type: Object,
      default: () => {}
    },
    flowGroup: {
      type: Object,
      default: () => {}
    },
    fullHeight: {
      required: false,
      type: Boolean,
      default: () => false
    }
  },
  data() {
    const tabs = {
      upcoming: 0,
      late: 1
    }

    return {
      loadingKey: 0,
      overlay: null,
      userSetTab: false,
      tab: tabs.upcoming,
      tabs
    }
  },
  computed: {
    ...mapGetters('api', ['isCloud']),
    ...mapGetters('tenant', ['tenant']),
    ...mapGetters('user', ['timezone']),
    loading() {
      return this.loadingKey > 0
    },
    paused() {
      return this.tenant?.settings?.work_queue_paused
    },
    lateRuns() {
      if (!this.upcomingFlowRunsData) return null

      return this.upcomingFlowRunsData.filter(run => this.runIsLate(run))
    },
    upcomingRuns() {
      if (!this.upcomingFlowRunsData) return null

      return this.upcomingFlowRunsData.filter(run => !this.runIsLate(run))
    },
    title() {
      if (!this.upcomingFlowRunsData) return null

      return this.tabProperties[this.tab].title
    },
    titleIcon() {
      return this.tabProperties[this.tab].icon
    },
    titleIconColor() {
      if (this.loading) return 'grey'

      return this.tabProperties[this.tab].icon_color
    },
    systemBarColor() {
      if (this.loading || !this.upcomingFlowRunsData) return 'secondaryGray'

      return this.lateRuns?.length > 0 ? 'deepRed' : 'Success'
    },
    tabProperties() {
      const upcomingCount = this.upcomingRuns?.length || 0
      const lateCount = this.lateRuns?.length || 0

      return {
        [this.tabs.upcoming]: {
          title: `${this.getFriendlyCount(upcomingCount)} upcoming runs`,
          icon: 'access_time',
          icon_color: 'primary'
        },
        [this.tabs.late]: {
          title: `${this.getFriendlyCount(lateCount)} late runs`,
          icon: 'timelapse',
          icon_color: lateCount > 0 ? 'deepRed' : 'Success'
        }
      }
    },
    upcomingTabTitle() {
      const upcomingCount = this.upcomingRuns?.length || 0

      if (this.tab == this.tabs.upcoming || upcomingCount == 0) {
        return 'Upcoming'
      }

      return `(${this.getFriendlyCount(upcomingCount)}) Upcoming`
    },
    lateTabTitle() {
      const lateCount = this.lateRuns?.length || 0

      if (this.tab == this.tabs.late || lateCount == 0) {
        return 'Late'
      }

      return `(${this.getFriendlyCount(lateCount)}) Late`
    }
  },
  watch: {
    upcomingFlowRunsData(val) {
      if (!val || this.userSetTab) return

      if (this.tab == this.tabs.upcoming && this.lateRuns?.length > 0) {
        this.tab = this.tabs.late
      } else if (this.tab == this.tabs.late && this.lateRuns?.length == 0) {
        this.tab = this.tabs.upcoming
      }
    },
    ['tenant.settings.work_queue_paused'](val) {
      if (!val) {
        setTimeout(() => {
          this.hideOverlay()
        }, 1500)
      }
    }
  },
  beforeDestroy() {
    this.upcomingFlowRunsData = []
    this.tab = this.tabs.upcoming
  },
  mounted() {
    if (this.paused) {
      this.showOverlay('queue')
    }
  },
  methods: {
    runIsLate(run) {
      return this.getTimeOverdue(run.scheduled_start_time) > 20000
    },
    getTimeOverdue(time) {
      return new Date() - new Date(time)
    },
    showOverlay(kind) {
      this.overlay = kind
    },
    hideOverlay() {
      this.overlay = null
    },
    refetch() {
      this.$apollo.queries.upcomingFlowRunsData.refresh()
      this.overlay = null
    },
    getFriendlyCount(count) {
      return count > 999 ? '1,000+' : count
    },
    onIntersect([entry]) {
      this.$apollo.queries.upcomingFlowRunsData.skip = !entry.isIntersecting
    }
  },
  apollo: {
    upcomingFlowRunsData: {
      query: require('@/graphql/Flow/upcoming-flow-runs.gql'),
      variables() {
        let variables = {}

        if (this.aggregate) {
          variables.flow_group_id = this.flow.flow_group_id
        } else {
          variables.flow_id = this.flow.id
        }

        return variables
      },
      loadingKey: 'loadingKey',
      pollInterval: 10000,
      update: data => {
        const timestamp = new Date().getTime()

        return (data?.flow_run || []).map(run => {
          run.cacheInvalidation = timestamp

          return run
        })
      }
    }
  }
}
</script>

<template>
  <v-card
    v-intersect="{ handler: onIntersect }"
    class="py-2 position-relative d-flex flex-column"
    style="height: 100%;"
    tile
  >
    <v-system-bar :color="systemBarColor" :height="5" absolute />

    <CardTitle :title="title" :icon="titleIcon" :icon-color="titleIconColor">
      <v-row slot="title" no-gutters class="d-flex align-center">
        <v-col cols="10">
          <div>
            <div
              v-if="loading"
              style="
                display: inline-block;
                height: 20px;
                overflow: hidden;
                width: 20px;"
            >
              <v-skeleton-loader type="avatar" tile />
            </div>
            {{ title }}
          </div>
          <ConcurrencyInfo
            v-if="isCloud && tab === tabs.late"
            class="text-caption position-absolute"
            style="bottom: 2px;"
          />
        </v-col>
      </v-row>
    </CardTitle>

    <v-card-text v-show="overlay" class="pa-0">
      <v-overlay v-show="overlay == 'late'" absolute z-index="1">
        <ClearLate :flow-runs="lateRuns" @finish="refetch" />
      </v-overlay>
      <v-overlay v-show="overlay == 'queue'" absolute z-index="1">
        <WorkQueue />
      </v-overlay>
    </v-card-text>

    <v-tabs
      v-model="tab"
      tabs-border-bottom
      :color="titleIconColor"
      class="flex-grow-0"
      @change="userSetTab = true"
    >
      <v-tab :key="tabs.upcoming" data-cy="upcoming-runs-tile-upcoming">
        {{ upcomingTabTitle }}
      </v-tab>
      <v-tab :key="tabs.late" data-cy="upcoming-runs-tile-late">
        <v-icon
          v-if="lateRuns && lateRuns.length > 0"
          class="mr-1"
          small
          color="deepRed"
        >
          warning
        </v-icon>
        {{ lateTabTitle }}
      </v-tab>
    </v-tabs>

    <v-card-text class="px-0 py-2 card-content">
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-skeleton-loader v-if="loading" type="list-item-three-line" />

          <v-list-item
            v-else-if="upcomingRuns && upcomingRuns.length === 0"
            dense
          >
            <v-list-item-avatar class="mr-0">
              <v-icon class="green--text">check</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="my-0 py-0">
              <div
                class="text-subtitle-1 font-weight-light"
                style="line-height: 1.25rem;"
              >
                No upcoming runs.
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-virtual-scroll
            v-else
            :items="upcomingRuns"
            height="178px"
            item-height="50px"
          >
            <template #default="{item}">
              <v-list-item
                :key="item.id"
                dense
                :disabled="setToRun.includes(item.id)"
              >
                <v-list-item-content>
                  <v-list-item-subtitle class="text-body-1 font-weight-regular">
                    <router-link
                      :to="{ name: 'flow-run', params: { id: item.id } }"
                    >
                      {{ item.name }}
                    </router-link>
                  </v-list-item-subtitle>

                  <span class="text-caption mb-0 ml-n1 d-flex align-center">
                    <LabelWarning :flow="item.flow" :flow-run="item" />
                    <span class="ml-1">
                      Scheduled for
                      {{ formatDateTime(item.scheduled_start_time) }}
                    </span>
                  </span>
                </v-list-item-content>

                <v-list-item-action tile min-width="5" class="text-body-2">
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <v-btn
                        text
                        x-small
                        aria-label="Run Now"
                        :disabled="setToRun.includes(item.id)"
                        color="primary"
                        class="vertical-button"
                        v-on="on"
                        @click="runFlowNow(item.id, item.version, item.name)"
                      >
                        <v-icon small dense color="primary">fa-rocket</v-icon>
                      </v-btn>
                    </template>
                    <span> Run {{ item.name }} now </span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-tab-item>
        <v-tab-item>
          <v-skeleton-loader v-if="loading" type="list-item-three-line" />

          <v-list-item v-else-if="lateRuns && lateRuns.length === 0" dense>
            <v-list-item-avatar class="mr-0">
              <v-icon class="green--text">check</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="my-0 py-0">
              <div
                class="text-subtitle-1 font-weight-light"
                style="line-height: 1.25rem;"
              >
                Everything is running on schedule!
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-virtual-scroll
            v-else
            :items="lateRuns"
            height="178px"
            item-height="64px"
          >
            <template #default="{ item }">
              <v-list-item :key="item.id" dense two-line>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-body-1 font-weight-regular">
                    <router-link
                      :to="{ name: 'flow-run', params: { id: item.id } }"
                    >
                      {{ item.name }}
                    </router-link>
                  </v-list-item-subtitle>

                  <span class="text-caption mb-0 ml-n1 d-flex align-center">
                    <LabelWarning :flow-run="item" location="flowPage" />
                    <span class="ml-1">
                      Scheduled for
                      {{ formatDateTime(item.scheduled_start_time) }}
                    </span>
                  </span>

                  <v-list-item-subtitle class="text-caption">
                    <DurationSpan :start-time="item.scheduled_start_time" />
                    behind schedule
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

    <v-card-actions class="py-0 justify-end">
      <v-btn
        v-if="!overlay && lateRuns && lateRuns.length > 0"
        small
        depressed
        color="primary"
        text
        style="z-index: 2;"
        @click="showOverlay('late')"
      >
        Clear late
      </v-btn>

      <v-btn
        v-if="overlay && !paused"
        small
        depressed
        plain
        color="white"
        width="74"
        text
        style="z-index: 2;"
        @click="hideOverlay"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none !important;
}

.button-transition {
  transition: border-right 150ms linear;
}

.w-100 {
  width: 100% !important;
}

.card-content {
  height: 100%;
  max-height: calc(226px - var(--v-tabs-height));
  overflow-y: auto;
  position: relative;
}
</style>
