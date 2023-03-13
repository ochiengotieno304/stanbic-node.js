const validate = require('validate.js')
const _ = require('lodash')


const StanbicPayments = require('./stanbic-payments')
const STKPush = require('./mpesa-stk')
const MobilePayments = require('./mobile-payments')
const Token = require('./token')


class Stanbic {
  constructor(options) {

    this.options = _.cloneDeep(options);

    validate.validators.isString = function (value, options, key, attributes) {
      return validate.isEmpty(value) || validate.isString(value) ? null : "must be a string"
    }

    validate.validators.isInteger = function (value, options, key, attributes) {
      return validate.isEmpty(value) || validate.isInteger(value) ? null : "must be an integer"
    }

    const constraints = {
      format: {
        inclusion: ['json', 'xml']
      },
      secret: {
        presence: true,
        isString: true
      },
      apiKey: {
        presence: true,
        isString: true
      }
    }

    const error = validate(this.options, constraints)

    if (error) {
      throw error
    }

    switch (this.options.format) {
      case "xml":
        this.options.format = "application/xml";
        break;
      case "json": // Get json by default
      default:
        this.options.format = "application/json";
    }

    this.StanbicPayments = new StanbicPayments(this.options)
    this.STKPush = new STKPush(this.options)
    this.MobilePayments = new MobilePayments(this.options)
    this.Token = new Token(this.options)
  }
}

module.exports = function (options) {
  return new Stanbic(options);
};
