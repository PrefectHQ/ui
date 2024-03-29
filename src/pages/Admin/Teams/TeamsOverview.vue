<script>
import ConfirmDialog from '@/components/ConfirmDialog'

import TeamListItem from '@/components/TeamListItem'
import { mapActions, mapGetters } from 'vuex'
import { pollsTenantsMixin } from '@/mixins/polling/pollsTenantsMixin'
import { clearCache } from '@/vue-apollo'

export default {
  components: {
    ConfirmDialog,
    TeamListItem
  },
  mixins: [pollsTenantsMixin],
  data() {
    return {
      confirmDeleteDialog: false,
      loading: false,
      loadingKey: 0,
      teamToDelete: null
    }
  },
  computed: {
    ...mapGetters('tenant', ['tenant', 'tenants']),
    ...mapGetters('license', [
      'hasPermission',
      'permissions',
      'license',
      'planType'
    ]),
    atTeamLimit() {
      return this.license?.terms?.tenants <= this.teams.length
    },
    multitenancy() {
      return this.license?.terms?.tenants > 1
    },
    teams() {
      return [
        ...this.tenants?.filter(t => t.license_id == this.license?.id)
      ].sort((a, b) =>
        a.stripe_customer
          ? -1
          : b.stripe_customer
          ? 1
          : new Date(a.created) - new Date(b.created)
      )
    }
  },
  methods: {
    ...mapActions('alert', ['addNotification', 'updateNotification']),
    ...mapActions('data', ['resetData']),
    ...mapActions('tenant', ['setCurrentTenant']),
    ...mapActions('user', ['getUser']),
    async handleSwitchTenant(tenant) {
      if (tenant.slug == this.tenant.slug) return

      this.loading = true

      this.resetData()

      await this.setCurrentTenant(tenant.slug)

      clearCache()
      this.loading = false
    },
    handleShowDeleteDialog(tenant) {
      this.teamToDelete = tenant
      this.confirmDeleteDialog = true
    },
    async handleRemoveTenant() {
      const tenant = this.teamToDelete
      this.loading = true

      const notificationId = await this.addNotification({
        color: 'primaryLight',
        loading: true,
        text: `Deleting <span class="font-weight-medium">${tenant.name}</span>...`,
        dismissable: false
      })

      try {
        await this.$apollo.mutate({
          mutation: require('@/graphql/Tenant/delete-enterprise-tenant.gql'),
          variables: {
            input: {
              tenant_id: tenant.id,
              confirm: true
            }
          }
        })

        await this.refetch()

        await this.updateNotification({
          id: notificationId,
          notification: {
            color: 'primary',
            text: `<span class="font-weight-medium">${tenant.name}</span> deleted.`,
            loading: false,
            dismissable: true,
            timeout: 10000
          }
        })
      } catch (e) {
        await this.updateNotification({
          id: notificationId,
          notification: {
            color: 'error',
            loading: false,
            text:
              'There was a problem deleting your team. If the issue persists, contact help@prefect.io.',
            subtext: e.toString(),
            dismissable: true,
            timeout: 10000
          }
        })
      } finally {
        this.loading = false
        this.teamToDelete = null
        this.confirmDeleteDialog = false
      }
    },
    refetch() {
      this.resetData()
      clearCache()

      this.getUser()
      this.$globalApolloQueries['tenants']?.refetch()
    },
    randomColor() {
      const letters = '0123456789ABCDEF'.split('')
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)]
      }
      return color
    }
  },
  apollo: {
    users: {
      query: require('@/graphql/Account/license-users.gql'),
      loadingKey: 'loadingKey',
      skip() {
        return !this.hasPermission('license', 'admin')
      },
      update(data) {
        if (!data) return
        return data.license_users.map(u => {
          return { ...u, avatar_color: this.randomColor() }
        })
      },
      fetchPolicy: 'no-cache'
    }
  }
}
</script>

<template>
  <div>
    <v-container
      v-if="!hasPermission('license', 'admin')"
      class="text-h5 text-center blue-grey--text d-flex align-center justify-center"
      style="height: 400px;"
      fluid
    >
      <div>
        <i class="fad fa-lock-alt fa-3x" />
        <div class="mt-6">
          <span v-if="planType('ENTERPRISE')">
            You don't have permission to view license teams; contact your
            license administrator to get access.
          </span>
          <span v-else>
            Multi-tenancy is only available on Enterprise plans.
          </span>
        </div>
      </div>
    </v-container>

    <v-container v-else fluid>
      <div class="mx-4 mb-4 d-flex align-center justify-end">
        <div class="mr-auto text-h5 font-weight-light" @click="refetch">
          {{ teams.length }}/{{ license.terms.tenants }} team slots used
        </div>

        <v-btn
          :to="{ path: '/admin/teams/new' }"
          color="primary"
          depressed
          :disabled="atTeamLimit"
        >
          <v-icon class="mr-2" small>add</v-icon>New
        </v-btn>
      </div>

      <transition-group name="teams-wrapper" mode="out-in">
        <TeamListItem
          v-for="team in teams"
          :key="team.id"
          :team="team"
          :loading="loading"
          :users="
            users
              ? users.filter(
                  u => u.memberships.findIndex(m => m.tenant_id == team.id) > -1
                )
              : []
          "
          class="mb-4"
          @click="handleSwitchTenant(team)"
          @refetch="refetch"
          @remove="handleShowDeleteDialog(team)"
        />
      </transition-group>
    </v-container>

    <ConfirmDialog
      v-model="confirmDeleteDialog"
      type="error"
      :dialog-props="{ 'max-width': '500' }"
      confirm-text="I understand"
      :loading="loading"
      @confirm="handleRemoveTenant"
    >
      <template slot="title">
        <div class="text-h5 font-weight-light">
          Are you sure?
        </div>
      </template>

      <div class="text-subtitle-1">
        This will delete your team and all associated flows, tasks, logs, and
        runs.
      </div>
    </ConfirmDialog>
  </div>
</template>

<style lang="scss" scoped>
.teams-wrapper {
  height: 100vh;
  pointer-events: none;
  position: fixed;
  width: 100%;
  z-index: 1000;

  &-enter,
  &-leave-to,
  &-leave-active {
    opacity: 0;
    transform: translateY(30px);
  }

  &-leave-active {
    position: absolute;
  }
}

.new-team-button {
  border-style: dotted;
  border-width: 2px;
  max-width: 400px;
}
</style>
