<script>
/* eslint-disable vue/no-v-html */
import { mapActions } from 'vuex'
import {
  AUTOMATIONSTATES,
  titleCasePresentTenseStates,
  presentTenseStates
} from '@/utils/automations'
import AddAutoCard from '@/pages/Dashboard/Automations/AddAutomationCard'

export default {
  components: {
    AddAutoCard
  },
  props: {
    hook: {
      type: Object,
      required: true
    },
    canEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      menu: false,
      openEdit: false,
      hookConfig: {},
      showHook: true,
      loadingHook: 0,
      copiedText: {},
      deletingHook: false,
      hookDetails: {
        FlowRunStateChangedEvent: {
          type: 'any run from',
          action: 'changes state',
          icon: 'pi-flow'
        },
        FlowSLAFailedEvent: {
          type: 'any run from',
          action: 'SLA fails',
          icon: 'pi-flow'
        },
        AgentSLAFailedEvent: {
          type: 'agents',
          icon: 'pi-agent',
          action: 'are unhealthy'
        },
        SCHEDULED_NOT_STARTED: {
          action: 'does not start'
        },
        STARTED_NOT_FINISHED: {
          action: 'does not finish'
        }
      }
    }
  },
  computed: {
    includeTo() {
      return this.hook.event_type === 'FlowRunStateChangedEvent'
    },
    isAgent() {
      return !!this.hook?.event_tags?.agent_config_id
    },
    states() {
      return this.hook?.event_tags?.state
    },
    agentConfigId() {
      return this.hook?.event_tags?.agent_config_id[0]
    },
    includeSeconds() {
      return this.hook?.event_type === 'FlowSLAFailedEvent'
    },
    hookType() {
      const event = this.hook?.event_type
      return `${this.hookDetails[event]?.type} `
    },
    hookDetail() {
      const event = this.hook?.event_type
      if (event === 'FlowRunStateChangedEvent') return ''
      const hook = this.includeSeconds
        ? `${this.hookDetails[this.flowConfig?.kind]?.action}`
        : this.hookDetails[event]?.action
      return hook
    },
    seconds() {
      return this.flowConfig?.duration_seconds
    },
    hookStates() {
      return this.states?.length === AUTOMATIONSTATES['All']?.length
        ? 'changes to <span class="font-weight-bold">any state</span>'
        : this.states?.length != 1
        ? 'changes to <span class="font-weight-bold">any of these states</span>'
        : presentTenseStates[this.states[0].toUpperCase()] ||
          titleCasePresentTenseStates[this.states[0]]
    },
    hookAction() {
      return this.hook?.action?.name || this.hook?.action?.action_type
    },
    hookName() {
      const allFlows =
        this.hook?.event_type === 'FlowRunStateChangedEvent' &&
        !this.hook?.event_tags?.flow_group_id
      const agentName =
        this.agentConfig?.agents.length == 1
          ? this.agentConfig.agents[0].name === 'agent'
            ? this.agentConfig.agents[0].type
            : this.agentConfig.agents[0].name
          : this.agentConfig?.agents
              .map((agent, index) => {
                if (index === 0) {
                  return agent.name === 'agent' ? agent.type : agent.name
                } else {
                  return agent.name === 'agent'
                    ? `or ${agent.type}`
                    : `or ${agent.name}`
                }
              })
              .toString()
      const name = this.hook.event_tags.agent_config_id
        ? agentName
        : this.hook?.event_tags?.flow_group_id?.length > 2 && this.flowName
        ? `${this.flowName[0]?.name} and others`
        : this.hook?.event_tags?.flow_group_id?.length == 2 && this.flowName
        ? `${this.flowName[0].name} <span class="font-weight-regular">or</span> ${this.flowName[1].name}`
        : allFlows
        ? 'any flow'
        : this.flowName
        ? this.flowName[0]?.name
        : ''
      return name
    },
    flowNameList() {
      return this.flowName?.map(flow => `${flow.name} - ${flow.project.name}`)
    }
  },
  methods: {
    ...mapActions('alert', ['setAlert']),
    copyToClipboard(value) {
      this.copiedText = {}
      this.copiedText[value] = true
      navigator.clipboard.writeText(value)

      setTimeout(() => {
        this.copiedText = {}
        this.copiedText[value] = false
      }, 600)
    },
    stateVerb(state) {
      return (
        presentTenseStates[state] ||
        titleCasePresentTenseStates[state] ||
        'changes state'
      )
    },
    async deleteHook() {
      try {
        this.deletingHook = true
        await this.$apollo.mutate({
          mutation: require('@/graphql/Mutations/delete-hook.gql'),
          variables: {
            hookId: this.hook.id
          }
        })
        await this.handleRefetch()
      } catch (error) {
        const errString = `${error}`
        this.setAlert({
          alertShow: true,
          alertMessage: errString,
          alertType: 'error'
        })
      } finally {
        this.deletingHook = false
        this.$emit('done')
      }
    },
    closeCard() {
      this.openEdit = false
    },
    handleRefetch() {
      this.$emit('refetch')
    },
    editHook() {
      if (!this.canEdit) return
      this.hookConfig = {
        hook: this.hook,
        flowConfig: this.flowConfig,
        flowName: this.flowName,
        flowNameList: this.flowNameList,
        agentConfig: this.agentConfig
      }
      this.$emit('open-edit')
      this.openEdit = true
      // this.$emit('edit-action', {
      //   hook: this.hook,
      //   flowConfig: this.flowConfig,
      //   flowName: this.flowName,
      //   flowNameList: this.flowNameList,
      //   agentConfig: this.agentConfig
      // })
    }
  },
  apollo: {
    flowName: {
      query: require('@/graphql/Automations/flows.gql'),
      variables() {
        return {
          flowGroupIds: this.hook?.event_tags?.flow_group_id
            ? this.hook?.event_tags?.flow_group_id
            : this.flowConfig?.flow_groups?.map(flow => flow.flow_group_id)
        }
      },
      fetchPolicy: 'no-cache',
      skip() {
        const skippy =
          (!this.hook?.event_tags?.flow_group_id ||
            !this.hook?.event_tags?.flow_group_id[0]) &&
          !this.flowConfig?.flow_groups[0]?.flow_group_id
        return skippy
      },
      loadingKey: 'loadingHook',
      update: data => {
        return data.flow
      }
    },
    agentConfig: {
      query: require('@/graphql/Automations/agent-config-by-pk.gql'),
      variables() {
        return {
          agentConfigId: this.hook?.event_tags?.agent_config_id[0] || ''
        }
      },
      loadingKey: 'loadingHook',
      skip() {
        return (
          !this.hook?.event_tags?.agent_config_id ||
          !this.hook?.event_tags?.agent_config_id[0]
        )
      },
      fetchPolicy: 'no-cache',
      update: data => data.agent_config_by_pk
    },
    flowConfig: {
      query: require('@/graphql/Automations/flow-config-by-pk.gql'),
      variables() {
        return {
          flowSLAConfigId: this.hook?.event_tags?.flow_sla_config_id
            ? this.hook?.event_tags?.flow_sla_config_id[0]
            : ''
        }
      },
      loadingKey: 'loadingHook',
      skip() {
        return (
          !this.hook?.event_tags?.flow_sla_config_id ||
          !this.hook?.event_tags?.flow_sla_config_id[0]
        )
      },
      update: data => {
        return data.flow_sla_config_by_pk || []
      }
    }
  }
}
</script>

