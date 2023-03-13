const validate = require('validate.js')
const axios = require('axios')
const _ = require('lodash')

const Common = require('./common');
const Token = require('./token')

class InterBankTransfers {
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


    this._interBankTransfers = function (params) {
      let validationError

      // validate params
      const _validateParams = function () {
        const constraints = {
          amount: {
            presence: true,
            isString: true
          },
          recipientAccountNo: {
            presence: true,
            isString: true
          }
        }

        const error = validate(params, constraints)
        if (error) {
          let msg = ''
          for (let k in error) {
            msg += error[k] + '; '
          }
          validationError = new Error(msg)
        }
      }

      _validateParams()
      return new Promise(function (resolve, reject) {
        if (validationError) {
          return reject(validationError)
        }

        const todayDate = new Date().toISOString().slice(0, 10)

        const body = JSON.stringify({
          originatorAccount: {
            identification: {
              mobileNumber: "254737696956"
            }
          },
          requestedExecutionDate: todayDate,
          sendMoneyTo: "MOBILE.NUMBER",
          dbsReferenceId: "98989271771176942", // TODO: Generate Dynamically
          txnNarrative: "TESTPESALINK",
          callBackUrl: "https://clientdomain.com/client/Callback",
          transferTransactionInformation: {
            instructedAmount: {
              amount: params.amount,
              currencyCode: "KES"
            },
            counterpartyAccount: {
              identification: {
                recipientMobileNo: "25472XXXXXXXX",
                recipientBankAcctNo: params.recipientAccountNo,
                recipientBankCode: "07000"
              }
            },
            counterparty: {
              name: "HEZBON",
              postalAddress: {
                addressLine: "KENYA",
                postCode: "1100 ZZ",
                town: "Nairobi",
                country: "KE"
              }
            },
            remittanceInformation: {
              type: "FEES PAYMENTS",
              content: "SALARY"
            },
            endToEndIdentification: "5e1a3da132cc" // TODO: Generate Dynamically
          }
        })

        // const tkn = ""

        const url = Common.PESALINK_PAYMENTS_URL
        const authToken = `Bearer ${token}`

        const headers = {
          Accept: _self.options.format,
          Authorization: authToken,
          'Content-Type': 'application/json'
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

  interBankTransfers(params) {
    const opts = _.cloneDeep(params)
    return this._interBankTransfers(opts)
  }
}

module.exports = InterBankTransfers
