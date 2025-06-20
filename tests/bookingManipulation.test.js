const request = require("supertest");
const {
  baseUrl,
  getAuthToken,
  createTestBooking,
  deleteBookingById
} = require("./utils");

let lastCreatedToken
let lastCreatedBookingId

let testData = {
  firstname: "Jim",
  lastname: "Brown",
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: "2018-01-01",
    checkout: "2019-01-01",
  },
  additionalneeds: "Breakfast",
};

describe("Booking manipulation tests", () => {
  beforeAll(async () => {
    lastCreatedToken = await getAuthToken();
});
  
  // Clean up in case something goes wrong
  afterAll(async () => {
  if (lastCreatedBookingId) {
    await request(baseUrl)
      .delete(`/booking/${lastCreatedBookingId}`)
      .set("Cookie", `token=${lastCreatedToken}`)
      .set("Authorization", `Bearer ${lastCreatedToken}`);
  }
});

  it("Should create a new booking", async () => {

    const response = await request(baseUrl)
      .post("/booking")
      .set('Accept', 'application/json')
      .send(testData)
      .expect(200);
    
    expect(response.body).toEqual({
      bookingid: expect.any(Number),
      booking: {
        firstname: expect.any(String),
        lastname: expect.any(String),
        totalprice: expect.any(Number),
        depositpaid: expect.any(Boolean),
        bookingdates: {
          checkin: expect.any(String),
          checkout: expect.any(String),
        },
        additionalneeds: expect.any(String),
      },
    });

    expect(response.body.booking.firstname).toBe(testData.firstname)
    expect(response.body.booking.lastname).toBe(testData.lastname)
    expect(response.body.booking.totalprice).toBe(testData.totalprice)

    lastCreatedBookingId = response.body.bookingid

  });
  it('Should update a booking', async () => {

    const testData = {
      firstname: "James",
      lastname: "Pink",
      totalprice: 999,
      depositpaid: true,
      bookingdates: {
        checkin: "2023-01-01",
        checkout: "2025-01-01",
      },
      additionalneeds: "Supper",
    };

    const response = await request(baseUrl)
    .put(`/booking/${lastCreatedBookingId}`)
    .set('Accept', 'application/json')
    .set('Cookie', `token=${lastCreatedToken}`)
    .set('Authorization', `Bearer ${lastCreatedToken}`)
    .send(testData)
    .expect(200)

    expect(response.body).toEqual(testData)

  })
  it('Should partially update a booking', async() => {

    const testPayload = {
      firstname: 'Dave',
      lastname: 'Gahan'
    }
    const response = await request(baseUrl)
    .patch(`/booking/${lastCreatedBookingId}`)
    .set('Cookie', `token=${lastCreatedToken}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${lastCreatedToken}`)
    .send(testPayload)
    .expect(200)

    expect(response.body.firstname).toBe(testPayload.firstname)
    expect(response.body.lastname).toBe(testPayload.lastname)
  })
  it('Should delete a booking by id', async() => {
    await request(baseUrl)
    .delete(`/booking/${lastCreatedBookingId}`)
    .set('Cookie', `token=${lastCreatedToken}`)
    .set('Authorization', `Bearer ${lastCreatedToken}`)
    .expect(201)
  })
});
