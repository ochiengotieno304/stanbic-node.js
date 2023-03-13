const validate = require('validate.js')
const axios = require('axios')
const _ = require('lodash')

const Common = require('./common');
const Token = require('./token')


class MobilePayments {
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

    this._mobilePayments = function (params) {
      let validationError

      // validate params
      const _validateParams = function () {
        const constraints = {
          amount: {
            presence: true,
            isInteger: true
          },
          mobileNumber: {
            presence: true
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

        const body = JSON.stringify(
          {
            originatorAccount: {
              identification: {
                mobileNumber: 25472000000
              }
            },
            requestedExecutionDate: todayDate,
            dbsReferenceId: "21899424091958", // TODO: Generate Dynamically
            txnNarrative: "TRANSACTION NARRATIVE",
            callBackUrl: "http://client_domain.com/omnichannel/esbCallback",
            transferTransactionInformation: {
              instructedAmount: {
                amount: params.amount,
                currencyCode: "KES"
              },
              mobileMoneyMno: {
                name: "T-KASH"
              },
              counterparty: {
                name: "J. Sparrow",
                mobileNumber: params.mobileNumber,
                postalAddress: {
                  addressLine1: "Some street",
                  addressLine2: "99",
                  postCode: "1100 ZZ",
                  town: "Amsterdam",
                  country: "NL"
                }
              },
              remittanceInformation: {
                type: "UNSTRUCTURED",
                content: "SALARY"
              },
              endToEndIdentification: "5e1a3da132cc" // TODO: Generate Dynamically
            }
          })

        // const tkn = ""

        const url = Common.MOBILE_PAYMENTS_URL
        const authToken = `Bearer ${token}`

        const headers = {
          Accept: _self.options.format,
          Authorization: authToken,
          'Content-TYpe': 'application/json'
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

  mobilePayments(params) {
    const opts = _.cloneDeep(params)
    return this._mobilePayments(opts)
  }
}

module.exports = MobilePayments
