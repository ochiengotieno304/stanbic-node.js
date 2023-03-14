const validate = require('validate.js')
const axios = require('axios')
const _ = require('lodash')

const Common = require('./common');
const Token = require('./token')


class MobilePayments {
  constructor(options) {
    this.options = options
    this.token = new Token(options)
  }

  async mobilePayments(params) {
    const validationError = this.validateParams(params)

    if (validationError) {
      throw validationError
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

    try {
      const authToken = await this.token.generateAuthToken()
      const url = Common.MOBILE_PAYMENTS_URL
      const headers = {
        Accept: this.options.format,
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }

      const response = await axios({
        method: 'POST',
        url,
        headers,
        data: body
      })

      if (response.status === 200) {
        return response.data
      } else {
        throw response.data
      }
    } catch (error) {
      throw error
    }

  }

  validateParams(params) {
    const constraints = {
      mobileNumber: {
        presence: true,
        isInteger: true
      },
      amount: {
        presence: true,
        isInteger: true
      }
    }

    const error = validate(params, constraints)
    if (error) {
      let msg = ''
      for (let k in error) {
        msg += error[k] + '; '
      }
      return new Error(msg)
    }
  }
}

module.exports = MobilePayments
