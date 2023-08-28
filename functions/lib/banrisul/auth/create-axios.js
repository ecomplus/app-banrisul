const axios = require('axios')
module.exports = (accessToken, isGetToken) => {
  const isSandbox = false // TODO: false

  const headers = {
    'Content-Type': 'application/json'
  }

  if (accessToken) {
    console.log('> token ', accessToken)
    headers.Authorization = `Bearer ${accessToken}`
  }

  return axios.create({
    baseURL: `https://api${isSandbox ? 'dev' : ''}.banrisul.com.br${isGetToken ? '' : '/cobranca/v1'}`,
    headers
  })
}
