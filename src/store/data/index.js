import { fallbackApolloClient } from '@/vue-apollo'

const state = {
  activeFlow: null,
  activeProject: null,
  activeTask: null,
  flows: null,
  projects: null,
  tasks: null
}

const getters = {
  activeFlow(state) {
    return state.activeFlow
  },
  activeFlowId(state) {
    return state.activeFlow?.id
  },
  activeProject(state) {
    return state.activeProject
  },
  activeProjectId(state) {
    return state.activeProject?.id
  },
  activeTask(state) {
    return state.activeTask
  },
  activeTaskId(state) {
    return state.activeTask?.id
  },
  flows(state) {
    return state.flows
  },
  projects(state) {
    return state.projects
  },
  tasks(state) {
    return state.tasks
  }
}

const mutations = {
  setActiveProject(state, project) {
    if (
      !project ||
      typeof project !== 'object' ||
      Array.isArray(project) ||
      Object.keys(project) < 1
    ) {
      throw new Error(
        'passed invalid or empty Project; Expected Object, got: ' + project
      )
    }

    state.activeProject = project
  },
  unsetActiveProject(state) {
    state.activeProject = null
  },
  setActiveFlow(state, flow) {
    if (
      !flow ||
      typeof flow !== 'object' ||
      Array.isArray(flow) ||
      Object.keys(flow) < 1
    ) {
      throw new Error(
        'passed invalid or empty Flow; Expected Object, got: ' + flow
      )
    }
    state.activeFlow = flow
  },
  unsetActiveFlow(state) {
    state.activeFlow = null
  },
  setActiveTask(state, task) {
    if (
      !task ||
      typeof task !== 'object' ||
      Array.isArray(task) ||
      Object.keys(task) < 1
    ) {
      throw new Error(
        'passed invalid or empty Task; Expected Object, got: ' + task
      )
    }
    state.activeTask = task
  },
  unsetActiveTask(state) {
    state.activeTask = null
  },
  addTasks(state, tasks) {
    if (!tasks || !Array.isArray(tasks)) {
      throw new Error(
        'passed null or invalid Tasks; Expected Array, got: ' + tasks
      )
    }

    if (!state.tasks) {
      state.tasks = tasks
      return
    }

    tasks.forEach(task => {
      let i = state.tasks.findIndex(t => t.id == task.id)
      if (i > -1) state.tasks[i] = task
      else state.tasks.push(task)
    })
  },
  setTasks(state, tasks) {
    if (!tasks || !Array.isArray(tasks)) {
      throw new Error('passed invalid Tasks; Expected Array, got: ' + tasks)
    }
    state.tasks = tasks
  },
  unsetTasks(state) {
    state.tasks = null
  },
  setFlows(state, flows) {
    if (!flows || !Array.isArray(flows)) {
      throw new Error('passed invalid Flows; Expected Array, got: ' + flows)
    }
    state.flows = flows
  },
  unsetFlows(state) {
    state.flows = null
  },
  setProjects(state, projects) {
    if (!projects || !Array.isArray(projects)) {
      throw new Error(
        'passed invalid Projects; Expected Array, got: ' + projects
      )
    }
    state.projects = projects
  },
  unsetProjects(state) {
    state.projects = null
  }
}

const actions = {
  async activateFlow({ commit, getters, dispatch }, id) {
    let flow = getters['flows']?.find(f => f.id == id || f.flow_group_id == id)

    if (!flow || flow.id !== id) {
      id = flow?.id || id

      const { data } = await fallbackApolloClient.query({
        query: require('@/graphql/Nav/flows.gql')
      })
      commit('setFlows', data.flow)

      flow = getters['flows']?.find(f => f.id == id || f.flow_group_id == id)
    }

    if (!flow) throw new Error("Couldn't retrieve flow.")

    commit('setActiveFlow', flow)
    await dispatch('activateProject', flow.project_id)
  },
  async activateProject({ commit, getters }, id) {
    if (id === null) {
      const { data } = await fallbackApolloClient.query({
        query: require('@/graphql/Nav/no-project-flows.gql')
      })

      commit('setProjects', data.flow)
      commit('setActiveProject', {
        id: null,
        name: 'no project',
        tenant_id: data.flow[0].tenant_id
      })
      return
    }

    let project = getters['projects']?.find(p => p.id == id)

    if (!project) {
      const { data } = await fallbackApolloClient.query({
        query: require('@/graphql/Nav/projects.gql')
      })

      commit('setProjects', data.project)

      project = getters['projects'].find(p => p.id == id)
    }

    if (!project) throw new Error("Couldn't retrieve project.")

    commit('setActiveProject', project)
  },
  async activateTask({ commit, getters, dispatch }, id) {
    let task = getters['tasks']?.find(t => t.id == id)

    if (!task) {
      const { data } = await fallbackApolloClient.query({
        query: require('@/graphql/Nav/task.gql'),
        variables: {
          taskId: id
        }
      })

      commit('addTasks', data.task)

      task = getters['tasks'].find(t => t.id == id)
    }

    if (!task) throw new Error("Couldn't retrieve task.")

    commit('setActiveTask', task)
    await dispatch('activateFlow', task.flow_id)
  },
  resetActiveData({ commit }) {
    commit('unsetActiveFlow')
    commit('unsetActiveProject')
    commit('unsetActiveTask')
  },
  resetData({ commit }) {
    commit('unsetActiveFlow')
    commit('unsetActiveProject')
    commit('unsetActiveTask')
    commit('unsetFlows')
    commit('unsetProjects')
    commit('unsetTasks')
  }
}

export default {
  getters,
  mutations,
  state,
  actions,
  namespaced: true
}
