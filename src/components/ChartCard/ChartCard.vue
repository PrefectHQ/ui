<script>
import RingChartHeader from '@/components/ChartCard/ChartCardHeader-Ring'
import SimpleChartHeader from '@/components/ChartCard/ChartCardHeader-Simple'

export default {
  components: {
    RingChartHeader,
    SimpleChartHeader
  },
  props: {
    accentColor: {
      type: String,
      default: () => 'rgb(39, 177, 255)'
    },
    title: { type: String, default: () => '' },
    subtitle: { type: String, default: () => '' },
    body: { type: String, default: () => '' },
    chartType: { type: String, default: () => null },
    chartOverlayMain: { type: String, default: () => null },
    chartOverlayUnits: { type: String, default: () => null },
    chartOverlayOverline: { type: String, default: () => null },
    chartOverlaySub: { type: String, default: () => null },
    chartOverlayCenter: { type: String, default: () => 'check' },
    chartOverlayCenterTwo: { type: String, default: () => '' },
    chartOverlayCenterType: { type: String, default: () => 'icon' },
    chartData: { type: Array, default: () => [] },
    extra: { type: Boolean, default: true },
    colors: { type: Array, default: () => null }
  },
  computed: {
    chartStyle() {
      return {
        'background-color': this.accentColor,
        color: '#fff'
      }
    },
    mainContainer() {
      return this.extra ? 'main-container' : 'no-extra-container'
    },
    overlayStyle() {
      return {
        left: this.$vuetify.breakpoint.mdAndUp ? '25px' : '0',
        top: this.$vuetify.breakpoint.mdAndUp ? '25px' : '0',
        width: this.$vuetify.breakpoint.mdAndUp ? '25%' : '20%',
        'text-align': this.$vuetify.breakpoint.smAndDown ? 'center' : 'right'
      }
    }
  }
}
</script>

<template>
  <v-container ref="mainContainer" :class="mainContainer" class="relative">
    <RingChartHeader
      v-if="chartType == 'ring'"
      :chart-data="chartData"
      :chart-overlay-main="chartOverlayMain"
      :chart-overlay-units="chartOverlayUnits"
      :chart-overlay-overline="chartOverlayOverline"
      :chart-overlay-sub="chartOverlaySub"
      :chart-overlay-center="chartOverlayCenter"
      :chart-overlay-center-two="chartOverlayCenterTwo"
      :chart-overlay-center-type="chartOverlayCenterType"
      :accent-color="accentColor"
      :colors="colors"
    />

    <SimpleChartHeader
      v-if="chartType == 'simple'"
      :chart-overlay-main="chartOverlayMain"
      :chart-overlay-overline="chartOverlayOverline"
      :chart-overlay-sub="chartOverlaySub"
      :chart-overlay-center="chartOverlayCenter"
      :accent-color="accentColor"
    />

    <v-container
      v-if="extra"
      class="absolute box text-box d-flex flex-column pa-8"
    >
      <v-row no-gutters align="end" justify="start">
        <v-col cols="12">
          <div class="text-overline grey--text">
            {{ subtitle }}
          </div>

          <div
            class="text-h4"
            :class="$vuetify.breakpoint.mdAndUp ? 'text-h4' : 'text-h5'"
          >
            {{ title }}
          </div>
          <div v-if="!!body" class="text-body-2">
            {{ body }}
          </div>
          <div v-else-if="title === 'Users'" class="text-body-2">
            Invited users and actual members count towards your users total. You
            can add and remove members and invitations in the
            <router-link :to="'/team/members'">
              team-members
            </router-link>
            page.
          </div>
          <div v-else-if="title === 'Flows'" class="text-body-2">
            Different versions all count as one flow. You can view and manage
            the flows that count towards your total on the
            <router-link :to="{ name: 'flow-version-groups' }">
              flow version groups
            </router-link>
            page.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.main-container {
  min-height: 400px;
  text-align: left;
  width: 100%;
}

.no-extra-container {
  min-height: 250px;
  text-align: left;
  width: 100%;
}

.container {
  .box {
    border-radius: 4px;

    &.chart-box {
      left: 50%;
      top: 0;
      transform: translate(-50%);
      width: 87.5%;
      z-index: 2;

      .overlay {
        color: #fff;
        text-align: right;
      }

      .overlay-center {
        left: 50%;
        text-align: center;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 25%;
      }

      .v-icon {
        color: rgba(255, 255, 255, 0.4);
        font-size: 6em !important;
      }
    }

    &.text-box {
      background-color: #fff;
      bottom: 0;
      height: 67.5%;
      left: 50%;
      top: 25px;
      transform: translate(-50%, 50%);
      width: 90%;
      z-index: 1;
    }
  }
}
</style>
