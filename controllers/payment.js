const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require('stripe')(keySecret);
exports.sendPayment = (req, res) => {
    // Handle stripe api payment
}
exports.info = (req, res ) => {

    if(req.params.plan !== undefined) {

    }
    res.render('payment/plus');
}
exports.payment = (req, res ) => {
    let amount = 5000;
    console.log(req.body);
    stripe.customers.create({
       email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Sample Charge",
           currency: "usd",
           customer: customer.id
      }))
    .then(charge => res.render("charge.pug"));
}