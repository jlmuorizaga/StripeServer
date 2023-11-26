const express=require('express');
const dotenv=require('dotenv');
const stripe=require('stripe');
const cors = require('cors');
//import express from "express";
//import dotenv from "dotenv";
//import stripe from "stripe";

// Load variables
dotenv.config();

// Start Server
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// Home Route
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
// Success
app.get("/success", (req, res) => {
  res.sendFile("success.html", { root: "public" });
});
// Cancel
app.get("/cancel", (req, res) => {
  res.sendFile("cancel.html", { root: "public" });
});
// Stripe
//let stripeGateway = stripe(process.env.stripe_api);
//let sucursal=window.localStorage.getItem('sucursal');
//let stripeGateway = stripe('sk_test_51LSBydIjGNO1QnMz4u33zcYR4KGC6zO9x5XvjMd2DksvDMG0JFlY3p3BiYmNnGzpL0AwanqYg9tupyzcWFSIzrbP00AcbupLT4');
//let stripeGateway = 'sk_test_51LSBydIjGNO1QnMz4u33zcYR4KGC6zO9x5XvjMd2DksvDMG0JFlY3p3BiYmNnGzpL0AwanqYg9tupyzcWFSIzrbP00AcbupLT4';
let DOMAIN = "http://localhost:3000";
//process.env.DOMAIN;

app.post("/stripe-checkout", async (req, res) => {
  console.log(req.body);
//  const objeto=JSON.parse(req.body);
  const sucursal=req.body.sucursal;
//  console.log(sucursal);
  //alert(sucursal);
  // let sucursal=req.params.sucursal;
  //alert(sucursal);
  //let sucursal=window.localStorage.getItem(sucursal);
  //console.log('Sucursal='+sucursal1);
  let stripeGateway;
  if (sucursal==='01VIA'){
     //stripeGateway = stripe('sk_test_51LSBydIjGNO1QnMz4u33zcYR4KGC6zO9x5XvjMd2DksvDMG0JFlY3p3BiYmNnGzpL0AwanqYg9tupyzcWFSIzrbP00AcbupLT4');
     stripeGateway = stripe('sk_test_51NtbqUGiYQWlTFKFdQELcj0lfgqvOuLJO2LPwjiBQQtwQMu9J3XgiVDFZvZHeuZeMgOFJBVVIgifohkuEbJkqkEW00yKVwlbAM');
  }else{
    stripeGateway = stripe('sk_test_51LSBydIjGNO1QnMz4u33zcYR4KGC6zO9x5XvjMd2DksvDMG0JFlY3p3BiYmNnGzpL0AwanqYg9tupyzcWFSIzrbP00AcbupLT4');
    //stripeGateway = stripe('sk_test_51NtbqUGiYQWlTFKFdQELcj0lfgqvOuLJO2LPwjiBQQtwQMu9J3XgiVDFZvZHeuZeMgOFJBVVIgifohkuEbJkqkEW00yKVwlbAM');

  }
  //alert(sucursal);
  //console.log('Sucursal='+sucursal);
  const lineItems = req.body.items.map((item) => {
    const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
    console.log("item-price:", item.price);
    console.log("unitAmount:", unitAmount);
    //console.log('Sucursal='+sucursal);
    return {
      price_data: {
        currency: "mxn",
        product_data: {
          name: item.title,
          //images: [item.productImg],
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    };
  });
  console.log("lineItems:", lineItems);

  //   Create Checkout Session
  const session = await stripeGateway.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${DOMAIN}/success`,
    cancel_url: `${DOMAIN}/cancel`,
    line_items: lineItems,
    // Asking Address In Stripe Checkout Page
    billing_address_collection: "required",
  });
  res.json(session.url);
});

app.listen(3000, () => {
  console.log("listening on port 3000;");
});
