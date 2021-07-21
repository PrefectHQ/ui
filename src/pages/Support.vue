<script>
import LogRocket from 'logrocket'
import { mapGetters } from 'vuex'

const categories = [
  { category: 'I need help', message: 'How can we help?' },
  {
    category: "I've found a bug",
    message: "Please describe what you're seeing"
  },
  {
    category: 'I have some feedback',
    message: 'Let us know how we can improve!'
  },
  { category: 'Something else', message: "Let us know what you're thinking" }
]

export default {
  data() {
    return {
      categories: categories,
      error: false,
      loading: false,
      messageRules: [v => !!v || 'Message is required'],
      message: null,
      success: false,
      selectedCategory: 'I need help',
      valid: true
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    messageLabel() {
      return this.categories.find(c => c.category == this.selectedCategory)
        ?.message
    },
    mdScreen() {
      return this.$vuetify?.breakpoint?.mdAndUp
    },
    messageWithLogRocketSession() {
      let url = ''
      LogRocket.getSessionURL(sessionURL => {
        url = sessionURL
      })
      return this.selectedCategory === 'I need help' ||
        this.selectedCategory === "I've found a bug"
        ? `${this.message} Relevant LogRocket URL: ${url}`
        : this.message
    }
  },
  methods: {
    submit() {
      this.error = false

      if (this.$refs.form.validate()) {
        this.loading = true
        this.sendFeedback()
      } else {
        this.error = true
      }
    },
    async sendFeedback() {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: require('@/graphql/support/send-feedback.gql'),
          variables: {
            type: this.selectedCategory,
            message: this.messageWithLogRocketSession
          }
        })
        this.success = data?.send_feedback?.success
        this.error = !data?.send_feedback?.success
      } catch (e) {
        this.error = true
        LogRocket.captureException(e, {
          extra: {
            pageName: 'Support',
            stage: 'Form Submit'
          }
        })
      }

      this.loading = false
    }
  }
}
</script>

<template>
  <v-container class="body" fluid>
    <v-row class="pa-12">
      <v-card class="pa-12 mx-auto" tile>
        <v-card-text>
          <v-row class="pa-12">
            <v-col
              cols="12"
              md="6"
              :class="mdScreen ? 'text-right' : 'text-center'"
              class="d-flex justify-center flex-column"
            >
              <img
                class="photo"
                src="@/assets/backgrounds/support_illustration.svg"
                alt="Support Image"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              :class="mdScreen ? 'text-left' : 'text-center'"
              class="d-flex justify-center flex-column"
            >
              <v-fade-transition mode="out-in">
                <div v-if="!success" key="description">
                  <div class="text-h5">
                    How can we help?
                  </div>
                  <div class="text-subtitle-1 my-4">
                    Let us know how our team can improve your experience. We're
                    up to the task!
                  </div>

                  <v-form v-if="!success" ref="form" v-model="valid">
                    <v-select
                      v-model="selectedCategory"
                      :disabled="loading"
                      :items="categories"
                      item-text="category"
                      item-value="category"
                      outlined
                    ></v-select>

                    <v-textarea
                      v-model="message"
                      :disabled="loading"
                      :label="messageLabel"
                      :rules="messageRules"
                      required
                      auto-grow
                      row-height="4"
                    />
                    <v-btn
                      :disabled="!valid"
                      :loading="loading"
                      color="primary"
                      class="mt-4"
                      depressed
                      @click="submit"
                    >
                      Submit
                    </v-btn>
                  </v-form>

                  <v-fade-transition mode="out-in">
                    <div v-if="error" key="error" class="primary--text mt-4">
                      Oh no! It looks like we didn't quite get your message.
                      Please try again, or feel free to send us an email at
                      help@prefect.io!
                    </div>
                  </v-fade-transition>
                </div>

                <div v-else-if="success" key="success">
                  <div class="text-h5">
                    We got your message!
                  </div>
                  <div class="text-subtitle-1 my-4">
                    <span v-if="selectedCategory == 'I need help'">
                      Don't panic! We'll be in touch as soon as possible. <br />
                      While you wait, you can
                    </span>

                    <span v-if="selectedCategory == 'I\'ve found a bug'">
                      You rock! We'll get our team on it immediately. <br />
                      By the way, you can
                    </span>

                    <span v-if="selectedCategory == 'I have some feedback'">
                      Thanks for letting us know! We're always looking to
                      improve.
                      <br />
                      If you haven't already,
                    </span>

                    <span v-if="selectedCategory == 'Something else'">
                      Thanks! We'll look into your message as soon as possible.
                      <br />
                      If you haven't already,
                    </span>

                    <a target="_blank" href="https://prefect.io/slack"
                      >join our Slack</a
                    >
                    to ask questions, provide feedback, or just to chat! You can
                    also check out our
                    <a target="_blank" href="https://docs.prefect.io">docs</a>,
                    which are filled with lots of helpful tutorials,
                    explanations, and useful information.
                  </div>
                </div>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row class="text-center pa-12" align="end" justify="end">
      <v-col class="d-flex flex-column">
        <div class="text-h6 font-weight-medium primary--text">
          Explore the Docs
        </div>
        <div class="text-h6 my-6">
          Endless possibilities with Prefect automation
        </div>
        <div>
          <v-btn
            color="accentOrange"
            outlined
            dark
            depressed
            target="_blank"
            href="https://docs.prefect.io"
          >
            Prefect Docs
          </v-btn>
        </div>
      </v-col>
      <v-col>
        <div class="text-h6 font-weight-medium primary--text">
          Join our Slack
        </div>
        <div class="text-h6 my-6">
          Chat with us, ask questions, and share tips
        </div>
        <div>
          <v-btn
            color="accentOrange"
            outlined
            dark
            depressed
            target="_blank"
            href="https://prefect.io/slack"
          >
            Join Slack
          </v-btn>
        </div>
      </v-col>
      <v-col>
        <div class="text-h6 font-weight-medium primary--text">
          Read the Blog
        </div>
        <div class="text-h6 my-6">
          Find our updates, tutorials, and announcements
        </div>
        <div>
          <v-btn
            color="accentOrange"
            outlined
            dark
            depressed
            target="_blank"
            href="https://medium.com/the-prefect-blog"
          >
            Read our blog
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.body {
  // background-image: linear-gradient(to bottom right, #2196f3 49.9%, #fff 50%);
  height: 100%;
}

.row {
  max-height: 80vh;
}

.photo-wrapper {
  max-width: 700px;
  position: relative;

  @media screen and (max-width: 1366px) {
    max-width: 470px;
  }
}

.photo {
  max-width: 700px;
  width: 100%;

  @media screen and (max-width: 1366px) {
    max-width: 470px;
  }
}
</style>
