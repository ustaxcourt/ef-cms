import axios from 'axios';

describe('checks the /auth endpoints to verify the cookies are set and cleared correctly', () => {
  let cookie = null;

  it('should get back a token in the header when hitting the login endpoint', async () => {
    const response = await axios.post('http://localhost:4000/auth/login', {
      code: 'petitionsclerk@example.com',
    });
    cookie = response.headers['set-cookie'];
    expect(cookie).toBeDefined();
    expect(response.data.token).toBeDefined();
  });

  it('should be able to hit the refresh endpoint get a new token', async () => {
    const response = await axios.post(
      'http://localhost:4000/auth/refresh',
      null,
      {
        headers: {
          Cookie: cookie,
        },
      },
    );

    expect(response.data.token).toBeDefined();
  });

  it('after hitting DELETE@/auth/login, the refresh endpoint should no longer return a new token', async () => {
    const response = await axios.delete('http://localhost:4000/auth/login');
    expect(response.headers['set-cookie'][0]).toContain(
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT;',
    );
    await expect(
      axios.post('http://localhost:4000/auth/refresh'),
    ).rejects.toThrow('Request failed with status code 400');
  });
});
