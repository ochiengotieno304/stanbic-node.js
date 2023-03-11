const validate = require('validate.js')
const axios = require('axios')
const _ = require('lodash')

const Common = require('./common')
const token = require('./token')

const authToken = "Bearer " + token()

class StanbicPayments {
  constructor(options) {

    const _self = this;
    this.options = options
    this._stanbicPayments = function (params) {
      let validationError

      // validate params
      const _validateParams = function () {
        const constraints = {
          to: {
            isString: true
          },
          from: {
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
          return reject(validationError)
        }

        const body = {
          originatorAccount: {
            identification: {
              mobileNumber: "0777287562"
            }
          },
          requestedExecutionDate: "2022-12-29",
          dbsReferenceId: "1234567890",
          txnNarrative: "TRANSACTION NARRATIVE",
          callBackUrl: "http://clientdomain.com/omnichannel/esbCallback",
          transferTransactionInformation: {
            instructedAmount: {
              amount: _self.options.amount,
              currencyCode: "KES"
            },
            counterparty: {
              name: "J. Sparrow",
              postalAddress: {
                addressLine1: "Some street",
                addressLine2: "99",
                postCode: "1100 ZZ",
                town: "Amsterdam",
                country: "NL"
              }
            },
            counterpartyAccount: {
              identification: {
                identification: _self.options.to
              }
            },
            remittanceInformation: {
              type: "UNSTRUCTURED",
              content: "SALARY"
            },
            endToEndIdentification: "5e1a3da132cc"
          }
        }

        if (params.to) {
          body.to = params.to
        }
        if (params.amount) {
          body.amount = params.amount
        }

        const url = Common.STANBIC_PAYMENTS_URL

        const headers = {
          Accept: _self.options.format,
          Authorization: authToken
        }

        axios({
          method: 'POST',
          url,
          headers,
          data: new URLSearchParams(body)
        })
          .then(function (response) {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              reject(response.data)
            }
          })
          .catch(function (error) {
            reject(error)
          })
      })
    }
  }

  stanbicPayments(params) {
    const opts = _.cloneDeep(params)

    return this._stanbicPayments(opts)
  }

}

module.exports = StanbicPayments
