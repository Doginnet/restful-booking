const request = require("supertest");
const {
  baseUrl,
  getAuthToken,
  createTestBooking,
  deleteBookingById
} = require("./utils");

let testBookingId = null;
let bookingData = null;

beforeAll(async () => {
  await getAuthToken();

  const testPayload = {
    firstname: "Morticia",
    lastname: "Addams",
    totalprice: 666,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-10-13",
      checkout: "2024-10-31",
    },
    additionalneeds: "Candlelight dinner",
  };

  const { bookingid, booking } = await createTestBooking(testPayload);
  testBookingId = bookingid;
  bookingData = booking;
});

afterAll(async () => {
  await deleteBookingById(testBookingId);
});

describe("GET /booking tests", () => {
  it("should return a list of bookings", async () => {
    const response = await request(baseUrl).get("/booking").expect(200);
    const data = response.body
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    //Asserting that all the items have an ID property
    for (const item of data) {
      expect(item).toHaveProperty("bookingid");
      expect(typeof item.bookingid).toBe("number");
    }

    //Asserting all the IDs are unique
    const bookingIds = data.map((item) => item.bookingid);
    const uniqueIds = [...new Set(bookingIds)];
    expect(bookingIds.length).toEqual(uniqueIds.length);

    //Asserting that IDs are positive numbers
    for (const id of bookingIds) {
      expect(id).toBeGreaterThan(0);
      expect(Number.isInteger(id)).toBeTruthy();
    }
  });

  it("should return booking by ID", async () => {
    const response = await request(baseUrl)
      .get(`/booking/${testBookingId}`)
      .set("Accept", "application/json")
      .expect(200);

    for (key in bookingData){
        expect(response.body).toHaveProperty(key)
        expect(response.body[key]).toEqual(bookingData[key])
    }
    // expect(response.body.firstname).toBe(bookingData.firstname);
    // expect(response.body.lastname).toBe(bookingData.lastname);
  });

  it.each([
    ["by name", (data) => `/booking?firstname=${data.firstname}&lastname=${data.lastname}`],
    ["by date", (data) => `/booking?checkin=${data.bookingdates.checkin}&checkout=${data.bookingdates.checkout}`]
  ])("should search %s", async (_, makeUrl) => {
    const url = makeUrl(bookingData);
    const response = await request(baseUrl).get(url).expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length) {
      expect(response.body[0]).toHaveProperty("bookingid");
    }
  });
});
