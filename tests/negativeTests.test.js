const request = require("supertest");
const { baseUrl } = require("./utils");


describe('Negative tests', () => {
  it('Should return 404 on invalid id parameter', async() => {
    await request(baseUrl)
    .get('/invalidUrl')
    .expect(404)
  })
  it('Should return 403 on attempt to update a booking without authorization', async() => {
    await request(baseUrl)
    .put('/booking/1')
    .expect(403)
  })
  it('Should return 403 on attempt to delete a booking without authorization', async() => {
    await request(baseUrl)
    .delete('/booking/1')
    .expect(403)
  })
})