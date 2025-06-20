const request = require("supertest");
const baseUrl = "https://restful-booker.herokuapp.com";

let lastCreatedToken = "";

async function getAuthToken() {
  const res = await request(baseUrl)
    .post("/auth")
    .send({ username: "admin", password: "password123" });

  lastCreatedToken = res.body.token;
  return lastCreatedToken;
}

async function createTestBooking(payload) {
  const res = await request(baseUrl)
    .post("/booking")
    .set("Accept", "application/json")
    .send(payload);

  return {
    bookingid: res.body.bookingid,
    booking: res.body.booking
  };
}

async function deleteBookingById(id) {
  await request(baseUrl)
    .delete(`/booking/${id}`)
    .set("Cookie", `token=${lastCreatedToken}`)
    .expect(201);
}

module.exports = {
  getAuthToken,
  createTestBooking,
  deleteBookingById,
  baseUrl,
};
