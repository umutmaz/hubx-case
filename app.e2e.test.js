import request from 'supertest'
import app from './app'

describe('Server initialization', () => {

    test('should return pong', (done) => {
        request(app).get("/ping").then(({ body }) => {
            expect(body).toEqual({ message: "pong" })

        })
        done()
    })

})