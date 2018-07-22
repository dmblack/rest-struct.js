/* global describe expect it */
const app = require('./../app.js');

const request = require('supertest');

describe('Test the root path', () => {
  it('It should response the GET method', () => {
    return request(app).get('/api/1').then(response => {
      expect(response.statusCode).toBe(200);
    });
  });

  it('Should accept a post', () => {
    return request(app).put('/api/').send().set({ 'content-type': 'application/json' }).then(response => {
      expect(response.statusCode).toBe(200);
    });
  });

  it('Should accept a post, with initial state', () => {
    return request(app).put('/api/').send({ '/TestSchema': { 'string': 'static' } }).set({ 'content-type': 'application/json' }).then(response => {
      expect(response.statusCode).toBe(200);
    });
  });

  it('Should accept a post, with initial state, and actually contain that state', () => {
    const testPost = {
      '/TestSchema': {
        'string': 'static'
      }
    };
    return request(app).put('/api/').send(testPost).set({ 'content-type': 'application/json' }).then(response => {
      expect(response.statusCode).toBe(200);
      expect(typeof response.body).toEqual('object');
      expect(response.body['/TestSchema'].string).toEqual('static');
    });
  });
});
