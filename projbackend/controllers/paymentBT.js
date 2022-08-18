const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId:   '2xf4n7whx97m9cgw',
  publicKey:    'j5crhg2my2zhd9xv',
  privateKey:   '63c51b765089b4574f4ed37e2d033344'
});

exports.getToken = (req,res) => {
    gateway.clientToken.generate({}, (err, response) => {
        if(err){
            // res.status(500).json(err); There are bugs due to .json() => use send
            res.status(500).json(err);
        }
        else{
            // pass clientToken to your front-end
            // const clientToken = response.clientToken
            res.json(response);
        }
    });
}

exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        
        options: {
          submitForSettlement: true
        }
      },
      (err, result) => {
          if(err){
              res.status(500).json(err);
          }
          else{
              res.json(result);
          }
      });
}