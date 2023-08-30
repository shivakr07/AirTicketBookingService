const express = require("express");

const  {BookingController}  = require('../../controllers/index')
const { createChannel } = require('../../utils/messageQueue')

// const channel = await createChannel();
// how to use await here because there is no async so later we will see  this

const bookingController = new BookingController();

const router = express.Router();

router.post('/bookings', bookingController.create);
router.post('/publish', bookingController.sendMessageToQueue);

module.exports = router;