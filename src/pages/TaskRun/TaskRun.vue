<script>
import { mapActions, mapGetters } from 'vuex'

import Actions from '@/pages/TaskRun/Actions'
import Artifacts from '@/components/Artifacts/Artifacts'
import BreadCrumbs from '@/components/BreadCrumbs'
import NavTabBar from '@/components/NavTabBar'
import DetailsTile from '@/pages/TaskRun/Details-Tile'
import EditableTextField from '@/components/EditableTextField'
import LogsCard from '@/components/LogsCard/LogsCard'
import DependenciesTile from '@/pages/TaskRun/Dependencies-Tile'
import MappedTaskRunsTile from '@/pages/TaskRun/MappedTaskRuns-Tile'
import SubPageNav from '@/layouts/SubPageNav'
import TaskRunHeartbeatTile from '@/pages/TaskRun/TaskRunHeartbeat-Tile'
import TileLayout from '@/layouts/TileLayout'
import TileLayoutFull from '@/layouts/TileLayout-Full'
import { parser } from '@/utils/markdownParser'

export default {
  metaInfo() {
    return {
      title: this.taskRun
        ? `Task Run | ${this.taskRun?.name ?? this.taskRun?.task?.name}`
        : null,
      link: [
        {
          rel: 'icon',
          type: 'image/svg',
          href: this.taskRun
            ? `/state-icons/${this.taskRun.state.toLowerCase()}.svg`
            : null,
          vmid: 'favicon'
        }
      ]
    }
  },
  components: {
    Actions,
    Artifacts,
    BreadCrumbs,
    DependenciesTile,
    DetailsTile,
    EditableTextField,
    LogsCard,
    MappedTaskRunsTile,
    NavTabBar,
    SubPageNav,
    TaskRunHeartbeatTile,
    TileLayout,
    TileLayoutFull
  },
  data() {
    return {
      loading: 0,
      tab: this.getTab(),
      taskRunNameLoading: false
    }
  },
  computed: {
    ...mapGetters('tenant', ['tenant']),
    taskRunId() {
      return this.$route.params.id
    },
    // Is this the correct definition? Can a mapped task run have siblings and children?
    mappedParent() {
      return this.taskRun?.task.mapped && this.taskRun?.map_index === -1
    },
    mappedChild() {
      return this.taskRun?.task.mapped && this.taskRun?.map_index > -1
    },
    tabs() {
      return [
        {
          name: 'Overview',
          target: 'overview',
          icon: 'view_module'
        },
        {
          name: 'Logs',
          target: 'logs',
          icon: 'format_align_left'
        },
        {
          name: 'Mapped Runs',
          target: 'mapped-runs',
          icon: 'device_hub',
          badgeColor: 'primary',
          badgeText: 'New!',
          hidden: !this.mappedParent && !this.mappedChild
        },
        {
          name: 'Artifacts',
          target: 'artifacts',
          icon: 'fas fa-fingerprint',
          badgeText: 'Beta',
          cardText:
            'The Artifacts API is a beta feature currently under development. Task mapping with artifacts may have unexpected results... for more information on artifacts, check out the',
          cardLink:
            'https://docs.prefect.io/api/latest/artifacts/artifacts.html#artifacts',
          cardLinkText: 'Artifacts API Docs'
        }
      ]
    }
  },
  watch: {
    $route() {
      this.tab = this.getTab()
    },
    taskRun(val, prevVal) {
      if (val === 'not-found') this.$router.push({ name: 'not-found' })
      if (!val || val?.id == prevVal?.id) return
      if (!this.$route.query || !this.$route.query.schematic) {
        this.$router
          .replace({
            query: {
              ...this.$route.query,
              schematic: this.taskRun.task.id
            }
          })
          .catch(e => e)
      }
    }
  },
  methods: {
    ...mapActions('alert', ['setAlert']),
    getTab() {
      if (Object.keys(this.$route.query).length != 0) {
        return Object.keys(this.$route.query)[0]
      }
      return 'overview'
    },
    parseMarkdown(md) {
      return parser(md)
    },
    async saveTaskRunName(e) {
      const previousName = this.taskRun.name
      if (previousName === e) return

      try {
        this.taskRunNameLoading = true

        const { data } = await this.$apollo.mutate({
          mutation: require('@/graphql/Mutations/set-task-run-name.gql'),
          variables: {
            input: {
              task_run_id: this.taskRunId,
              name: e
            }
          }
        })

        await this.$apollo.queries.taskRun.refetch()

        if (!data.set_task_run_name.success) {
          throw new Error(data.set_task_run_name.error)
        }

        this.setAlert({
          alertShow: true,
          alertMessage: `<span class="font-weight-medium">${previousName ||
            'Your task run'}</span> has been renamed to <span class="font-weight-medium">${e}</span>`,
          alertType: 'success'
        })
      } catch {
        this.setAlert({
          alertShow: true,
          alertMessage:
            'Oops! Something went wrong while trying to update your task run name, please try again.',
          alertType: 'error'
        })
      } finally {
        this.taskRunNameLoading = false
      }
    }
  },
  apollo: {
    taskRun: {
      query: require('@/graphql/TaskRun/task-run.gql'),
      variables() {
        return {
          id: this.taskRunId
        }
      },
      error(error) {
        if (error.toString().includes('invalid input'))
          this.$router.push({ name: 'not-found' })
      },
      loadingKey: 'loading',
      pollInterval: 5000,
      update: data => data.task_run_by_pk || 'not-found'
    },
    parent: {
      query: require('@/graphql/TaskRun/parent.gql'),
      variables() {
        return {
          taskId: this.taskRun ? this.taskRun.task.id : null,
          flowRunId: this.taskRun ? this.taskRun.flow_run.id : null
        }
      },
      loadingKey: 'loading',
      pollInterval: 5000,
      update: data => (data.task_run ? data.task_run.length : null)
    }
  }
}
</script>

