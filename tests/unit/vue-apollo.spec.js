describe('VueApollo', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('does not include credentials by default', () => {
    const { defaultOptions } = require('@/vue-apollo')
    const { link } = defaultOptions

    expect(link.credentials).toEqual(undefined)
  })

  it('includes credentials when specifically indicated', () => {
    process.env.VUE_APP_REQUEST_CREDENTIALS_MODE = 'include'

    const { defaultOptions } = require('@/vue-apollo')
    const { link } = defaultOptions

    expect(link.credentials).toEqual(undefined)
  })
})
