import gql from 'graphql-tag'

export default function(isCloud) {
  return gql`
    query FlowRun(
      $id: uuid!
    ) {
      flow_run_by_pk(id: $id) {
        id
        name
        version
        labels
        auto_scheduled

        ${
          isCloud
            ? `
            created_by {
              id
              username
            }
          `
            : ''
        }

        auto_scheduled
        context
        end_time
        flow_id
        name
        parameters
        run_config
        scheduled_start_time
        start_time
        state
        state_message
        state_timestamp
        parameters
        context
        agent_id

        states {
          id
          state
          timestamp
          start_time
        }

        flow {
          id
          name
          version
          version_group_id
          core_version
          parameters
          archived
          flow_group_id
          project {
            id
            name
          }
        }
      }
    }
  `
}
