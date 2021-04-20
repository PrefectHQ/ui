<script>
import NewProjectDialog from '@/pages/Dashboard/NewProject-Dialog'
import { mapGetters } from 'vuex'

export default {
  components: {
    NewProjectDialog
  },
  data() {
    return {
      newProjectDialog: false,
      loading: false,
      previousProject: null,
      projectId: this.$route.params.id,
      projectSelect: this.$route.params.id
        ? this.$route.params
        : {
            name: 'All Projects',
            id: null
          }
    }
  },
  computed: {
    ...mapGetters('api', ['backend']),
    ...mapGetters('tenant', ['tenant']),
    ...mapGetters('data', ['activeProject', 'projects']),
    project() {
      return this.activeProject
    },
    sortedProjects() {
      if (!this.projects) return []
      let fullySorted = [...this.projects].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { ignorePunctuation: true })
      )
      fullySorted.unshift({ name: 'No Project', id: 'no_project' })
      fullySorted.unshift({ name: 'All Projects', id: null })
      fullySorted.unshift({ name: 'New Project', id: 'new_project' })
      return fullySorted
    }
  },
  watch: {
    projectSelect(val) {
      if (val == 'new_project') {
        this.newProjectDialog = true
        return
      }
      if (val == 'no_project') {
        this.projectId = null
        this.$emit('project-select', this.projectId)
        this.$router
          .push({
            name: 'no-project',
            params: { ...this.$route.params, id: null },
            query: { ...this.$route.query }
          })
          .catch(e => e)
        return
      }
      if (typeof val === 'object') {
        this.$router
          .push({
            name: 'dashboard',
            params: { ...this.$route.params, id: '' },
            query: this.$route.query
          })
          .catch(e => e)
        return
      }
      this.projectId = val
      this.$emit('project-select', this.projectId)
      this.$router
        .push({
          name: val ? 'project' : 'dashboard',
          params: { ...this.$route.params, id: val ? val : '' },
          query: { ...this.$route.query }
        })
        .catch(e => e)
      if (!val) this.projectSelect = { name: 'All Projects', id: null }
    },
    newProjectDialog(val) {
      if (!val) {
        this.projectSelect =
          this.$route.params.id === '' ? null : this.$route.params.id
      }
    },
    $route(val) {
      if (val.params && !('id' in val.params) && this.projectId !== null) {
        this.projectSelect = null
        this.projectId = null
        this.$emit('project-select', null)
      } else if (
        val.params &&
        'id' in val.params &&
        this.projectId !== val.params.id
      ) {
        // This will ensure the normal emit and project id setting
        // happens in the watcher above
        this.projectSelect = val.params.id
      }
    }
  },
  methods: {
    projectSelectTitleClass(item) {
      return {
        'new-project': item.id == 'new_project',
        'blue--text': item.id == null,
        'text--darken-4': item.id == null
      }
    }
  }
}
</script>

<template>
  <div>
    <v-autocomplete
      id="project-dropdown"
      v-model="projectSelect"
      class="project-selector"
      :class="$vuetify.breakpoint.xsOnly ? 'mx-auto' : 'mr-0'"
      hide-details
      data-cy="projects"
      :items="sortedProjects"
      :loading="loading"
      label="Project"
      item-value="id"
      item-text="name"
      prepend-icon="pi-project"
      dense
      background-color="transparent"
    >
      <template #item="{ item }">
        <v-list-item-content
          :class="item.id == 'new_project' ? 'new-project' : ''"
        >
          <v-list-item-title :class="projectSelectTitleClass(item)">
            {{ item.name }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="item.id == 'new_project'">
            Create a new project
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="item.id == null">
            Data across all your team's projects
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>

    <NewProjectDialog :show.sync="newProjectDialog" />
  </div>
</template>

<style lang="scss" scoped>
.card-transition {
  height: auto;
  transition: all 150ms;
}

.new-project {
  color: var(--v-primary-base);
  font-weight: 500;
}
</style>

<style lang="scss">
.project-selector {
  font-size: 16px;
  margin: auto;
  padding-top: 12px;
  width: 250px !important;

  div {
    font-size: 0.9rem !important;
  }

  .v-label {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.0892857143em;
    line-height: 1.25rem;
    text-transform: uppercase;
  }
}
</style>
