const axios = require('axios')
const qs = require('qs');

const Common = require('./common')
class Token {
  constructor(options) {
    this.options = options
  }

  generateAuthToken() {
    const _self = this

    return new Promise((resolve, reject) => {
      const data = qs.stringify({
        'client_id': _self.options.apiKey,
        'client_secret': _self.options.secret,
        'scope': 'payments',
        'grant_type': 'client_credentials'
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: Common.AUTH_TOKEN_URL,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      }

      axios(config)
        .then(function (response) {
          const result = response.data
          if (!result.access_token || result.access_token === 'None') {
            return reject(result.description)
          }
          return resolve(result.access_token)
        })
        .catch(function (error) {
          return reject(error)
        })
    })
  }
}

module.exports = Token
