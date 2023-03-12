const validate = require('validate.js')
const axios = require('axios')
const _ = require('lodash')

const Common = require('./common');
const Token = require('./token')

class STKPush {
  constructor(options) {
    const _self = this
    this.options = options

    const token = new Token(options)
      .generateAuthToken()
      .then(function (authToken) {
        return authToken
      }).catch((error) => {
        console.log(error)
      })

    this._stkPush = function (params) {
      let validationError

      // validate params
      const _validateParams = function () {
        const constraints = {
          billAccountRef: {
            presence: true,
            isString: true
          },
          amount: {
            presence: true,
            isString: true
          },
          mobileNumber: {
            presence: true,
            isString: true
          }
        }

        const error = validate(params, constraints)
        if (error) {
          let msg = '';
          for (let k in error) {
            msg += error[k] + '; ';
          }
          validationError = new Error(msg);
        }
      }

      _validateParams()
      return new Promise(function (resolve, reject) {
        if (validationError) {
          reject(validationError)
        }

        const body = JSON.stringify({
          "dbsReferenceId": "REW21331DR5F1", //TODO: Generate Dynamically
          "billAccountRef": params.billAccountRef,
          "amount": params.amount,
          "mobileNumber": params.mobileNumber
        })

        // const tkn = ""

        const url = Common.MPESA_CHECKOUT_URL
        const authToken = `Bearer ${token}`

        const headers = {
          Accept: _self.options.format,
          Authorization: authToken
        }

        axios({
          method: 'POST',
          url,
          headers,
          data: body
        })
          .then(function (response) {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              reject(response.data)
            }
          }).catch(function (error) {
            reject(error)
          })
      })
    }
  }

  stkPush(params) {
    const opts = _.cloneDeep(params)
    return this._stkPush(opts)
  }

}

module.exports = STKPush
