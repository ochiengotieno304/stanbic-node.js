# Stanbic Node.js SDK

Stanbic Kilele Payments API Node.js SDK

## Installation

Install the package from npm ny running:

    npm install --save stanbic

## Usage

The package needs to be configured with your app's secret and client_id from the dashboard.

### Initialization

```js
  const credentials = {
    secret: "YOUR_SECRET_ID",
    apiKey: "YOUR_CLIENT_ID"
  }

  const Stanbic = require('stanbic')(credentials)

  const snbToSnb = Stanbic.StanbicPayments

  const options = {
    identification: "8488........171",
    amount: "20"
  }

  snbToSnb.stanbicPayments(options)
    .then((response) => {
      console.log(response)
    }).catch((err) => {
      console.log(err)
    })
```

### Services

Make service requests using the `Stanbic` instance
> *Note:*
>
> - All methods are asynchronous
> - All phone number params are in the international format phone number 254712345678

### Payments to Stanbic Accounts

```js
  const snbToSnb = Stanbic.StanbicPayments

  const options = {
    identification: "ACCOUNT.NUMBER",
    amount: "AMOUNT"
  }

  snbToSnb.stanbicPayments(options)
```

- `identification`: stanbic recipient account number`REQUIRED`, `STRING`
- `amount`: amount to transact `REQUIRED`, `STRING`

### Stanbic to Mobile Payments

```js
  const mobilePayments = Stanbic.MobilePayments

  const options = {
    mobileNumber: MOBILE.NUMBER,
    amount: AMOUNT
  }

  mobilePayments.mobilePayments(options)
```

- `mobileNumber`: recipient mobile number`REQUIRED`, `INTEGER`
- `amount`: amount to transact `REQUIRED`, `INTEGER`

### STK Push - M-Pesa Checkout

```js
  const mpesa = Stanbic.STKPush

  const options = {
    billAccountRef: "ACCOUNT.NUMBER",
    amount: "AMOUNT",
    mobileNumber: "MOBILE.NUMBER"
  }

  mpesa.stkPush(options)
```

- `billAccountRef`: Stanbic account receiving the funds`REQUIRED`, `STRING`
- `amount`: amount being deducted from M-Pesa account `REQUIRED`, `STRING`
- `mobileNumber`: M-Pesa account being charged `REQUIRED`, `STRING`

### Inter-Bank Transfers API via Pesalink

> *Note:*
> *Implementing*

```js
  const pesalinkPayments = Stanbic.InterBankTransfers

  const options = {
    recipientAccountNo: "ACCOUNT.NUMBER",
    amount: "AMOUNT"
  }

  pesalinkPayments.interBankTransfers(options)
```

- `recipientAccountNo`: Recipient's account number `REQUIRED`, `STRING`
- `amount`: amount to transact `REQUIRED`, `STRING`

## Development

## Contributing

Bug reports and pull requests are welcome on GitHub at <https://github.com/ochiengotieno304/stanbic-node.js>.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
