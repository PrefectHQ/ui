<script>
import Agents from '@/components/Agents/Agents'
import AgentsTile from '@/pages/Dashboard/Agents-Tile'
import CommittedUsageTile from '@/pages/Dashboard/UsageTiles/CommittedUsage-Tile'
import CycleUsageTile from '@/pages/Dashboard/UsageTiles/CycleUsage-Tile'
import BreadCrumbs from '@/components/BreadCrumbs'
import FailedFlowsTile from '@/pages/Dashboard/FailedFlows-Tile'
import FlowRunHistoryTile from '@/pages/Dashboard/FlowRunHistory-Tile'
import FlowTableTile from '@/pages/Dashboard/FlowTable-Tile'
import Automations from '@/pages/Dashboard/Automations/Automations'
import InProgressTile from '@/pages/Dashboard/InProgress-Tile'
import NavTabBar from '@/components/NavTabBar'
import NotificationsTile from '@/pages/Dashboard/Notifications-Tile'
import ProjectSelector from '@/pages/Dashboard/Project-Selector'
import SummaryTile from '@/pages/Dashboard/Summary-Tile'
import UpcomingRunsTile from '@/pages/Dashboard/UpcomingRuns-Tile'
import UpgradeUsageTile from '@/pages/Dashboard/UsageTiles/UpgradeUsage-Tile'
import SubPageNav from '@/layouts/SubPageNav'
import { mapGetters, mapActions } from 'vuex'
import gql from 'graphql-tag'

const serverTabs = [
  {
    name: 'Overview',
    target: 'overview',
    icon: 'view_quilt'
  },
  {
    name: 'Flows',
    target: 'flows',
    icon: 'pi-flow'
  },
  {
    name: 'Agents',
    target: 'agents',
    icon: 'pi-agent',
    iconSize: 'small'
  }
]

const cloudTabs = [
  {
    name: 'Automations',
    target: 'automations',
    icon: 'fad fa-random',
    badgeText: 'New!'
  }
]

