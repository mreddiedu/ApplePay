const express = require('express');
const router = express.Router();
const braintree = require('braintree');

router.post('/', (req, res, next) => {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: 'mzwf7bv4zc2bjccb',
    publicKey: 'kc2qfb4zt7g86s57',
    privateKey: '9632cee15f46df181b4042f743682f18'
  });

  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const deviceDataFromTheClient = req.body.deviceData;
  const postalCodeFromTheClient = req.body.postalCode;
  
  // Create a new transaction for $10
  const newTransaction = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
    deviceData: deviceDataFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    },
    billing: {
        postalCode: postalCodeFromTheClient
    }
  }, (error, result) => {
      if (result) {
        console.log(JSON.stringify(result, null, 4));
        res.send(result);
      } else {
        console.log(error);
        res.status(500).send(error);
      }
  });
});

module.exports = router;