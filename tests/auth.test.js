const request = require("supertest");
const { baseUrl } = require("./utils");

//Auth tests
describe("Authorization tests", () => {
  it("Should create a new authorization token", async () => {
    const response = await request(baseUrl)
      .post("/auth")
      .send({ username: "admin", password: "password123" })
      .expect(200);
    expect(response.body).toHaveProperty("token");
    lastCreatedToken = response.body.token;
  });
});
