const mobilpay = require("mobilpay-node");
var constants = mobilpay.constants;
const path = require("path");
const openssl = require("openssl-nodejs");

const MobilPay = new mobilpay.Mobilpay({
  signature: "asdjflkjaslkdfasjdflkjsad",
  sandbox: true,
  publicKeyFile: path.join(__dirname, "./PUBLIC_CERTIFICATE.cer"),
  privateKey: "sdfgsdfgsdftgtsdfgdsfgb",
  serviceType: 1,
});

async function payBill(req, res, next) {
  var paymentRequest = MobilPay.createRequest({
    amount: 100,
    customerId: "12345",
    billingAddress: {
      type: constants.ADDRESS_TYPE_PERSON,
      firstName: "Damian",
      lastName: "Gardner",
      email: "damian.gardner@inbound.plus",
      address: "4793 College Street, Cluj-Napoca, Cluj",
      mobilePhone: "0722222222",
    },
    shippingAddress: {
      type: constants.ADDRESS_TYPE_PERSON,
      firstName: "Damian",
      lastName: "Gardner",
      email: "damian.gardner@inbound.plus",
      address: "4793 College Street, Cluj-Napoca, Cluj",
      mobilePhone: "0722222222",
    },
    confirmUrl: "http://mysite.local/confirm",
    returnUrl: "http://mysite.local/return",
    params: {
      test1: "test param 1",
      test2: "test param 2",
    },
  });
  MobilPay.prepareRedirectData(paymentRequest)
    .then(function (result) {
      res.status(200).json("successfull");
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).json(err);
    });
}

module.exports = { payBill };
