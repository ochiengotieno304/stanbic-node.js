const validate = require('validate.js')
const axios = require('axios')

const Common = require('./common');
const Token = require('./token')

class STKPush {
  constructor(options) {
    this.options = options
    this.token = new Token(options)
  }

  async stkPush(params) {
    const validationError = this.validateParams(params)


    if (validationError) {
      throw validationError
    }

    const body = JSON.stringify({
      "dbsReferenceId": "REW21331DR5F1", //TODO: Generate Dynamically
      "billAccountRef": params.billAccountRef,
      "amount": params.amount,
      "mobileNumber": params.mobileNumber
    })

    try {
      const authToken = await this.token.generateAuthToken()
      const url = Common.MPESA_CHECKOUT_URL
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
      let msg = ''
      for (let k in error) {
        msg += error[k] + '; '
      }
      return new Error(msg)
    }
  }
}

module.exports = STKPush
