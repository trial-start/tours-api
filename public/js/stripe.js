/* eslint-disable */
// const axios = require('axios');
// const { showAlert } = require('./alerts');
import { showAlert } from './alerts';
import axios from 'axios';

export const bookTour = async tourId => {
  const stripe = Stripe(
    'pk_test_51OkW6JSGKHW8bmEAyBuo4KbK4KUwISRp1XSTeETuFwm16m8jkfjepBx6p2DMfFq6nN0jYWTmTBOXLLhRSshvUnLh00PDGooGTP'
  );
  try {
    //1)Get session from the server
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    //2)Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

// const axios = require('axios');
// const { showAlert } = require('./alerts');
// const stripe = require('stripe');
// module.exports = async function bookTour(tourId) {
//   try {
//     //1)Get session from the server
//     const session = await axios(
//       `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
//     );
//     //2)Create checkout form + charge credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id
//     });
//   } catch (err) {
//     showAlert('error', err);
//   }
// };
