<script>
import BreadCrumbs from '@/components/BreadCrumbs'
import NavTabBar from '@/components/NavTabBar'
import DependenciesTile from '@/pages/Task/Dependencies-Tile'
import DetailsTile from '@/pages/Task/Details-Tile'
import SubPageNav from '@/layouts/SubPageNav'
import TaskRunHeartbeatTile from '@/pages/Task/TaskRunHeartbeat-Tile'
import TaskRunTableTile from '@/pages/Task/TaskRunTable-Tile'
import TileLayout from '@/layouts/TileLayout'
import TileLayoutFull from '@/layouts/TileLayout-Full'
import { mapActions } from 'vuex'

export default {
  metaInfo() {
    return {
      title: this.task ? `Task | ${this.task?.name}` : null
    }
  },
  components: {
    BreadCrumbs,
    DependenciesTile,
    DetailsTile,
    NavTabBar,
    SubPageNav,
    TaskRunHeartbeatTile,
    TaskRunTableTile,
    TileLayout,
    TileLayoutFull
  },
  async beforeRouteLeave(to, from, next) {
    if (to.name == 'task') {
      await this.activateTask(to.params.id)
    } else {
      this.resetActiveData()
    }
    return next()
  },
  data() {
    return {
      loading: 0,
      tab: this.getTab(),
      tabs: [
        {
          name: 'Overview',
          target: 'overview',
          icon: 'view_module'
        },
        {
          name: 'Runs',
          target: 'runs',
          icon: 'pi-task-run'
        }
      ]
    }
  },
  computed: {
    dependencies() {
      if (!this.task) return []
      let upstream = this.task.upstream_edges.map(edge => {
        return {
          ...edge.upstream_task,
          downstream_edges: [],
          upstream_edges: []
        }
      })
      let downstream = this.task.downstream_edges.map(edge => {
        return {
          ...edge.downstream_task,
          downstream_edges: [],
          upstream_edges: [{ upstream_task: { id: this.taskId } }]
        }
      })

      return [this.task, ...upstream, ...downstream]
    },
    downstreamCount() {
      if (!this.task) return null
      return this.task.downstream_edges.length
    },
    taskId() {
      return this.$route.params.id
    },
    upstreamCount() {
      if (!this.task) return null
      return this.task.upstream_edges.length
    }
  },
  watch: {
    $route() {
      this.tab = this.getTab()

      if (this.$route.name == 'task') {
        this.activateTask(this.$route.params.id)
      }
    },
    tab(val) {
      let query = { ...this.$route.query }
      switch (val) {
        case 'schematic':
          query = 'schematic'
          break
        case 'runs':
          /* eslint-disable-next-line */
          query = 'runs'
          break
        default:
          break
      }
    },
    task(val) {
      if (val === 'not-found') this.$router.push({ name: 'not-found' })
    }
  },
  async beforeMount() {
    await this.activateTask(this.$route.params.id)
    this.tab = this.getTab()
  },
  methods: {
    ...mapActions('data', ['activateTask', 'resetActiveData']),
    getTab() {
      if (Object.keys(this.$route.query).length != 0) {
        let target = Object.keys(this.$route.query)[0]
        if (this.tabs?.find(tab => tab.target == target)) return target
      }
      return 'overview'
    }
  },
  apollo: {
    task: {
      query: require('@/graphql/Task/task.gql'),
      loadingKey: 'loading',
      variables() {
        return {
          id: this.taskId
        }
      },
      error(error) {
        if (error.toString().includes('invalid input'))
          this.$router.push({ name: 'not-found' })
      },
      update: data => data.task_by_pk || 'not-found'
    },
    lastTaskRun: {
      query: require('@/graphql/Task/last-task-run.gql'),
      loadingKey: 'loading',
      variables() {
        return {
          id: this.taskId
        }
      },
      update: data => data?.task_run?.[0]
    }
  }
}
</script>

<template>
  <v-sheet v-if="task" color="appBackground">
    <SubPageNav icon="pi-task" page-type="Task">
      <span
        slot="page-title"
        :style="
          loading !== 0
            ? {
                display: 'block',
                height: '28px',
                overflow: 'hidden',
                width: '400px'
              }
            : $vuetify.breakpoint.smAndDown && {
                display: 'inline'
              }
        "
      >
        <span v-if="loading === 0">
          {{ task.name }}
        </span>
        <span v-else style="width: 500px;">
          <v-skeleton-loader type="heading" tile></v-skeleton-loader>
        </span>
      </span>

      <span
        slot="breadcrumbs"
        :style="
          loading !== 0
            ? {
                display: 'block',
                height: '21px',
                overflow: 'hidden',
                width: '500px'
              }
            : $vuetify.breakpoint.smAndDown && {
                display: 'inline',
                'font-size': '0.875rem'
              }
        "
      >
        <span v-if="!task.flow.project" class="text-overline">no project</span>
        <BreadCrumbs
          v-if="task && loading === 0"
          :crumbs="[
            {
              route: {
                name: 'project',
                params: { id: task.flow.project && task.flow.project.id }
              },
              text: task.flow.project && task.flow.project.name
            },
            {
              route: {
                name: 'flow',
                params: { id: task.flow.id }
              },
              text: task.flow.name
            }
          ]"
        ></BreadCrumbs>
        <v-skeleton-loader v-else type="text" />
      </span>
      <span slot="tabs" style="width: 100%;"
        ><NavTabBar :tabs="tabs" page="flow"
      /></span>
    </SubPageNav>

    <v-tabs-items
      v-model="tab"
      class="px-6 mx-auto tabs-border-bottom tab-full-height"
      style="max-width: 1440px;"
      :style="
        $vuetify.breakpoint.mdAndUp ? 'padding-top: 130px' : 'padding-top: 80px'
      "
    >
      <v-tab-item
        value="runs"
        transition="quick-fade"
        reverse-transition="quick-fade"
      >
        <TileLayoutFull>
          <TaskRunTableTile
            slot="row-2-tile"
            :task-id="taskId"
            :loading="loading > 0"
          />
        </TileLayoutFull>
      </v-tab-item>

      <v-tab-item
        class="pa-0"
        value="overview"
        transition="quick-fade"
        reverse-transition="quick-fade"
      >
        <TileLayout>
          <DetailsTile
            slot="row-2-col-1-row-1-tile-1"
            :task="task"
            :last-run="lastTaskRun"
            :loading="loading > 0"
          />

          <TaskRunHeartbeatTile
            slot="row-2-col-1-row-2-tile-1"
            :task-id="taskId"
          />

          <DependenciesTile
            slot="row-2-col-2-row-3-tile-1"
            :downstream-count="downstreamCount"
            :loading="loading > 0"
            :flow="task ? task.flow : null"
            :tasks="dependencies"
            :upstream-count="upstreamCount"
          />
        </TileLayout>
      </v-tab-item>
    </v-tabs-items>

    <v-bottom-navigation v-if="$vuetify.breakpoint.smAndDown" app fixed>
      <v-btn @click="tab = 'overview'">
        Overview
        <v-icon>view_module</v-icon>
      </v-btn>

      <v-btn @click="tab = 'runs'">
        Runs
        <v-icon>pi-task-run</v-icon>
      </v-btn>

      <!-- <v-btn disabled @click="tab = 'analytics'">
        Analytics
        <v-icon>insert_chart_outlined</v-icon>
      </v-btn> -->
    </v-bottom-navigation>
  </v-sheet>
</template>
