const validate = require('validate.js')
const axios = require('axios')

const Common = require('./common');
const Token = require('./token')

class InterBankTransfers {
  constructor(options) {
    this.options = options
    this.token = new Token(options)
  }

  async interBankTransfers(params) {
    const validationError = this.validateParams(params)

    if (validationError) {
      throw validationError
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

    try {
      const authToken = await this.token.generateAuthToken()
      const url = Common.PESALINK_PAYMENTS_URL
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
      recipientAccountNo: {
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

module.exports = InterBankTransfers
