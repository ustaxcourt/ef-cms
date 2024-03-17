import axios from 'axios';

describe('checks the /auth endpoints to verify the cookies are cleared correctly', () => {
  it('after hitting DELETE@/auth/login, the refresh endpoint should no longer return a new token', async () => {
    const response = await axios.delete('http://localhost:4000/auth/login');
    expect(response.headers['set-cookie'][0]).toContain(
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT;',
    );
    await expect(
      axios.post('http://localhost:4000/auth/refresh'),
    ).rejects.toThrow('Request failed with status code 403');
  });
});
