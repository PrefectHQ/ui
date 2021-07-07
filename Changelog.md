# Changelog

## Unreleased

### Features and Improvements

- Show current team name on account page if no account name is found - [#923](https://github.com/PrefectHQ/ui/pull/923)

### Bugfixes

- Should include a fix for [#929](https://github.com/PrefectHQ/ui/issues/929), [#928](https://github.com/PrefectHQ/ui/issues/928), [#885](https://github.com/PrefectHQ/ui/issues/885), and [#813](https://github.com/PrefectHQ/ui/issues/813) - [#922](https://github.com/PrefectHQ/ui/pull/922)
- Fix role highlight in dark mode - [#925](https://github.com/PrefectHQ/ui/pull/925)
- Fix indentation error in doc code snippet - [#932](https://github.com/PrefectHQ/ui/pull/932)
- Enables the quick run button for flows with required parameters with defaults on the flow object and not the flow group object - [#935](https://github.com/PrefectHQ/ui/pull/935)

## 2021-06-24

### Bugfixes

- Switch permissions check on members page to be basic-rbac instead of custom-role - [#920](https://github.com/PrefectHQ/ui/pull/920)
- Fix membership invitation role selection - [#918](https://github.com/PrefectHQ/ui/pull/918)

## 2021-06-23a

### Bugfixes

- Disable schedule toggle only if a user does not have create or delete run permission - [#916](https://github.com/PrefectHQ/ui/pull/916)

## 2021-06-23

### Features and Improvements

- Improve agents tile for server - [#901](https://github.com/PrefectHQ/ui/pull/901)
- Improve account management experience and add multi-tenancy tenant management - [#909](https://github.com/PrefectHQ/ui/pull/909)
- Add a custom roles page - [#881](https://github.com/PrefectHQ/ui/pull/881)

### Bugfixes

- Add permission bypass for Server - [#912](https://github.com/PrefectHQ/ui/pull/912)

## 2021-06-17

### Features and Improvements

- Add agent screens - [#852](https://github.com/PrefectHQ/ui/pull/852)
- Add the `mapped_children` route to the IAPI allow-list - [#891](https://github.com/PrefectHQ/ui/pull/891)
- Add the netlify script to the csp - [#897](https://github.com/PrefectHQ/ui/pull/897)
- Improve expired auth and id token handling - [#896](https://github.com/PrefectHQ/ui/pull/896)

### Bugfixes

- Fix KV copy button issue - [#887](https://github.com/PrefectHQ/ui/pull/887)
- Check explicitly for map index of 0 to avoid falsey in restart button [#890](https://github.com/PrefectHQ/ui/pull/890)
- Remove setAgents from app.vue - [#898](https://github.com/PrefectHQ/ui/pull/898)

## 2021-06-02

### Features and Improvements

- Add KV Store - [#804](https://github.com/PrefectHQ/ui/pull/804)

### Bugfixes

- Fix KV Store space formatting issue for certain characters

## 2021-06-01

### Features and Improvements

- Add webhook and pause schedule actions to automations - [#818](https://github.com/PrefectHQ/ui/pull/818)

### Bugfixes

- Display task run name in Schematic - [#863](https://github.com/PrefectHQ/ui/pull/863)
- Various bugfixes related to null tenants and team invitaitons - [#862](https://github.com/PrefectHQ/ui/pull/862)

## 2021-05-25

### Bugfixes

- Remove bad fetchPolicy on tenant settings mutation - [#858](https://github.com/PrefectHQ/ui/pull/858)

## 2021-05-24

### Features and Improvements

- Remove auth layer from the application and improve support for webkit browsers - [#811](https://github.com/PrefectHQ/ui/pull/811)
- Remove Server/Cloud switcher - [#844](https://github.com/PrefectHQ/ui/pull/844)
- Allow configurable base url and relative public assets path - [#849](https://github.com/PrefectHQ/ui/pull/849)

### Bugfixes

- Fix broken api store core version ref - [#847](https://github.com/PrefectHQ/ui/pull/847)
- Fix issues with pre-populating and resetting job templates and task definitions for run configs - [#839](https://github.com/PrefectHQ/ui/pull/839)
- Check for the correct values when disabling next for the Pager Duty action - [#835](https://github.com/PrefectHQ/ui/pull/835)
- Don't show work queue option in Server - [#848](https://github.com/PrefectHQ/ui/pull/848)
- Fix issue with overlapping sidebar/application nav on small screens - [#850](https://github.com/PrefectHQ/ui/pull/850)

## 2021-05-17

### Bugfixes

- Covert this.allowedUsers in the Members component to a computed property to use the nullish coalescing operator/check for total allowed users -[#841](https://github.com/PrefectHQ/ui/pull/841)
- Beautify json and add json type to default parameters json edit option to stop value flicker - [#837](https://github.com/PrefectHQ/ui/pull/837)

## 2021-05-14

### Features and Improvements

- Adds created by information to service account api keys list - [#808](https://github.com/PrefectHQ/ui/pull/808)
- Turn the status indicator warning yellow when cloud is in maintenance mode - [#815](https://github.com/PrefectHQ/ui/pull/815)
- Add new states to the license store - [#763](https://github.com/PrefectHQ/ui/pull/763)
- Add a tooltip for task run names in the flow run task table - [#814](https://github.com/PrefectHQ/ui/pull/814)
- Add "Task" to the "Runs Today" to make it clear it's "Task runs today" - [#816](https://github.com/PrefectHQ/ui/pull/816)
- Add cancel all and work queue paused system actions, VU for clear late runs on the dashboard - [#825](https://github.com/PrefectHQ/ui/pull/825)

### Bugfixes

- Fix issue setting default tenant in server and bypassing auth - [#828](https://github.com/PrefectHQ/ui/pull/828)

## 2021-05-05

### Bugfixes

- Fix the issue where the key fields for the context and environment are disabled after typing on the run page - [#810](https://github.com/PrefectHQ/ui/pull/810)
- Populate JSON editor with only checked parameters - [#787](https://github.com/PrefectHQ/ui/pull/787)

## 2021-05-04

### Features and Improvements

- Update Universal-Deploy.md to include the latest authentication steps - [#806](https://github.com/PrefectHQ/ui/pull/806)
- Adds animated hint for users creating new automations - [#784](https://github.com/PrefectHQ/ui/pull/784)
- Adds a loading indicator for inital page load - [#789](https://github.com/PrefectHQ/ui/pull/789)
- Take usage tile off dashboard and add to account page - [#782](https://github.com/PrefectHQ/ui/pull/782)
- Add dropdown to specify logging level on flow runs [#769](https://github.com/PrefectHQ/ui/pull/769)

### Bugfixes

- Fix issue with Server check on startup - [#788](https://github.com/PrefectHQ/ui/pull/788)
- Fix issue with User API Keys screen and no default tenants on keys - [#802](https://github.com/PrefectHQ/ui/pull/802)

## 2021-04-21

### Bugfixes

- Fix auth loop - [#783](https://github.com/PrefectHQ/ui/pull/783)

## 2021-04-15

### Features and Improvements

- Adds breadcrumb to allow easy access to current flow version and spawning flow version from a flow run screen [#759](https://github.com/PrefectHQ/ui/pull/759)
- Add loading state to sign out method - [#766](https://github.com/PrefectHQ/ui/pull/766)

### Bugfixes

- Update tutorial to reference API keys instead of personal access and runner tokens - [#770](https://github.com/PrefectHQ/ui/pull/770)
- Update user menu for API keys - [#778](https://github.com/PrefectHQ/ui/pull/778)
- Fix JSON stringification error - [#777](https://github.com/PrefectHQ/ui/pull/777)
- Fix weird rounding display bug - [#768](https://github.com/PrefectHQ/ui/pull/768)
- Make team creation error text more legible - [#767](https://github.com/PrefectHQ/ui/pull/767)
- Fix auth checks when returning to the application - [#774](https://github.com/PrefectHQ/ui/pull/774)
- Don't allow non-Cloud users to get stuck in a redirect loop if they try out the toggle - [#772](https://github.com/PrefectHQ/ui/pull/772)

## 2021-04-09a

### Features and Improvements

- Automations! - [#695](https://github.com/PrefectHQ/ui/pull/695)

## 2021-04-09

### Features and Improvements

- Add a label specifying which flow version the flow run has spawned from - [#736](https://github.com/PrefectHQ/ui/pull/736)
- Adds a tenant selector to User > API Keys creation screen - [#753](https://github.com/PrefectHQ/ui/pull/753)
- Add skip button to onboarding screens, create licenses without user interaction - [#754](https://github.com/PrefectHQ/ui/pull/754)

## 2021-04-07

### Features and Improvements

- Remove all static Slack invite links in favor of the centralized prefect.io/slack link - [#747](https://github.com/PrefectHQ/ui/pull/747)

### Bugfixes

- Fixes illegible /plans page when in dark mode - [#748](https://github.com/PrefectHQ/ui/pull/748)
- Don't allow flow run restarts for archived flow versions - [#714](https://github.com/PrefectHQ/ui/pull/714)
- Change the css class for the "current" label in the teams section to make it more legible - [#737](https://github.com/PrefectHQ/ui/pull/737)

## 2021-04-06a

### Features and Improvements

- Check role setting based on permissions blob instead of plan name - [#743](https://github.com/PrefectHQ/ui/pull/743)

## 2021-04-06

### Features and Improvements

- Include legacy platform licenses in RBAC check - [#740](https://github.com/PrefectHQ/ui/pull/740)

### Bugfixes

- Fix an issue where we weren't correctly passing the license id to the committed usage query - [#741](https://github.com/PrefectHQ/ui/pull/741)

## 2021-04-05

### Features and Improvements

- Add the remaining states to the state filter - [#706](https://github.com/PrefectHQ/ui/pull/706)
- Add Automations page - [#695](https://github.com/PrefectHQ/ui/pull/695)
- Add Service Accounts and API keys to the UI - [#678](https://github.com/PrefectHQ/ui/pull/678)
- Add generic markdown messages for action notifications - [#674](https://github.com/PrefectHQ/ui/pull/674)
- Update packages - [#707](https://github.com/PrefectHQ/ui/pull/707)
- Populate errors when creating a schedule - [#725](https://github.com/PrefectHQ/ui/pull/725)

### Bugfixes

- Add log id to route query - [#712](https://github.com/PrefectHQ/ui/pull/712)
- Make the duration header not sortable - [#699](https://github.com/PrefectHQ/ui/pull/699)
- Fix a bug where double clicking could kick off multiple quick runs - [#696](https://github.com/PrefectHQ/ui/pull/696)
- Make artifacts legible in dark mode - [#693](https://github.com/PrefectHQ/ui/pull/693)
- Usage timeline bugfixes - [#722](https://github.com/PrefectHQ/ui/pull/722)
- Add the proper permissions to role-based invitations - [#719](https://github.com/PrefectHQ/ui/pull/719)
- Add the proper permissions to flow and task concurrency pages - [#720](https://github.com/PrefectHQ/ui/pull/720)
- Small onboarding fixes - [#721](https://github.com/PrefectHQ/ui/pull/721)
- Fix gutters on the tile layout for row-2-col-1 - [#738](https://github.com/PrefectHQ/ui/pull/738)

## 2021-03-25

### Features and Improvements

- Add default parameters to the schedules - [#683](https://github.com/PrefectHQ/ui/pull/683)
- Add the "Running" state to the state filter - [#675](https://github.com/PrefectHQ/ui/pull/675)
- Add terminal link to apollo to abort requests with expired headers - [#690](https://github.com/PrefectHQ/ui/pull/690)
- Use `delete_flow_group` mutation when deleting flows - [#689](https://github.com/PrefectHQ/ui/pull/689)
- Flow run page performance improvements (part 1) and shared service worker for token refresh - [#679](https://github.com/PrefectHQ/ui/pull/679)
- Flow run page performance improvements (part 2) - [#688](https://github.com/PrefectHQ/ui/pull/688)

## 2021-03-16

### Bugfixes

- Fix a bug where a license would get created even though there are validation errors present - [#672](https://github.com/PrefectHQ/ui/pull/672)
- Updates links to the website - [#673](https://github.com/PrefectHQ/ui/pull/673)
- Remove unhelpful tooltip on Secrets - [#665](https://github.com/PrefectHQ/ui/pull/665)

## 2021-03-15a

### Bugfixes

- Remove details references from the task run table tile - [#670](https://github.com/PrefectHQ/ui/pull/670)

## 2021-03-15

### Features and Improvements

- Add a state filter to the flow run table - [#645](https://github.com/PrefectHQ/ui/pull/645)
- Create a UI dark mode - [#656](https://github.com/PrefectHQ/ui/pull/656)

### Bugfixes

- Fix the blank "Created by" column in the Flow Groups - [#657](https://github.com/PrefectHQ/ui/pull/657)
- Fix the clear button on the dashboard so that it clears scheduled runs - [#653](https://github.com/PrefectHQ/ui/pull/653)
- Fix indefinite task run duration when using mapped cases - [#650](https://github.com/PrefectHQ/ui/pull/650)

## 2021-03-09

### Features and Improvements

- Add account/usage dashboards and new usage pricing - Merged directly
- Add a state sort to the task run table - [#633](https://github.com/PrefectHQ/ui/pull/633)

### Bugfixes

- Cleans up agents with no last query time - [#646](https://github.com/PrefectHQ/ui/pull/646)

## 2021-03-02

### Features and Improvements

- Enables you to open up multiple links at the same time without redirecting to the first link - [#631](https://github.com/PrefectHQ/ui/pull/631)
- Add interactive-api header - [#628](https://github.com/PrefectHQ/ui/pull/628)

### Bugfixes

- Fix z order positioning on agent controls - [#617](https://github.com/PrefectHQ/ui/pull/617)

## 2021-02-23

### Features and Improvements

- Add a "How did you hear about us" dropdown to the signup flow - [#615](https://github.com/PrefectHQ/ui/pull/615)
- Add tenant and user ids to API requests as headers - [#621](https://github.com/PrefectHQ/ui/pull/621)

### Bugfixes

- Add extra check for flow group to the flow nav guard - [#590](https://github.com/PrefectHQ/ui/pull/590)
- Add error handling to the agents clean-up button - [#591](https://github.com/PrefectHQ/ui/pull/591)

## 2021-02-12

### Bugfixes

- Hotfix runconfigs; remove labels from the run config and put them in the `create_flow_run` mutation instead - [#610](https://github.com/PrefectHQ/ui/pull/610)

## 2021-02-11

### Features and Improvements

- Update run form and add runconfig form - [#585](https://github.com/PrefectHQ/ui/pull/585)
- Add a description tab to the flow page - [#563](https://github.com/PrefectHQ/ui/pull/563)
- Check for missing or mismatched labels on Server - [#593](https://github.com/PrefectHQ/ui/pull/593)
- Update wording on tutorial banner for server users - [#592](https://github.com/PrefectHQ/ui/pull/592)
- Minimizes reliance on network connection to have a functioning UI (allows Server UI to be completely airgapped after install) - [#595](https://github.com/PrefectHQ/ui/pull/595)
- Add hints and improve JSON input prepended icon clarity - [#606](https://github.com/PrefectHQ/ui/pull/606)

### Bugfixes

- Fixes an issue with runconfig dict input not being populated correctly - [#606](https://github.com/PrefectHQ/ui/pull/606)

## 2021-02-03

### Features and Improvements

- Update .env file with new auth variables - [#583](https://github.com/PrefectHQ/ui/pull/583)

## 2021-01-28

### Features and Improvements

- Improve auth error handling in access_denied circumstances and add a new error page - [#576](https://github.com/PrefectHQ/ui/pull/576)

### Bugfixes

- Displays the timezone of the scheduled time in the Details Tile - [#570](https://github.com/PrefectHQ/ui/pull/570)
- Fix issues related to token refresh - [#574](https://github.com/PrefectHQ/ui/pull/574)

## 2021-01-25

### Bugfixes

- Adds the timezone field to the set_flow_group_schedule mutation to allow the clocks to be set to the user's desired timezone - [#532](https://github.com/PrefectHQ/ui/pull/532)
- Neaten up the 404 page and better handle invalid flow ids - [#562](https://github.com/PrefectHQ/ui/pull/562)
- Show proper page tab on page reload - [#561](https://github.com/PrefectHQ/ui/pull/561)

## 2021-01-19

### Features and Improvements

- Improve dashboard and flow page query performance - [#558](https://github.com/PrefectHQ/ui/pull/558)
- Hard-cap dashboard timeline queries to 1 month out (improves performance) - [#558](https://github.com/PrefectHQ/ui/pull/558)

### Bugfixes

- Fix bug where some flows with schedules were showing None in details card - [#553](https://github.com/PrefectHQ/ui/pull/553)
- Fix an issue with task error pane stuttering every few seconds - [#558](https://github.com/PrefectHQ/ui/pull/558)

## 2021-01-07

### Features and Improvements

- Adds a banner to direct new users to the tutorials page - [#516](https://github.com/PrefectHQ/ui/pull/516)

### Bugfixes

- Exempt mutations from query limits in the InteractiveAPI (and fix some aggressive truncation in the team sidebar button) - [#533](https://github.com/PrefectHQ/ui/pull/533)
- Fix bad refs to memberships and tenants on load (top nav slug fix) - [#534](https://github.com/PrefectHQ/ui/pull/534)

## 2021-01-05

### Features and Improvements

- Add a flow run calendar view page - [#433](https://github.com/PrefectHQ/ui/pull/433)
- Move to GraphiQL for our Interactive API - [#509](https://github.com/PrefectHQ/ui/pull/509)
- Simplify the flow run query for calendar view - [#518](https://github.com/PrefectHQ/ui/pull/518)
- VU for top level nav and sidebar - [#520](https://github.com/PrefectHQ/ui/pull/520)
- Introduce directory-based project - flow - task view to the sidebar - [#520](https://github.com/PrefectHQ/ui/pull/520)

### Bugfixes

- Fix tenant and backend switch on the calendar view - [#524](https://github.com/PrefectHQ/ui/pull/524)
- Add tooltip to notifications tile to ensure title is visible - [#527](https://github.com/PrefectHQ/ui/pull/527)

## 2020-12-18

### Bugfixes

- Assorted visual bugs - [#507](https://github.com/PrefectHQ/ui/pull/507)
- Remove disabled from the artifacts tab on mobile pages - [#512](https://github.com/PrefectHQ/ui/pull/512)
- Route to the 404 page if an incomplete or incorrect flow run, task or task run uuid is given in the route - [#511](https://github.com/PrefectHQ/ui/pull/511)
- Remove decrossing from schematic graph calculations - [#515](https://github.com/PrefectHQ/ui/pull/515)

## 2020-12-14

### Features and Improvements

- Add task run names to global search - [#485](https://github.com/PrefectHQ/ui/pull/485)

### Bugfixes

- Add link handling to artifacts page - [#498](https://github.com/PrefectHQ/ui/pull/498)

## 2020-12-07

### Features and Improvements

- Changes the design of the Set State modal to match the design of the other forms - [#465](https://github.com/PrefectHQ/ui/pull/465)
- Changes the default table rows to more sensible defaults - [#475](https://github.com/PrefectHQ/ui/pull/475)
- Add a footer to the app - [#451](https://github.com/PrefectHQ/ui/pull/451)

### Bugfixes

- Fix jumping height on subnav = [#476](https://github.com/PrefectHQ/ui/pull/476)
- Removed tutorial that does not work as previously intended - [#480](https://github.com/PrefectHQ/ui/pull/480)
- Switch "cancel" to "close" on token dialogs - [#488](https://github.com/PrefectHQ/ui/pull/488)

## 2020-11-13

### Features and Improvements

- Aims to improve and convert the current tutorials into md - [#434](https://github.com/PrefectHQ/ui/pull/434)
- Add the Prefect Core version to the side navigation bar for Server users - [#431](https://github.com/PrefectHQ/ui/pull/431)
- Allow editing flow run names from the flow run page - [#448](https://github.com/PrefectHQ/ui/pull/448)
- Allow editing task run names from the task run page - [#449](https://github.com/PrefectHQ/ui/pull/449)
- Fixes subpage nav to top of page when scrolling - [#407](https://github.com/PrefectHQ/ui/issues/407)
- Update wording on the team onboarding page - [#471](https://github.com/PrefectHQ/ui/pull/471)

### Bugfixes

- Fix an issue where restarting a task run would fail to correctly set downstream task run states - [#452](https://github.com/PrefectHQ/ui/pull/452)
- Fix schematic node finished task run durations - [#468](https://github.com/PrefectHQ/ui/pull/468)

## 2020-11-13

### Features and Improvements

- Add feature teaser to the Artifacts tabs on the task run and flow run pages - [#435](https://github.com/PrefectHQ/ui/pull/435)

## 2020-11-12

### Features and Improvements

- Remove the Gantt Chart (replaced by the Timeline) and `vue-apexcharts` - [#278](https://github.com/PrefectHQ/ui/pull/278)
- Add the Flow Run timeline to the Flow Run Overview Page - [#278](https://github.com/PrefectHQ/ui/pull/278)

## 2020-11-11

### Features and Improvements

- Add a "Your Teams" page to the User menu, allowing you to see and change memberships - [#194](https://github.com/PrefectHQ/ui/issues/194)
- Allow querying for agents from the IAPI - [#425](https://github.com/PrefectHQ/ui/pull/425)
- Add a "Clean Up" button to allow bulk removal of unhealthy agents - [#425](https://github.com/PrefectHQ/ui/pull/425)
- Remove obsolete invitation sort code in for pending invitation queries - [#417](https://github.com/PrefectHQ/ui/pull/417)

### Bugfixes

- Fix an issue where agent labels were overflowing their bounding box - [#425](https://github.com/PrefectHQ/ui/pull/425)
- Make sure task runs are fetched for the set state button - [#411](https://github.com/PrefectHQ/ui/pull/411)

## 2020-11-10

### Features and Improvements

- Update the Cloud Hooks email input rules to allow multiple comma-separated emails - [#372](https://github.com/PrefectHQ/ui/pull/372)
- Add indicator for resource manager tasks - [#396](https://github.com/PrefectHQ/ui/pull/396)
- Add more info to a flow's "Run Config" details section - [#400](https://github.com/PrefectHQ/ui/pull/400)
- Enable filtering by all state types in the activity timeline tile [#402](https://github.com/PrefectHQ/ui/pull/402)

### Bugfixes

- Make sure the upcoming runs tile switches back to the upcoming tab when there are no late runs - [#395](https://github.com/PrefectHQ/ui/pull/395)
- Make agents and upoming runs tile refresh when switch backend - [#395](https://github.com/PrefectHQ/ui/pull/395)
- Fix a bug on restart from failed which was missing failed task runs [#398](https://github.com/PrefectHQ/ui/pull/398)
- Fix issue where scrollbars show on all tiles even when not needed - [#366](https://github.com/PrefectHQ/ui/issues/366)
- Include flow parameters in parameters shown in the flow run parameters tab - [#401](https://github.com/PrefectHQ/ui/pull/401)
- Fix issue with notifications tile actions not being aligned to bottom - [#410](https://github.com/PrefectHQ/ui/pull/410)

## 2020-10-29a

### Features and Improvements

- Add state-driven color-coded tab icos to flow run and task run pages - [#389](https://github.com/PrefectHQ/ui/pull/389)
- Add type selection, including inline JSON validation, to the Secrets page [#370](https://github.com/PrefectHQ/ui/pull/370)
- Add an info card about Vault and secret management to the Secrets page [#377](https://github.com/PrefectHQ/ui/pull/377)

## 2020-10-29

### Features and Improvements

- Add ability to accept team invites on new user creation, go directly to invited team - [#322](https://github.com/PrefectHQ/ui/issues/322)
- Update the agents tile on the dashboard to show flows can not run without agents [#382](https://github.com/PrefectHQ/ui/pull/382)
- Add indicator of number of upcoming or late runs to the dashboard card title - [#348](https://github.com/PrefectHQ/ui/issues/348)

### Bugfixes

- Fix issue with checking authorization for Server users when querying for agents - [#387](https://github.com/PrefectHQ/ui/pull/387)

## 2020-10-23

### Features and Improvements

- Improve the speed and rendering of flow run and task run schematics with mapped tasks - [#364](https://github.com/PrefectHQ/ui/pull/364)
- Improve task run dependency schematics - [#364](https://github.com/PrefectHQ/ui/pull/364)
- Add mapped runs tab to mapped task run pages (parents and children) - [#364](https://github.com/PrefectHQ/ui/pull/364)
- Add task run names where possible to schematics and dependencies tiles - [#364](https://github.com/PrefectHQ/ui/pull/364)
- Adds the project name as a prefix when creating a Cloud Hook - [#363](https://github.com/PrefectHQ/ui/pull/363)
- Remove flow join from the flow run history query - [#365](https://github.com/PrefectHQ/ui/pull/365)
- Add dynamic and templated page titles to the major pages - [#367](https://github.com/PrefectHQ/ui/pull/367)

### Bugfixes

- Fix moving activity timeline on the flow run page - [#364](https://github.com/PrefectHQ/ui/pull/364)

## 2020-10-21

### Features and Improvements

- What's New notifications are now marked as read when clicked from the dashboard - [#344](https://github.com/PrefectHQ/ui/pull/344)
- Update the design of the Accept Invitation Page - [#359](https://github.com/PrefectHQ/ui/pull/359)
- Add helpful links for Server users experienceing connection issues - [#355](https://github.com/PrefectHQ/ui/pull/355)

### Bugfixes

- Move styling for the label edit component to the correct component and add scoping [#330](https://github.com/PrefectHQ/ui/pull/330)
- Fix whitescreen bug and improve time to paint - [#354](https://github.com/PrefectHQ/ui/pull/354)

## 2020-10-13

### Features and Improvements

- Check labels on `flow.run_config` when generating warning for flow labels without an agent [#312](https://github.com/PrefectHQ/ui/pull/312)
- Use labels from `flow.run_config` if present [#309](https://github.com/PrefectHQ/ui/pull/309)

### Bugfixes

- Fix bug where "Loading" still showed after flow name had loaded on hooks page [#288](https://github.com/PrefectHQ/ui/issues/288)
- Fix dashboard flicker on load - [#313](https://github.com/PrefectHQ/ui/pull/313)
- Fix missing tenant slug in url - [#313](https://github.com/PrefectHQ/ui/pull/313)
- Prevent flow table rows expanding on load [#323](https://github.com/PrefectHQ/ui/pull/323)

## 2020-10-09

### Features and Improvements

- Add section to flow details for `flow.run_config` if not null, otherwise display `flow.environment` [#307](https://github.com/PrefectHQ/ui/pull/307)
- Enable restart from cancelled and update restart from failed [#234](https://github.com/PrefectHQ/ui/pull/234)
- Add unit tests for the authNavGuard middleware [#266](https://github.com/PrefectHQ/ui/pull/266)
- Update label edit and label warning to use flow run labels (#300)[https://github.com/PrefectHQ/ui/pull/300]
- Display task run names on flow run page and task run page [#302](https://github.com/PrefectHQ/ui/pull/302)

### Bugfixes

- Fix race condition with `apollo_url` - [#295](https://github.com/PrefectHQ/ui/pull/295)
- Don't pluralize "slot" when only one is being used [#293](https://github.com/PrefectHQ/ui/issues/293)
- Remove duplicate store.commits in authNavGuard unit test [#303](https://github.com/PrefectHQ/ui/pull/303)
- Enable global search for task runs without names [#299](https://github.com/PrefectHQ/ui/pull/299)
- Fix bug with unknown invitation ID in accept invitation [#306](https://github.com/PrefectHQ/ui/pull/306)
- Fix race condition with onboard/welcome flow [#304](https://github.com/PrefectHQ/ui/pull/304)
- Fix version display in flow page version dropdown - [#305](https://github.com/PrefectHQ/ui/pull/305)
- Invalid state hotfix - [#308](https://github.com/PrefectHQ/ui/pull/308)

## 2020-10-05

### Features and Improvements

- Don't display nonexistant user info for flows and flow runs when connected to Prefect Server [#269](https://github.com/PrefectHQ/ui/pull/269)
- Add agent ID to flow run page details for submitted runs [#249](https://github.com/PrefectHQ/ui/pull/249)
- Expose agents page and dashboard tile for server users [#249](https://github.com/PrefectHQ/ui/pull/249)
- Make labels on agent cards scrollable and add ID to information displayed [#249](https://github.com/PrefectHQ/ui/pull/249)

### Bugfixes

- Allow IP address as endpoint for URL cloudhooks [#277](https://github.com/PrefectHQ/ui/pull/277)

## 2020-10-01

### Features and Improvements

- Update information in "Connect the UI" section of the home view [#271](https://github.com/PrefectHQ/ui/pull/271)

### Bugfixes

- Make sure the 'To The Dashboard' button is more visible on the onboard/resources page [#275](https://github.com/PrefectHQ/ui/pull/275)
- Allow label edit on flows created with an older version of core [#273](https://github.com/PrefectHQ/ui/pull/273)
- Redirect to home when UI is loaded up against a Prefect Server instance with no tenants [#270](https://github.com/PrefectHQ/ui/pull/270)
- Direct users to the new tenant when they accept an invitation from the accept invitation page [#274](https://github.com/PrefectHQ/ui/pull/274)

## 2020-09-29

### Features and Improvements

- Add unit tests for the flow navigation guard [#248](https://github.com/PrefectHQ/ui/pull/248)

### Bugfixes

- Hide label affinity warning in server until Core catches up [#264](https://github.com/PrefectHQ/ui/pull/264)
- Fixes a situation where task runs in the table on the flow run page were incorrectly calculating infinite durations - [#267](https://github.com/PrefectHQ/ui/pull/267)

## 2020-09-28a

### Features and Improvements

- Add Vuex user store unit tests and add circleci job to run unit tests on PR [#245](https://github.com/PrefectHQ/ui/pull/245)

### Bugfixes

- Remove link to Cloud tutorials from Server [#255](https://github.com/PrefectHQ/ui/pull/255)
- Fixes instances where allowed users and allowed read only users weren't always being read correctly when license terms were null - [#260](https://github.com/PrefectHQ/ui/pull/260)

## 2020-09-28

### Features and Improvements

- Show user notifications on the notifications tile - [#258](https://github.com/PrefectHQ/ui/pull/258)
- Add dense styling for the WhatsNew notification component - [#258](https://github.com/PrefectHQ/ui/pull/258)

## 2020-09-24

### Bugfixes

- Fix `delete_agent` mutation `agentId` type [#253](https://github.com/PrefectHQ/ui/pull/253)
- Add 24 hour clock to the logs row [#247](https://github.com/PrefectHQ/ui/pull/247)

## 2020-09-23

### Features and Improvements

- Show version group id on the flow details tile[#236](https://github.com/PrefectHQ/ui/pull/236)
- Add a check for flow and agent label alignment and alert if mis-matched [#217](https://github.com/PrefectHQ/ui/pull/217)
- Add unit tests for tenant store [#195](https://github.com/PrefectHQ/ui/pull/195)
- Improves error handling related to garbage collection - [#232](https://github.com/PrefectHQ/ui/pull/232)
- Improves component teardown by accounting for elements whose destroyed method had been called but that hadn't been removed from the DOM due to transitions - [#232](https://github.com/PrefectHQ/ui/pull/232)
- Improve navigation experience when going forward/backward in the browser history - [#232](https://github.com/PrefectHQ/ui/pull/232)
- Improve the usability of apollo endpoint setting - [#241](https://github.com/PrefectHQ/ui/pull/241)

## 2020-09-17

### Features and Improvements

- Add unit tests for tenant store [#195](https://github.com/PrefectHQ/ui/pull/195)
- Improves error handling related to garbage collection - [#232](https://github.com/PrefectHQ/ui/pull/232)
- Improves component teardown by accounting for elements whose destroyed method had been called but that hadn't been removed from the DOM due to transitions - [#232](https://github.com/PrefectHQ/ui/pull/232)
- Improve navigation experience when going forward/backward in the browser history - [#232](https://github.com/PrefectHQ/ui/pull/232)

### Bugfixes

- Fixes errors that were thrown when routing to tenant-guarded pages without passing a tenant slug - [#232](https://github.com/PrefectHQ/ui/pull/232)
- Fix a race condition with flow concurrency usage - [#231](https://github.com/PrefectHQ/ui/pull/231)
- Fix a race condition with task tag concurrency usage - [#235](https://github.com/PrefectHQ/ui/pull/235)

## 2020-09-15

### Features and Improvements

- Fix app-wide component teardown by manually nulling references that were preventing the garbage colector from running correctly - [#212](https://github.com/PrefectHQ/ui/pull/212)
- Remove `task_run` join from the Dashboard-level Upcoming Runs query - [#218](https://github.com/PrefectHQ/ui/pull/218)
- Introduce a notifications tile - [#220](https://github.com/PrefectHQ/ui/pull/220)

### Bugfixes

- Improve error handling on the flow page schedule toggle and label setting [#217](https://github.com/PrefectHQ/ui/pull/217)
- Fix BarChart component resize event listener removal - [#212](https://github.com/PrefectHQ/ui/pull/212)
- Remove all BarChart underscore method and property references - [#212](https://github.com/PrefectHQ/ui/pull/212)
- Fix visual bugs associated with resizing while the BarChart component wasn't visible - [#216](https://github.com/PrefectHQ/ui/pull/216)
- Fix bug preventing late runs from being cleared in the UI - [#227](https://github.com/PrefectHQ/ui/pull/227)

## 2020-09-08

### Features and Improvements

- Add unit test for the auth0 Vuex store[#162](https://github.com/PrefectHQ/ui/pull/162)
- Remove deprecated route calls from Task Concurrency page - [#193](https://github.com/PrefectHQ/ui/pull/193)
- Add a loading state for accepting invitations in the sidenav and a warning before a user removes themself from a tenant [#190](https://github.com/PrefectHQ/ui/pull/190)
- Changes to the barchart visualization to take browser visibility into account when performing repaints of the canvas and svg elements - [201](https://github.com/PrefectHQ/ui/pull/201)
- Removes `task_run` joins on the upcoming runs queries for both the dashboard and flow pages - [201](https://github.com/PrefectHQ/ui/pull/201)
- Create service worker scaffolding - [201](https://github.com/PrefectHQ/ui/pull/201)
- Use native JavaScript Date objects instead of `moment` for duration calculations - [201](https://github.com/PrefectHQ/ui/pull/201)
- Export the Apollo cache - [201](https://github.com/PrefectHQ/ui/pull/201)
- Display the token name instead of the token id on the agent card - [#200](https://https://github.com/PrefectHQ/ui/pull/200)
- Add new Flow Concurrency page for managing user-driven flow concurrency limits - [#199](https://github.com/PrefectHQ/ui/pull/199)

### Bugfixes

- Keep the approve button in a loading state until the task state updates from paused to resume [#192](https://github.com/PrefectHQ/ui/pull/192)

## 2020-09-1

### Features and Improvements

- Add unit tests for the api Vuex store [#127](https://github.com/PrefectHQ/ui/pull/127)
- Rename "Mark As" to "Set State" for clarity - [#183](https://github.com/PrefectHQ/ui/pull/183)
- Add link to task run page from gantt chart - [#185](https://github.com/PrefectHQ/ui/pull/185)
- Add unit tests for the license Vuex store [#164](https://github.com/PrefectHQ/ui/pull/164)
- Show (sorted) default parameters in the flow details tile and add an info card with link to the flow settings tab [#176](https://github.com/PrefectHQ/ui/pull/176)
- Clean up the flow run restart dialog - [#186](https://github.com/PrefectHQ/ui/pull/186)

### Bugfixes

- Fix bug with Restart from Failed rerunning successfull mapped child tasks - [#182](https://github.com/PrefectHQ/ui/issues/182)

## 2020-08-31a

### Features and Improvements

- Display number of expected mapped runs when the data exists - [#173](https://github.com/PrefectHQ/ui/issues/173)
- August package updates [#180](https://github.com/PrefectHQ/ui/pull/180):
  - [@babel/runtime@7.11.2](https://www.npmjs.com/package/@babel/runtime/v/7.11.2)
  - [@vue/cli-plugin-babel@4.5.4](https://www.npmjs.com/package/@vue/cli-plugin-babel/v/4.5.4)
  - [@vue/cli-service@4.5.4](https://www.npmjs.com/package/@vue/cli-service/v/4.5.4)
  - [@babel/plugin-transform-runtime@7.11.5](https://www.npmjs.com/package/@babel/plugin-transform-runtime/v/7.11.5)
  - [@vue/cli-plugin-eslint@4.5.4](https://www.npmjs.com/package/@vue/cli-plugin-eslint/v/4.5.4)
  - [@vue/cli-plugin-unit-jest@4.5.4](https://www.npmjs.com/package/@vue/cli-plugin-unit-jest/v/4.5.4)
  - [babel-jest@26.3.0](https://www.npmjs.com/package/babel-jest/v/26.3.0)
  - [@auth0/auth0-spa-js@1.11.0](https://www.npmjs.com/package/@auth0/auth0-spa-js/v/1.11.0)
  - [@babel/core@7.11.5](https://www.npmjs.com/package/@babel/core/v/7.11.5)
  - [@vue/test-utils@1.0.5](https://www.npmjs.com/package/@vue/test-utils/v/1.0.5)
  - [cronstrue@1.100.0](https://www.npmjs.com/package/cronstrue/v/1.100.0)
  - [codemirror-graphql@0.12.1](https://www.npmjs.com/package/codemirror-graphql/v/0.12.1)
  - [d3-selection@2.0.0](https://www.npmjs.com/package/d3-selection/v/2.0.0) (_removed_)
  - [codemirror@5.57.0](https://www.npmjs.com/package/codemirror/v/5.57.0)
  - [d3@6.1.1](https://www.npmjs.com/package/d3/v/6.1.1)
  - [logrocket@1.0.12](https://www.npmjs.com/package/logrocket/v/1.0.12)
  - [eslint@7.8.0](https://www.npmjs.com/package/eslint/v/7.8.0)
  - [js-beautify@1.13.0](https://www.npmjs.com/package/js-beautify/v/1.13.0)
  - [d3-zoom@2.0.0](https://www.npmjs.com/package/d3-zoom/v/2.0.0)
  - [sinon@9.0.3](https://www.npmjs.com/package/sinon/v/9.0.3)
  - [vue-code-highlight@0.7.5](https://www.npmjs.com/package/vue-code-highlight/v/0.7.5)
  - [vue-router@3.4.3](https://www.npmjs.com/package/vue-router/v/3.4.3)
  - [start-server-and-test@1.11.3](https://www.npmjs.com/package/start-server-and-test/v/1.11.3)
  - [stylelint@13.7.0](https://www.npmjs.com/package/stylelint/v/13.7.0)
  - [vue@2.6.12](https://www.npmjs.com/package/vue/v/2.6.12)
  - [vue-template-compiler@2.6.12](https://www.npmjs.com/package/vue-template-compiler/v/2.6.12)
  - [vuetify@2.3.10](https://www.npmjs.com/package/vuetify/v/2.3.10)

### Bugfixes

- Filter scheduled flows from the activity timeline [#188](https://https://github.com/PrefectHQ/ui/pull/188)

## 2020-08-31

### Features and Improvements

- Update scrollbars with platform-specific styling [#177](https://github.com/PrefectHQ/ui/pull/177)

### Bugfixes

- Fix "overenthusiastic" scrollbars on non-Mac systems [#177](https://github.com/PrefectHQ/ui/pull/177)
- Remove token name length requirement in run flow tutorial [#174](https://github.com/PrefectHQ/ui/pull/174)

## 2020-08-28

### Features and Improvements

- Add unit tests for the refresh and sidenav Vuex stores [#165](https://github.com/PrefectHQ/ui/pull/165)
- Improve state setting UX and restarting flow runs from failure - [#163](https://github.com/PrefectHQ/ui/pull/163)
- Remove references to task and flow run durations [#169](https://github.com/PrefectHQ/ui/pull/169)

### Bugfixes

- Fix log generation when restarting flow runs from failure - [#163](https://github.com/PrefectHQ/ui/pull/163)
- Fix membership invitation toasts [#166](https://github.com/PrefectHQ/ui/pull/166)
- Fix bad labels references for older flows that were preventing the Flow page details tile from rendering correctly [#171](https://github.com/PrefectHQ/ui/pull/171)

## 2020-08-27

### Features and Improvements

- Remove stale references to `run_count` from all GQL queries - [#157](https://github.com/PrefectHQ/ui/pull/157)

### Bugfixes

- Don't show maintenance mode on load (unless it's true) [#159](https://github.com/PrefectHQ/ui/pull/159)

## 2020-08-26

### Features and Improvements

- Update connection icon if Cloud is in maintenance mode - [#155](https://github.com/PrefectHQ/ui/pull/155)

## 2020-08-25

### Features and Improvements

- Add Flow ID to Flow Details Tile - [#135](https://github.com/PrefectHQ/ui/issues/135)

### Bugfixes

- Show payment details in the account page and improve tenant-slug update error handling [#140](https://github.com/PrefectHQ/ui/pull/140)

## 2020-08-24

### Features and Improvements

- Improve handling of cancelling state [#137](https://github.com/PrefectHQ/ui/pull/137)
- Add unit tests for the agent and alert vuex stores[#124](https://github.com/PrefectHQ/ui/pull/124)
- Add way of retrieving archived logs for old flow and task runs - [#128](https://github.com/PrefectHQ/ui/pull/128)

## 2020-08-20

### Bugfixes

- Make dashboard update when a user switches tenant [#123](https://github.com/PrefectHQ/ui/pull/123)

## 2020-08-19

### Bugfixes

- Fix issue with creating new task concurrency limits [#122](https://github.com/PrefectHQ/ui/pull/122)

## 2020-08-18

### Hello, world!

- Add a default parameters page in flow settings[#24](https://github.com/PrefectHQ/ui/pull/24)
- Switch the errors tile to become a failed tasks tile and add better timeout error handling [#6](https://github.com/PrefectHQ/prefect-ui/pull/6)
- Improve the error message design on the flow failures and task failures tiles[#13](https://github.com/PrefectHQ/prefect-ui/pull/13)
- Fix order of "last ten runs" on the flows page [#50](https://github.com/PrefectHQ/ui/pull/50)
- Fix issue with Failed Tasks tile incorrectly displaying with a red color - [#88](https://github.com/PrefectHQ/ui/issues/88)
- Add cancellation button to Flow Run pages [#92](https://github.com/PrefectHQ/ui/pull/92)
- Add text-area to allow a user to add and/or remove labels from the flow details tile [#106](https://github.com/PrefectHQ/ui/pull/106)
- Name the restart mutation and fix casing on the restart mutation variable [#98](https://github.com/PrefectHQ/ui/pull/98)
- Add Created On column to Flow Table - [#103](https://github.com/PrefectHQ/ui/pull/103)
- Improve schedule toggling reactivity [#104](https://github.com/PrefectHQ/ui/pull/104/files)
- Update tenant CLI command in CreateTenant section - [#105](https://github.com/PrefectHQ/ui/pull/105)
- Add an alert to remind users they are on Prefect Cloud if they toggle from Server [#108](https://github.com/PrefectHQ/ui/pull/108)
- Disable Cancel button after pressing it once - [#116](https://github.com/PrefectHQ/ui/pull/116)
- Remove EMAIL Cloud Hook from Server options - [#116](https://github.com/PrefectHQ/ui/pull/116)
