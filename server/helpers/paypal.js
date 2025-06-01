const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AW6HX2K1f1xd7RuOvU0vU2ZfbvvTqiDms8Z_72fq8-V9m6bESRBMVp9ZDse2pYBF-iKAUNUREtpuAJ5g",
  client_secret: "EMngAHhE8iMdqyGSXnJy2LAUXMjI8J90PCTmE4mfF-zYnfhv9IBP2Iexm6_NRWjlGjsyNVaxUXHp6PWN",
});

module.exports = paypal;