<template>
  <v-skeleton-loader
    v-if="loadingHook > 0"
    type="list-item-avatar-three-line"
  />
  <AddAutoCard
    v-else-if="openEdit"
    :hook-detail="hookConfig"
    @refetch-hooks="handleRefetch"
    @close="closeCard"
  />
  <v-card
    v-else-if="showHook"
    class="text-h6"
    :class="canEdit ? 'hover-card' : 'view-card'"
    outlined
    @click="editHook"
  >
    <v-card-text class="text-h6 font-weight-light">
      <v-row>
        <v-col cols="11" lg="11" class="d-flex align-center justify-start">
          <v-icon color="accentPink" class="pr-2">
            {{
              hookDetails[hook.event_type]
                ? hookDetails[hook.event_type].icon
                : ''
            }}
          </v-icon>
          <span>
            When <span v-if="!hookName">all </span>{{ hookType }}
            <v-tooltip v-if="flowName" top>
              <template #activator="{ on }">
                <span class="font-weight-bold" v-on="on" v-html="hookName" />
              </template>
              {{ flowNameList.join(', ') }}
            </v-tooltip>
            <span v-else class="font-weight-bold" v-html="hookName" />
            <span v-if="isAgent">
              with
              {{
                agentConfig && agentConfig.name
                  ? agentConfig.name
                  : 'this config'
              }}</span
            >
            {{ hookDetail
            }}<span v-if="includeSeconds">
              for
              <span class="font-weight-bold">{{ seconds }} seconds</span>
            </span>
            <v-tooltip v-if="includeTo" top>
              <template #activator="{ on }">
                <span v-on="on" v-html="hookStates" />
              </template>
              <span>{{ states.join(', ') }}</span></v-tooltip
            >, then <span class="font-weight-bold">{{ hookAction }}</span
            >.
          </span>
          <v-menu
            v-if="isAgent"
            v-model="menu"
            :close-on-content-click="false"
            :open-on-hover="true"
          >
            <template #activator="{ on, attrs }">
              <v-btn icon small v-bind="attrs" v-on="on">
                <v-icon>info</v-icon>
              </v-btn>
            </template>

            <v-card width="30vW">
              <v-card-text>
                <div class="pb-2">
                  To set up an automation for your agent, you need to add the
                  agent-config-id flag at agent registration.
                </div>
                <div> To use with a new agent, add this flag:</div>
                <div class="pb-2"
                  ><v-tooltip bottom>
                    <template #activator="{ on }">
                      <span
                        class="cursor-pointer show-icon-hover-focus-only pa-2px"
                        role="button"
                        @click="
                          copyToClipboard(`--agent-config-id ${agentConfigId}`)
                        "
                        v-on="on"
                      >
                        --agent-config-id {{ agentConfigId }}
                      </span>
                    </template>
                    <span>
                      Click to copy
                    </span>
                  </v-tooltip></div
                >

                <div>
                  Note that if you attach the agent-config-id to multiple
                  agents, Prefect will only notify you if
                  <span class="font-weight-bold">all</span> agents are
                  unhealthy.</div
                >
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
        <v-col class="text-right" cols="1" lg="1">
          <v-menu v-if="canEdit" :close-on-content-click="false" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn class="px-2" text small fab v-bind="attrs" v-on="on">
                <v-icon>more_horiz</v-icon>
              </v-btn>
            </template>
            <v-card>
              <div>
                <v-btn
                  :style="{ 'text-transform': 'none', 'min-width': '0px' }"
                  text
                  :loading="deletingHook"
                  width="100%"
                  color="utilGrayDark"
                  @click.stop="deleteHook"
                >
                  <v-icon class="pr-4">delete</v-icon>
                  Delete
                </v-btn>
              </div>
            </v-card>
          </v-menu>
        </v-col>
      </v-row></v-card-text
    ></v-card
  >
</template>

<style lang="scss" scoped>
.hover-card {
  transition: box-shadow 150ms ease-in-out;

  &:focus,
  &:hover {
    box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%),
      0 1px 10px 0 rgb(0 0 0 / 12%) !important;
  }
}
.view-card {
  cursor: default;
  pointer-events: none;
}
</style>
