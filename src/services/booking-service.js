//  --> shiva <--
const axios = require('axios');
const { BookingRepository } = require('../repository/index')

const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig')
const { ServiceError } = require('../utils/errors');

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }
    
    async createBooking(data){
        try{
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient Seats')
            } 

            const totalCost = priceOfTheFlight * data.noOfSeats;
            // we have checked for the seats and we have total cost now 
            // we will make booking

            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            
            // when booking is done then technically we need to update the flightdata
            // remaining seats and so we go in flight service and write update function there as till now we dont have update function in the flight service
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {totalSeats : flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status : "Booked"});
            return finalBooking;
            // const response = await axios.get(getFlightRequestURL);
            // console.log(response.data.data); 
            // return response.data.data;
        } catch(error){
            if(error.name == 'RepositoryError' || error.name =='ValidationError'){
                throw error
            }
            throw new ServiceError();
        }
    }
}
module.exports = BookingService;


/*
  shivakumar0707@gmail.com
*/