export default {
  metaInfo() {
    return {
      titleTemplate: `%s | ${this.project ? this.project.name : 'All Projects'}`
    }
  },
  components: {
    Agents,
    Automations,
    AgentsTile,
    CommittedUsageTile,
    CycleUsageTile,
    BreadCrumbs,
    FailedFlowsTile,
    FlowTableTile,
    InProgressTile,
    NavTabBar,
    NotificationsTile,
    ProjectSelector,
    SubPageNav,
    SummaryTile,
    FlowRunHistoryTile,
    UpcomingRunsTile,
    UpgradeUsageTile
  },
  async beforeRouteLeave(to, from, next) {
    if (to.name == 'project' || to.name == 'no-project') {
      await this.activateProject(to.params.id)
    } else {
      this.resetActiveData()
    }

    if (!to.query?.notification_id) return next()

    try {
      if (to.query?.notification_id) {
        let mutationString = gql`
        mutation MarkMessagesAsRead {
          mark_message_as_read(input: { message_id: "${to.query.notification_id}" }) {
            success
            error
          }
        }
      `
        await this.$apollo.mutate({
          mutation: mutationString
        })

        delete to.query.notification_id
      }
    } finally {
      next({ name: to.name, params: to.params })
    }
  },
  data() {
    return {
      key: 0,
      loading: 0,
      loadedTiles: 0,
      numberOfTiles: 10,
      projectId: this.$route.params.id,
      refreshTimeout: null,
      tab: this.getTab()
    }
  },
  computed: {
    ...mapGetters('alert', ['getAlert']),
    ...mapGetters('api', ['backend', 'isCloud', 'connected']),
    ...mapGetters('data', ['activeProject']),
    ...mapGetters('tenant', ['tenant']),
    ...mapGetters('license', ['license']),
    project() {
      return this.activeProject
    },
    tabs() {
      return [...serverTabs, ...(this.isCloud ? cloudTabs : [])]
    },
    usageTile() {
      if (!this.isCloud) return null
      if (!this.license) return 'loading'
      const isSelfServe = this.license.terms.is_self_serve
      const isUsageBased = this.license.terms.is_usage_based

      // Legacy license, not self-serve (so no upgrade)
      if (!isSelfServe && !isUsageBased) return null

      // Legacy license, self-serve (so can upgrade)
      if (isSelfServe && !isUsageBased) return 'UpgradeUsageTile'

      // Usage license, not self-serve (show committed runs)
      if (!isSelfServe && isUsageBased) return 'CommittedUsageTile'

      // Usage license && self-serve
      return 'CycleUsageTile'
    },
    includeProjects() {
      return this.tab != 'automations'
    }
  },
  watch: {
    backend() {
      this.loadedTiles = 0

      this.refreshTimeout = setTimeout(() => {
        this.refresh()
        clearTimeout(this.refreshTimeout)
      }, 3000)
    },
    $route() {
      this.tab = this.getTab()
    },
    tenant(val) {
      if (val?.id) {
        this.loadedTiles = 0
        clearTimeout(this.refreshTimeout)
        this.refresh()
      }
    },
    license(val) {
      if (val?.id) {
        this.loadedTiles = 0
        clearTimeout(this.refreshTimeout)
        this.refresh()
      }
    }
  },
  async beforeMount() {
    if (this.$route.name == 'project' || this.$route.name == 'no-project') {
      await this.activateProject(this.$route.params.id)
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    ...mapActions('data', ['activateProject', 'resetActiveData']),
    handleAgentDetailsClick() {
      this.$router.push({
        name: this.projectId
          ? 'project'
          : this.projectId === null
          ? 'no-project'
          : 'dashboard',
        params: { tenant: this.tenant.slug, id: this.projectId },
        query: { agents: null }
      })
    },
    handleProjectSelect(val) {
      this.projectId = val
      if (this.projectId?.length > 0 || this.projectId === null)
        this.activateProject(this.projectId)
    },
    getTab() {
      if ('flows' in this.$route.query) return 'flows'
      if ('agents' in this.$route.query) return 'agents'
      if ('automations' in this.$route.query) return 'automations'
      return 'overview'
    },
    refresh() {
      let start

      const animationDuration = 150

      const loadTiles = time => {
        if (!start) start = time

        const elapsed = time - start

        if (elapsed > this.loadedTiles * animationDuration + 500) {
          this.loadedTiles++
        }

        if (this.loadedTiles <= this.numberOfTiles) {
          requestAnimationFrame(loadTiles)
        }
      }

      requestAnimationFrame(loadTiles)
    }
  }
}
</script>

<template>
  <v-sheet color="appBackground">
    <SubPageNav
      :icon="project ? 'pi-project' : 'view_quilt'"
      :page-type="project ? 'Project' : 'Dashboard'"
    >
      <span
        slot="page-title"
        :style="
          loading > 0
            ? {
                display: 'block',
                height: '28px',
                overflow: 'hidden'
              }
            : $vuetify.breakpoint.smAndDown && {
                display: 'inline'
              }
        "
      >
        <span v-if="loading === 0">
          {{ project ? project.name : tenant.name }}
        </span>
        <span v-else>
          <v-skeleton-loader type="heading" tile></v-skeleton-loader>
        </span>
      </span>

      <span
        v-if="project"
        slot="breadcrumbs"
        :style="
          $vuetify.breakpoint.smAndDown && {
            display: 'inline',
            'font-size': '0.875rem'
          }
        "
      >
        <BreadCrumbs
          :crumbs="[
            {
              route: {
                name: 'dashboard',
                params: { tenant: tenant.slug }
              },
              text: tenant.name
            }
          ]"
        />
      </span>

      <span
        slot="page-actions"
        :class="{ 'mx-auto': $vuetify.breakpoint.xsOnly }"
      >
        <v-skeleton-loader
          v-if="includeProjects"
          slot="row-0"
          :loading="loadedTiles < 4"
          type="text"
          transition="quick-fade"
          tile
        >
          <ProjectSelector @project-select="handleProjectSelect" />
        </v-skeleton-loader>
      </span>
      <span slot="tabs" style="width: 100%;">
        <NavTabBar :tabs="tabs" page="dashboard" />
      </span>
    </SubPageNav>

    <v-tabs-items
      v-model="tab"
      class="px-6 mx-auto tabs-border-bottom tab-full-height"
      style="
        max-width: 1440px;
      "
      :style="{
        'padding-top': $vuetify.breakpoint.smOnly ? '80px' : '130px'
      }"
      mandatory
    >
      <v-tab-item
        class="tab-full-height pa-0"
        value="overview"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        <div class="tile-grid my-4">
          <v-skeleton-loader
            :loading="loadedTiles < 7"
            type="image"
            height="184px"
            transition="quick-fade"
            class="tile-container span-full span-row-1"
            tile
          >
            <FlowRunHistoryTile
              :project-id="projectId"
              :visible="tab == 'overview'"
            />
          </v-skeleton-loader>

          <v-skeleton-loader
            :loading="loadedTiles < 2"
            type="image"
            height="100%"
            transition="quick-fade"
            class="tile-container span-row-2"
            tile
          >
            <SummaryTile :project-id="projectId" full-height />
          </v-skeleton-loader>

          <v-skeleton-loader
            :loading="loadedTiles < 7"
            type="image"
            height="100%"
            transition="quick-fade"
            class="tile-container"
            tile
          >
            <FailedFlowsTile :project-id="projectId" />
          </v-skeleton-loader>

          <v-skeleton-loader
            :loading="loadedTiles < 1"
            type="image"
            height="100%"
            transition="quick-fade"
            class="tile-container"
            tile
          >
            <UpcomingRunsTile :key="key" :project-id="projectId" full-height />
          </v-skeleton-loader>

          <v-skeleton-loader
            v-if="usageTile"
            :loading="loadedTiles < 6 || usageTile == 'loading'"
            type="image"
            height="100%"
            transition="quick-fade"
            class="tile-container span-row-1"
            tile
          >
            <component :is="usageTile" />
          </v-skeleton-loader>

          <v-skeleton-loader
            :loading="loadedTiles < 3"
            type="image"
            height="100%"
            transition="quick-fade"
            class="tile-container"
            tile
          >
            <InProgressTile :project-id="projectId" full-height />
          </v-skeleton-loader>

          <v-skeleton-loader
            :loading="loadedTiles < 4"
            type="image"
            height="100%"
            transition="quick-fade"
            class="tile-container"
            tile
          >
            <AgentsTile
              full-height
              @view-details-clicked="handleAgentDetailsClick"
            />
          </v-skeleton-loader>

          <v-skeleton-loader
            :loading="loadedTiles < 5"
            type="image"
            height="100%"
            transition="quick-fade"
            class="tile-container"
            tile
          >
            <NotificationsTile :project-id="projectId" full-height />
          </v-skeleton-loader>
        </div>
      </v-tab-item>

      <v-tab-item
        class="tab-full-height"
        value="flows"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        <FlowTableTile
          v-if="loadedTiles > 8"
          class="mx-3 my-6"
          :project-id="projectId"
        />
      </v-tab-item>

      <v-tab-item
        class="tab-full-height"
        value="agents"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        <Agents v-if="loadedTiles > 9" class="mx-3 my-6" />
      </v-tab-item>

      <v-tab-item
        class="tab-full-height"
        value="automations"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        <Automations v-if="loadedTiles > 10" class="mx-3 my-6" />
      </v-tab-item>

      <v-tab-item
        class="tab-full-height"
        value="analytics"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        Nothing to see here :)
      </v-tab-item>
    </v-tabs-items>

    <v-bottom-navigation v-if="$vuetify.breakpoint.smAndDown" app fixed>
      <v-btn v-for="tb in tabs" :key="tb.target" @click="tab = tb.target">
        {{ tb.name }}
        <v-icon>{{ tb.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-sheet>
</template>

<style lang="scss" scoped>
$cellsize: 412px;
$rowsize: 153px;
$guttersize: 24px;
$spans: 1, 2, 3, 4, 5, 6;

.tile-grid {
  column-gap: $guttersize;
  display: grid;
  grid-auto-flow: row dense;
  grid-auto-rows: minmax($rowsize, auto);
  grid-template-columns: repeat(auto-fit, minmax($cellsize, 1fr));
  row-gap: $guttersize;
  width: 100%;
}

.tile-container {
  grid-column: span 1;
  grid-row: span 2;

  @each $span in $spans {
    &.span-row-#{$span} {
      grid-row: span $span;
    }
  }

  &.span-full {
    grid-column: 1 / -1;
  }
}
</style>

<style lang="scss">
// stylelint-disable
.v-skeleton-loader__image {
  height: inherit !important;
}
// stylelint-enable
</style>
