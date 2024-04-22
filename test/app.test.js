const request = require('supertest');
const app = require('../app');

describe('Test API endpoints', () => {
  // Test GET /
  it('should return welcome message at /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('welcome to my blog');
  });

  // Test GET /api/v1/users
  it('should return all users', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toEqual(200);
  });

  // Test GET /api/v1/articles
  it('should return all articles', async () => {
    const res = await request(app).get('/api/v1/articles');
    expect(res.status).toEqual(200);
  });


});
