<script>
import { runConfigs } from '@/utils/runConfigs'
import Label from '@/components/Label'
import JsonInput from '@/components/CustomInputs/JsonInput'
import YamlInput from '@/components/CustomInputs/YamlInput'

export default {
  components: {
    Label,
    JsonInput,
    YamlInput
  },
  props: {
    flowRun: {
      required: true,
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    runConfig() {
      return runConfigs[this.flowRun.run_config.type]
    },
    argList() {
      let argList = {}
      for (let arg in this.flowRun.run_config) {
        const info = this.runConfig.args.find(a => a.arg === arg)
        if (info?.label) {
          argList[info.label] = this.flowRun.run_config[arg]
        } else if (
          arg.includes('job_template') ||
          arg.includes('task_definition')
        ) {
          const override = this.runConfig.args[0].options.find(
            a => a.arg === arg
          )
          argList[override.label] = this.flowRun.run_config[arg]
        } else if (arg === 'labels' && this.flowRun.labels.length) {
          argList['Labels'] = this.flowRun.labels
        }
      }
      return argList
    }
  },
  methods: {}
}
</script>

<template>
  <div class="px-8 full-height">
    <div class="text-h5 py-8">Custom Run Configurations</div>
    <div
      v-if="flowRun.run_config == null"
      class="text-center position-absolute center-absolute text-h5 utilGrayDark--text"
      style="z-index: 1;"
    >
      This run has no
      <span class="font-weight-medium">
        <v-icon small color="primary" class="ml-1">
          fa-cogs
        </v-icon>
        Run Config</span
      >! You can learn how to set a run config in the
      <a
        href="https://docs.prefect.io/orchestration/ui/flow.html#run"
        target="_blank"
      >
        Flow Run Docs</a
      >.
    </div>
    <span v-else>
      <div class="row-divider py-4">
        <v-row>
          <v-col cols="4">
            <v-card-subtitle>Run Configuration</v-card-subtitle>
          </v-col>
          <v-col cols="8">
            <div class="d-flex align-center agent-type">
              <div class="text-center" style="width: 50px;">
                <i :class="runConfig.icon" class="fa-2x pi-2x"> </i>
              </div>
              <div>
                <v-card-text class="config-value">{{
                  runConfig.label
                }}</v-card-text>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      <div
        v-for="(arg, i) of Object.keys(argList)"
        :key="i"
        class="row-divider py-4"
      >
        <v-row>
          <v-col cols="4">
            <v-card-subtitle>{{ arg }}</v-card-subtitle>
          </v-col>
          <v-col cols="8">
            <v-card-text v-if="arg === 'Labels'">
              <span v-for="(label, j) in argList[arg]" :key="j" class="pr-2"
                ><Label disabled>{{ label }}</Label></span
              ></v-card-text
            >
            <!-- pull secrets list -->
            <v-card-text
              v-for="(item, j) in argList[arg]"
              v-else-if="Array.isArray(argList[arg])"
              :key="j"
              class="config-value"
            >
              {{ item }}</v-card-text
            >
            <!-- json or KV inputs -->
            <v-card-text
              v-else-if="typeof argList[arg] === 'object'"
              class="config-value"
            >
              <JsonInput disabled :value="JSON.stringify(argList[arg])" />
            </v-card-text>
            <!-- yaml input (only relevant for templates) -->
            <v-card-text
              v-else-if="arg === 'Template' && typeof argList[arg] === 'string'"
              class="config-value"
            >
              <YamlInput disabled :value="argList[arg]" />
            </v-card-text>
            <!-- regular strings -->
            <v-card-text v-else class="config-value">{{
              argList[arg]
            }}</v-card-text>
          </v-col>
        </v-row>
      </div>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.full-height {
  min-height: 68vh;
}
.row-divider:not(:last-child) {
  position: relative;

  &::after {
    background-color: var(--v-utilGrayLight-base);
    bottom: 0;
    content: '';
    height: 1px;
    margin: auto;
    position: absolute;
    width: 100%;
  }
}
.center-absolute {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.config-value {
  font-size: 1.1em;
}
</style>
