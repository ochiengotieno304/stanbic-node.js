const axios = require('axios')
const validate = require('validate.js')

const Common = require('./common')
const Token = require('./token')

class StanbicPayments {
  constructor(options) {
    this.options = options
    this.token = new Token(options)
  }

  async stanbicPayments(params) {
    const validationError = this.validateParams(params)

    if (validationError) {
      throw validationError
    }

    const todayDate = new Date().toISOString().slice(0, 10)
    const body = JSON.stringify({
      originatorAccount: {
        identification: {
          mobileNumber: "25472000000"
        }
      },
      requestedExecutionDate: todayDate,
      dbsReferenceId: "1234567890", // TODO Generate Dynamically
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
        endToEndIdentification: "5e1a3da132cc" // TODO: Generate Dynamically
      }
    })

    try {
      const authToken = await this.token.generateAuthToken()
      const url = Common.STANBIC_PAYMENTS_URL
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
      let msg = ''
      for (let k in error) {
        msg += error[k] + '; '
      }
      return new Error(msg)
    }
  }
}

module.exports = StanbicPayments
