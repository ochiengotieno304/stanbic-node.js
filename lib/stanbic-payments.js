const validate = require('validate.js')
const axios = require('axios')

const _ = require('lodash')

const Common = require('./common');
const Token = require('./token')


class StanbicPayments {
  constructor(options) {

    const _self = this;
    this.options = options

    const token = new Token(options)
      .generateAuthToken()
      .then((authToken) => {
        return authToken.access_token
      }).catch((error) => {
        console.log(error)
      })

    this._stanbicPayments = function (params) {
      let validationError

      // validate params
      const _validateParams = function () {
        const constraints = {
          identification: {
            presence: true,
            isString: true
          },
          amount: {
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
          return reject(validationError)
        }

        const todayDate = new Date().toISOString().slice(0, 10);

        const body = JSON.stringify({
          originatorAccount: {
            identification: {
              mobileNumber: "0777287562"
            }
          },
          requestedExecutionDate: todayDate,
          dbsReferenceId: "1234567890",
          txnNarrative: "TRANSACTION NARRATIVE",
          callBackUrl: "http://clientdomain.com/omnichannel/esbCallback",
          transferTransactionInformation: {
            instructedAmount: {
              amount: params.amount,
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
                identification: params.identification
              }
            },
            remittanceInformation: {
              type: "UNSTRUCTURED",
              content: "SALARY"
            },
            endToEndIdentification: "5e1a3da132cc"
          }
        })

        const tkn = ""

        const url = Common.STANBIC_PAYMENTS_URL
        const authToken = `Bearer ${tkn}`

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
