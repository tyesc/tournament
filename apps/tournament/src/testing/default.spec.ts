import {app} from '../app'
import * as request from "supertest"

describe('Test default route', () => {
  it('should be successful', async () => {
    const {body, status} = await request(app).get("/api");
    expect(status).toBe(200);
    expect(body.message).toEqual("Welcome to tournament!");
  })
})