<template>
  <v-sheet v-if="taskRun" color="appBackground">
    <SubPageNav icon="pi-task-run" page-type="Task Run">
      <span
        slot="page-title"
        style="
          max-width: 100%;
          min-width: 300px;
          width: auto;
          "
        :style="[
          { display: $vuetify.breakpoint.smAndDown ? 'inline' : 'block' }
        ]"
      >
        <EditableTextField
          :content="
            taskRun.name ||
              `${taskRun.task.name} ${
                taskRun.map_index > -1
                  ? `(Mapped Child ${taskRun.map_index})`
                  : ''
              }`
          "
          label="Task run name"
          :loading="taskRunNameLoading"
          required
          @change="saveTaskRunName"
        />
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
        <span v-if="!taskRun.flow_run.flow.project" class="text-overline"
          >no project</span
        >
        <BreadCrumbs
          v-if="taskRun && loading === 0"
          :crumbs="[
            {
              route: {
                name: 'project',
                params: {
                  id:
                    taskRun.flow_run.flow.project &&
                    taskRun.flow_run.flow.project.id
                }
              },
              text:
                taskRun.flow_run.flow.project &&
                taskRun.flow_run.flow.project.name
            },
            {
              route: {
                name: 'flow',
                params: {
                  id: taskRun.flow_run.flow.flow_group_id
                }
              },
              text: taskRun.flow_run.flow.name
            },
            {
              route: {
                name: 'flow-run',
                params: { id: taskRun.flow_run.id }
              },
              text: taskRun.flow_run.name
            }
          ]"
          :style="
            $vuetify.breakpoint.smAndDown && {
              display: 'inline',
              'font-size': '0.875rem'
            }
          "
        ></BreadCrumbs>
        <v-skeleton-loader v-else type="text" />
      </span>

      <Actions slot="page-actions" style="height: 55px;" :task-run="taskRun" />
      <span slot="tabs" style="width: 100%;">
        <NavTabBar :tabs="tabs" page="task-run" />
      </span>
    </SubPageNav>

    <v-tabs-items
      v-model="tab"
      class="px-6 mx-auto tabs-border-bottom tab-full-height"
      style="max-width: 1440px;"
      :style="{
        'padding-top': $vuetify.breakpoint.smOnly ? '80px' : '130px'
      }"
    >
      <v-tab-item
        class="pa-0"
        value="overview"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        <TileLayout>
          <DetailsTile slot="row-2-col-1-row-1-tile-1" :task-run="taskRun" />

          <TaskRunHeartbeatTile
            slot="row-2-col-1-row-2-tile-1"
            :task-run-id="$route.params.id"
          />

          <DependenciesTile
            slot="row-2-col-2-row-3-tile-1"
            :task-run="taskRun"
            :loading="taskRun && loading > 0"
          />
        </TileLayout>
      </v-tab-item>

      <v-tab-item
        class="tab-full-height"
        value="logs"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        <TileLayoutFull>
          <LogsCard
            slot="row-2-tile"
            class="py-2 mt-4"
            entity="task"
            :query="require('@/graphql/Logs/task-run-logs.gql')"
            :query-for-scoping="
              require('@/graphql/Logs/task-run-logs-scoping.gql')
            "
            query-key="task_run_by_pk"
            :variables="{ id: $route.params.id }"
          />
        </TileLayoutFull>
      </v-tab-item>

      <v-tab-item
        class="pb-12"
        value="artifacts"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        <Artifacts :task-run-ids="[taskRunId]" />
      </v-tab-item>

      <v-tab-item
        value="mapped-runs"
        transition="tab-fade"
        reverse-transition="tab-fade"
      >
        <TileLayoutFull>
          <v-skeleton-loader
            slot="row-2-tile"
            :loading="loading > 0"
            type="image"
            height="800"
            transition="quick-fade"
            class="my-2"
            tile
          >
            <MappedTaskRunsTile :task-run="taskRun" />
          </v-skeleton-loader>
        </TileLayoutFull>
      </v-tab-item>
    </v-tabs-items>

    <v-bottom-navigation v-if="$vuetify.breakpoint.smAndDown" app fixed>
      <v-btn @click="tab = 'overview'">
        Overview
        <v-icon>view_module</v-icon>
      </v-btn>

      <v-btn @click="tab = 'logs'">
        Logs
        <v-icon>format_align_left</v-icon>
      </v-btn>

      <v-btn @click="tab = 'artifacts'">
        Artifacts
        <v-icon>fas fa-fingerprint</v-icon>
      </v-btn>

      <v-btn @click="tab = 'mapped-runs'">
        Mapped Runs
        <v-icon>device_hub</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-sheet>
</template>

<style lang="scss">
/* stylelint-disable */
.v-tab--disabled .v-badge__badge {
  pointer-events: none;
}

.v-badge--inline .v-badge__badge,
.v-badge--inline .v-badge__wrapper {
  margin: 5px;
}
</style>
