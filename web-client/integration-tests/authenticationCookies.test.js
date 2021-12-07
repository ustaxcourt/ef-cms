import axios from 'axios';

describe('checks the /auth endpoints to verify the cookies are set and cleared correctly', () => {
  it('should get back a token in the header when hitting the login endpoint', async () => {
    const response = await axios.post(
      'http://localhost:4000/auth/login',
      {
        code: 'abc',
      },
      {
        withCredentials: true,
      },
    );
    expect(response.data).toEqual({
      token: 'DogCow',
    });
  });

  it('should be able to hit the refresh endpoint get a new token', async () => {
    const response = await axios.post(
      'http://localhost:4000/auth/refresh',
      null,
      {
        withCredentials: true,
      },
    );

    expect(response.data).toEqual({
      token: 'A-different-DogCow',
    });
  });

  it('after hitting DELETE@/auth/login, the refresh endpoint should no longer return a new token', async () => {
    // await axios.delete('http://localhost:4000/auth/login', {
    //   withCredentials: true,
    // });

    await expect(
      axios.post('http://localhost:4000/auth/refresh', null, {
        withCredentials: true,
      }),
    ).rejects.toThrow('Request failed with status code 400');
  });
});
