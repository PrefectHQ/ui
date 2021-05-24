<script>
import { mapGetters, mapMutations } from 'vuex'
import CardTitle from '@/components/Card-Title'
import DurationSpan from '@/components/DurationSpan'
import { cancelLateRunsMixin } from '@/mixins/cancelLateRunsMixin'
import { runFlowNowMixin } from '@/mixins/runFlowNow'
import { formatTime } from '@/mixins/formatTimeMixin'
import Alert from '@/components/Alert'
import ClearLate from '@/components/SystemActions/ClearLate'
import WorkQueue from '@/components/SystemActions/WorkQueue'

export default {
  components: {
    CardTitle,
    DurationSpan,
    Alert,
    ClearLate,
    WorkQueue
  },
  mixins: [cancelLateRunsMixin, runFlowNowMixin, formatTime],
  props: {
    agent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tab: 'submittable',
      overlay: null
    }
  },
  computed: {
    ...mapGetters('agent', [
      'staleThreshold',
      'unhealthyThreshold',
      'sortedAgents'
    ]),
    ...mapGetters('api', ['isCloud']),
    ...mapGetters('tenant', ['tenant']),
    ...mapGetters('user', ['timezone']),
    paused() {
      return this.tenant?.settings?.work_queue_paused
    },
    lateRuns() {
      return [...this.agent.lateRuns].sort(
        (a, b) =>
          new Date(a.scheduled_start_time) - new Date(b.scheduled_start_time)
      )
    },
    loading() {
      return this.loadingKey > 0
    },
    submittableRuns() {
      return [...this.agent.submittableRuns].sort(
        (a, b) =>
          new Date(a.scheduled_start_time) - new Date(b.scheduled_start_time)
      )
    },
    title() {
      let title = ''
      if (this.tab == 'submittable') {
        title =
          this.loading > 0
            ? 'Submittable runs'
            : `${this.submittableRuns?.length || 0} submittable runs`
      }

      if (this.tab == 'late') {
        title =
          this.loading || this.isClearingLateRuns
            ? 'Late runs'
            : `${this.lateRuns?.length || 0} late runs`
      }

      return title
    },
    titleIcon() {
      let icon = ''

      if (this.tab == 'submittable') {
        icon = 'access_time'
      }

      if (this.tab == 'late') {
        icon = 'timelapse'
      }
      return icon
    },
    titleIconColor() {
      return this.loading
        ? 'grey'
        : this.tab == 'submittable'
        ? 'primary'
        : this.lateRuns?.length > 0
        ? 'deepRed'
        : 'Success'
    }
  },
  watch: {
    agent(val) {
      if (!val) return
      if (val.lateRuns?.length > 0) {
        this.tab = 'late'
      }
      if (val.lateRuns?.length <= 0) {
        this.tab = 'submittable'
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
  mounted() {
    if (this.agent.lateRuns?.length) this.tab = 'late'
  },
  methods: {
    ...mapMutations('agent', ['setRefetch']),
    flowRunName(flowRun) {
      return flowRun?.name
    },
    showOverlay(kind) {
      this.overlay = kind
    },
    hideOverlay() {
      this.overlay = null
    },
    refetch() {
      this.setRefetch(true)
      this.overlay = null
    }
  },
  apollo: {}
}
</script>

<template>
  <v-card class="py-2" tile :style="{ height: '380px' }">
    <v-system-bar
      :color="
        loading
          ? 'secondaryGray'
          : lateRuns && lateRuns.length > 0
          ? 'deepRed'
          : 'Success'
      "
      :height="5"
      absolute
    >
    </v-system-bar>

    <CardTitle :title="title" :icon="titleIcon" :icon-color="titleIconColor">
      <v-row slot="title" no-gutters class="d-flex align-center">
        <v-col cols="8">
          <div>
            <div
              v-if="loading || (tab === 'late' && isClearingLateRuns)"
              style="
                display: inline-block;
                height: 20px;
                overflow: hidden;
                width: 20px;"
            >
              <v-skeleton-loader type="avatar" tile></v-skeleton-loader>
            </div>
            {{ title }}
          </div>
        </v-col>
      </v-row>

      <div slot="action" class="d-flex align-end flex-column">
        <v-btn
          depressed
          small
          tile
          icon
          class="button-transition w-100 d-flex justify-end"
          :color="tab == 'submittable' ? 'primary' : ''"
          :style="{
            'border-right': `3px solid ${
              tab == 'submittable'
                ? 'var(--v-primary-base)'
                : 'var(--v-appForeground-base)'
            }`,
            'box-sizing': 'content-box',
            'min-width': '100px'
          }"
          @click="tab = 'submittable'"
        >
          {{
            submittableRuns && submittableRuns.length > 0 && tab === 'late'
              ? `(${submittableRuns.length})`
              : ''
          }}
          Submittable
          <v-icon small>access_time</v-icon>
        </v-btn>

        <v-btn
          depressed
          small
          tile
          icon
          class="button-transition w-100 d-flex justify-end"
          :color="tab == 'late' ? 'primary' : ''"
          :style="{
            'border-right': `3px solid ${
              tab == 'late'
                ? lateRuns && lateRuns.length > 0
                  ? 'var(--v-deepRed-base)'
                  : 'var(--v-primary-base)'
                : 'var(--v-appForeground-base)'
            }`,
            'box-sizing': 'content-box',
            'min-width': '100px'
          }"
          @click="tab = 'late'"
        >
          <v-icon v-if="lateRuns && lateRuns.length > 0" small color="deepRed">
            warning
          </v-icon>
          {{
            lateRuns && lateRuns.length > 0 && tab === 'submittable'
              ? `(${lateRuns.length})`
              : ''
          }}
          Late
          <v-icon small>timelapse</v-icon>
        </v-btn>
      </div>
    </CardTitle>

    <v-card-text v-show="overlay" class="pa-0">
      <v-overlay v-show="overlay == 'late'" absolute z-index="1">
        <ClearLate :flow-runs="lateRuns" @finish="refetch" />
      </v-overlay>
      <v-overlay v-show="overlay == 'queue'" absolute z-index="1">
        <WorkQueue />
      </v-overlay>
    </v-card-text>

    <v-card-text v-if="tab == 'submittable'" class="pa-0">
      <v-skeleton-loader v-if="loading" type="list-item-three-line">
      </v-skeleton-loader>

      <v-list-item
        v-else-if="!loading && submittableRuns && submittableRuns.length === 0"
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
            No submittable runs.
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list v-else dense class="card-content">
        <v-lazy
          v-for="item in submittableRuns"
          :key="item.id"
          :options="{
            threshold: 0.75
          }"
          min-height="44"
          transition="fade-transition"
        >
          <v-list-item dense :disabled="setToRun.includes(item.id)">
            <v-list-item-content>
              <span class="text-caption mb-0 ml-n1 d-flex align-end">
                <span class="ml-1">
                  Scheduled for
                  {{ formatDateTime(item.scheduled_start_time) }}
                </span>
              </span>
              <v-list-item-subtitle class="font-weight-light">
                <router-link
                  :to="{ name: 'flow', params: { id: item.flow.id } }"
                >
                  {{ item.flow.name }}
                </router-link>
                <span class="font-weight-bold">
                  <v-icon style="font-size: 12px;">
                    chevron_right
                  </v-icon>
                </span>
                <router-link
                  :to="{ name: 'flow-run', params: { id: item.id } }"
                >
                  {{ item.name }}
                </router-link>
              </v-list-item-subtitle>
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
                    <v-icon small dense color="primary"> fa-rocket</v-icon>
                  </v-btn>
                </template>
                <span> Run {{ item.name }} now </span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </v-lazy>
      </v-list>

      <Alert
        v-model="showAlert"
        :type="alertType"
        :message="alertMessage"
        :alert-link="alertLink"
        :timeout="12000"
      >
      </Alert>
    </v-card-text>

    <v-card-text
      v-if="tab == 'late'"
      class="pa-0"
      :style="{ height: '270px', 'overflow-y': 'auto' }"
    >
      <v-skeleton-loader
        v-if="loading || isClearingLateRuns"
        type="list-item-three-line"
      >
      </v-skeleton-loader>

      <v-list-item
        v-else-if="!loading && lateRuns && lateRuns.length === 0"
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
            Everything is running on schedule!
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list v-else dense>
        <v-lazy
          v-for="item in lateRuns"
          :key="item.id"
          :options="{
            threshold: 0.75
          }"
          min-height="40px"
          transition="fade"
        >
          <v-list-item
            dense
            three-line
            :to="{ name: 'flow-run', params: { id: item.id } }"
          >
            <v-list-item-content>
              <span class="text-caption mb-0 ml-n1 d-flex align-end">
                <span class="ml-1">
                  Scheduled for
                  {{ formatDateTime(item.scheduled_start_time) }}
                </span>
              </span>

              <v-list-item-title class="text-body-2">
                <router-link
                  :to="{ name: 'flow', params: { id: item.flow.id } }"
                >
                  {{ item.flow.name }}
                </router-link>
                <span class="font-weight-bold">
                  <v-icon style="font-size: 12px;">
                    chevron_right
                  </v-icon>
                </span>
                <router-link
                  :to="{ name: 'flow-run', params: { id: item.id } }"
                >
                  {{ item.name }}
                </router-link>
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                <DurationSpan :start-time="item.scheduled_start_time" />
                behind schedule
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar class="text-body-2">
              <v-icon class="grey--text">arrow_right</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-lazy>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
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
  max-height: 310px;
  overflow-y: auto;
}
</style>