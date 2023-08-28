const axios = require('./create-axios')
const qs = require('qs')

module.exports = (clientId, clientSecret, isSandbox) => new Promise((resolve, reject) => {
  const banrisulAxios = axios(null, true, isSandbox)

  const request = async (isRetry) => {
    try {
      const headers = {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      }

      const body = {
        grant_type: 'client_credentials',
        scope: 'boletos'
      }

      const { data: { access_token: token } } = await banrisulAxios.post(
        '/auth/oauth/v2/token',
        qs.stringify(body),
        { headers }
      )

      resolve(token)
    } catch (err) {
      if (!isRetry && err.response && err.response.status >= 429) {
        setTimeout(() => request(true), 7000)
      }
      reject(err)
    }
  }

  request()
})
