import Router from 'vue-router'

//  Nav guards
import authNavGuard from '@/middleware/authNavGuard'
import flowNavGuard from '@/middleware/flowNavGuard'
import multiguard from 'vue-router-multiguard'
import tenantNavGuard from '@/middleware/tenantNavGuard'

export const routes = [
  {
    name: 'not-found',
    path: '/404',
    component: () =>
      import(/* webpackChunkName: "not-found" */ '@/pages/NotFoundPage.vue'),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'api',
    path: '/:tenant?/api',
    component: () =>
      import(
        /* webpackChunkName: "interactive-api" */ '@/pages/InteractiveAPI/InteractiveAPI.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'help',
    path: '/help',
    component: () =>
      import(/* webpackChunkName: "support" */ '@/pages/Support.vue'),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'project',
    path: '/:tenant?/project/:id',
    component: () =>
      import(
        /* webpackChunkName: "project" */ '@/pages/Dashboard/Dashboard.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'no-project',
    path: '/:tenant?/project/no-project',
    component: () =>
      import(
        /* webpackChunkName: "no-project" */ '@/pages/Dashboard/Dashboard.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'flow',
    path: '/:tenant?/flow/:id',
    component: () =>
      import(/* webpackChunkName: "flow" */ '@/pages/Flow/Flow.vue'),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard, flowNavGuard])
  },
  {
    name: 'flow-run',
    path: '/:tenant?/flow-run/:id',
    component: () =>
      import(/* webpackChunkName: "flow-run" */ '@/pages/FlowRun/FlowRun.vue'),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'task',
    path: '/:tenant?/task/:id',
    component: () =>
      import(/* webpackChunkName: "task" */ '@/pages/Task/Task.vue'),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'task-run',
    path: '/:tenant?/task-run/:id',
    component: () =>
      import(/* webpackChunkName: "task-run" */ '@/pages/TaskRun/TaskRun.vue'),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  // --------------------------- //
  //
  // Team settings
  //
  // --------------------------- //
  {
    name: 'team',
    path: '/team',
    component: () =>
      import(
        /* webpackChunkName: "team-settings" */ '@/pages/TeamSettings/TeamSettings.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard]),
    redirect: { name: 'account' },
    children: [
      {
        name: 'account',
        path: 'account',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--account" */ '@/pages/TeamSettings/Account/Account.vue'
          )
      },
      {
        name: 'projects',
        path: 'projects',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--projects" */ '@/pages/TeamSettings/Projects.vue'
          )
      },
      {
        name: 'flow-groups',
        path: 'flow-groups',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--flow-groups" */ '@/pages/TeamSettings/FlowGroups.vue'
          )
      },
      {
        name: 'flow-concurrency',
        path: 'flow-concurrency',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--flow-concurrency" */ '@/pages/TeamSettings/FlowConcurrency.vue'
          )
      },
      {
        name: 'task-concurrency',
        path: 'task-concurrency',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--task-concurrency" */ '@/pages/TeamSettings/TaskConcurrency.vue'
          )
      },
      {
        name: 'members',
        path: 'members',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--members" */ '@/pages/TeamSettings/Members.vue'
          )
      },
      {
        name: 'service-accounts',
        path: 'service-accounts',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--service-accounts" */ '@/pages/TeamSettings/Service-Accounts.vue'
          )
      },
      {
        name: 'secrets',
        path: 'secrets',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--secrets" */ '@/pages/TeamSettings/Secrets.vue'
          )
      },
      {
        name: 'cloud-hooks',
        path: 'cloud-hooks',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--cloud-hooks" */ '@/pages/TeamSettings/CloudHooks.vue'
          )
      },
      {
        name: 'tokens',
        path: 'tokens',
        component: () =>
          import(
            /* webpackChunkName: "team-settings--tokens" */ '@/pages/TeamSettings/Tokens.vue'
          )
      }
    ]
  },
  // --------------------------- //
  //
  // User Settings
  //
  // --------------------------- //
  {
    name: 'user',
    path: '/user',
    component: () =>
      import(
        /* webpackChunkName: "user-settings" */ '@/pages/UserSettings/UserSettings.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard]),
    redirect: { name: 'profile' },
    children: [
      {
        name: 'profile',
        path: 'profile',
        component: () =>
          import(
            /* webpackChunkName: "user-settings--profile" */ '@/pages/UserSettings/Profile.vue'
          )
      },
      {
        name: 'user-tokens',
        path: 'tokens',
        component: () =>
          import(
            /* webpackChunkName: "user-settings--tokens" */ '@/pages/UserSettings/Tokens.vue'
          )
      },
      {
        name: 'keys',
        path: 'keys',
        component: () =>
          import(
            /* webpackChunkName: "user-settings--keys" */ '@/pages/UserSettings/APIKeys.vue'
          )
      },
      {
        name: 'teams',
        path: 'teams',
        component: () =>
          import(
            /* webpackChunkName: "user-settings--teams" */ '@/pages/UserSettings/Teams.vue'
          )
      }
    ]
  },
  // ---------------------------//
  //
  // Calendar
  //
  // ----------------------------//
  {
    name: 'calendar',
    path: '/:tenant?/calendar',
    component: () =>
      import(
        /*webpackChunkName: "calendar" */ '@/pages/Calendar/Calendar-View'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  // --------------------------- //
  //
  // Onboarding
  //
  // --------------------------- //
  {
    path: '/:tenant?/welcome',
    component: () =>
      import(
        /* webpackChunkName: "onboard" */ '@/pages/Onboard/Onboard-Page.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard]),
    children: [
      {
        name: 'welcome',
        path: '',
        component: () =>
          import(
            /* webpackChunkName: "onboard--welcome" */ '@/pages/Onboard/Welcome.vue'
          )
      },
      {
        name: 'name-team',
        path: 'name-team',
        component: () =>
          import(
            /* webpackChunkName: "onboard--name-team" */ '@/pages/Onboard/NameTeam.vue'
          )
      },
      {
        name: 'onboard-resources',
        path: 'resources',
        component: () =>
          import(
            /* webpackChunkName: "onboard--resources" */ '@/pages/Onboard/Resources.vue'
          )
      },
      {
        name: 'accept',
        path: 'accept',
        component: () =>
          import(
            /* webpackChunkName: "accept" */ '@/pages/Onboard/AcceptInvitationPage.vue'
          ),
        beforeEnter: multiguard([authNavGuard, tenantNavGuard])
      }
    ]
  },
  // --------------------------- //
  //
  // Plans
  //
  // --------------------------- //
  {
    name: 'plans',
    path: '/plans',
    component: () =>
      import(/* webpackChunkName: "plans" */ '@/pages/Plans.vue'),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  // --------------------------- //
  //
  // Login
  //
  // --------------------------- //
  {
    name: 'login',
    path: '/login',
    redirect: { name: 'sign-in' },
    component: () =>
      import(/* webpackChunkName: "Auth" */ '@/pages/Auth/Auth.vue'),
    children: [
      {
        name: 'sign-in',
        path: '',
        component: () =>
          import(/* webpackChunkName: "login" */ '@/pages/Auth/SignIn.vue')
      },
      {
        name: 'sign-up',
        path: 'sign-up',
        component: () =>
          import(/* webpackChunkName: "sign-up" */ '@/pages/Auth/SignUp.vue')
      },
      {
        name: 'forgot-password',
        path: 'forgot-password',
        component: () =>
          import(
            /* webpackChunkName: "forgot-password" */ '@/pages/Auth/ForgotPassword.vue'
          )
      }
    ]
  },
  {
    name: 'logout',
    path: '/logout',
    component: () =>
      import(/* webpackChunkName: "Auth" */ '@/pages/Auth/Logout.vue')
  },
  {
    path: '/accept',
    redirect: 'welcome/accept'
  },
  // --------------------------- //
  //
  // Tutorials
  //
  // --------------------------- //
  {
    name: 'tutorial',
    path: '/tutorial/:id?',
    component: () =>
      import(
        /* webpackChunkName: "tutorials" */ '@/pages/Tutorials/Tutorials.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'notifications',
    path: '/notifications',
    component: () =>
      import(
        /* webpackChunkName: "notifications" */ '@/pages/Notifications/Notifications.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'home',
    path: '/home',
    component: () =>
      import(/* webpackChunkName: "home" */ '@/pages/Home/Home.vue'),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    name: 'team-switched',
    path: '/team-switched',
    component: () =>
      import(/* webpackChunkName: "team-switched" */ '@/pages/TeamSwitched.vue')
  },
  {
    name: 'access-denied',
    path: '/access-denied',
    component: () =>
      import(/* webpackChunkName: "access-denied" */ '@/pages/AccessDenied.vue')
  },
  {
    name: 'dashboard',
    alias: '/',
    path: '/:tenant?',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Dashboard/Dashboard.vue'
      ),
    beforeEnter: multiguard([authNavGuard, tenantNavGuard])
  },
  {
    path: '*',
    redirect: '404'
  }
]

function getElementPosition(el) {
  const docEl = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

function scrollToHash(to) {
  const targetElement = document.querySelector(to.hash)

  if (targetElement) {
    let elPos = getElementPosition(targetElement),
      elRect = targetElement.getBoundingClientRect()

    let position =
      elRect.height > window.innerHeight
        ? elPos.y
        : elPos.y - (window.innerHeight - elRect.height) / 2

    return window.scrollTo({
      top: position,
      behavior: 'smooth'
    })
  }
}

const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      scrollToHash(to)
    }
  }
})

export default router
