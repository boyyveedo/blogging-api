const request = require('supertest');
const app = require('../app'); 
const User = require('../model/User');

describe('User Controller', () => {
  // Clear the users collection before each test
  beforeEach(async () => {
    await User.deleteMany();
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a new user', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData)
        .expect(200); 

      expect(res.body.status).toBe('Success');
      expect(res.body.data).toBe('User registered');
    });
  });


  

});



