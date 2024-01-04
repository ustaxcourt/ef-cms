import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { signUpUserInteractor } from './signUpUserInteractor';

describe('signUpUserInteractor', () => {
  const email = 'example@example.com';
  const name = 'Antoninus Sara';
  const userId = 'abc123';
  const password = 'Pa$$w0rd!';
  const user = { confirmPassword: password, email, name, password };

  // cognito returns an empty 200 on success
  const confirmSignUpResult = {};
  const listUserResults: { Users: any[] } = { Users: [] };
  beforeAll(() => {
    applicationContext.getCognito().signUp.mockReturnValue({
      promise: () => confirmSignUpResult,
    });
    applicationContext.getUniqueId.mockReturnValue(userId);

    applicationContext.getCognito().listUsers.mockReturnValue({
      promise: () => listUserResults,
    });
  });

  it('should call cognito signUp with correctly formatted parameters and return the result', async () => {
    const expectedParams = {
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: name,
        },
      ],
      Username: email,
    };

    const result = await signUpUserInteractor(applicationContext, {
      user,
    });

    expect(
      applicationContext.getCognito().signUp.mock.calls[0][0],
    ).toMatchObject(expectedParams);

    expect(result).toEqual({});
  });

  it('should return an error if signUp fails', async () => {
    applicationContext.getCognito().signUp.mockReturnValueOnce({
      promise: () => {
        throw new Error();
      },
    });

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow();

    expect(applicationContext.getCognito().signUp).toHaveBeenCalled();
  });

  it('should return an error if entity validation fails', async () => {
    await expect(
      signUpUserInteractor(applicationContext, {
        user: {
          confirmPassword: password,
          email,
          name,
          password: 'password',
        },
      }),
    ).rejects.toThrow();

    expect(applicationContext.getCognito().signUp).not.toHaveBeenCalled();
  });

  it('should return an error if email already exists in system and it is confirmed', async () => {
    applicationContext.getCognito().listUsers.mockReturnValueOnce({
      promise: () => {
        return {
          Users: [
            {
              Attributes: [],
              Enabled: true,
              UserCreateDate: '2023-10-27T15:18:37.000Z',
              UserLastModifiedDate: '2023-10-27T15:18:37.000Z',
              UserStatus: 'CONFIRMED',
              Username: email,
            },
          ],
        };
      },
    });

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow('User already exists');

    expect(applicationContext.getCognito().signUp).not.toHaveBeenCalled();
  });

  it('should return an error if email already exists in system and it is "UNCONFIRMED"', async () => {
    applicationContext.getCognito().listUsers.mockReturnValueOnce({
      promise: () => {
        return {
          Users: [
            {
              Attributes: [],
              Enabled: true,
              UserCreateDate: '2023-10-27T15:18:37.000Z',
              UserLastModifiedDate: '2023-10-27T15:18:37.000Z',
              UserStatus: 'UNCONFIRMED',
              Username: email,
            },
          ],
        };
      },
    });

    await expect(
      signUpUserInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow('User exists, email unconfirmed');

    expect(applicationContext.getCognito().signUp).not.toHaveBeenCalled();
  });
});
