const axios = require('axios');
const Common = require('./common')

function authToken() {
  const _self = this;

  const qs = require('qs');
  const data = qs.stringify({
    client_id: _self.apiKey,
    client_secret: _self.secret,
    scope: 'payments',
    grant_type: 'client_credentials'
  });
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: Common.AUTH_TOKEN_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      const result = response.data
      return result.authToken
    })
    .catch(function (error) {
      return(error);
    });
}

module.exports = authToken


// generateAuthToken() {
//   const _self = this;
//   return new Promise((resolve, reject) => {
//     const config = {
//       method: 'post',
//       url: Common.AUTH_TOKEN_URL,
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       data: JSON.stringify({
//         client_id: _self.options.apiKey,
//         client_secret: _self.options.secret
//       })
//     };
//     axios(config)
//       .then(function (resp) {
//         const results = resp.data;
//         if (!results.access_token || results.access_token === 'None') {
//           return reject(results.description);
//         };
//         return resolve(results)
//       })
//       .catch(function (error) {
//         return reject(error);
//       });
//   });


//   module.exports = Token;
