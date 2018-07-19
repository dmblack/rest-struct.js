/* global describe expect it */
const app = require('./../app.js');

const request = require('supertest');

describe('Test the root path', () => {
  it('It should response the GET method', () => {
    return request(app).get('/api/1').then(response => {
      expect(response.statusCode).toBe(200);
    });
  });
});
