import { applicationContext } from '../../test/createTestApplicationContext';
import { createUserCognitoInteractor } from './createUserCognitoInteractor';

describe('createUserCognitoInteractor', () => {
  const email = 'example@example.com';
  const name = 'Antoninus Sara';
  const userId = 'abc123';
  const password = 'Pa$$word!';
  const user = { email, name, password };

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

    const result = await createUserCognitoInteractor(applicationContext, {
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
      createUserCognitoInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow();

    expect(applicationContext.getCognito().signUp).toHaveBeenCalled();
  });

  it('should return an error if email already exists in system', async () => {
    applicationContext.getCognito().listUsers.mockReturnValueOnce({
      promise: () => {
        {
          [
            {
              Attributes: [],
              Enabled: true,
              UserCreateDate: '2023-10-27T15:18:37.000Z',
              UserLastModifiedDate: '2023-10-27T15:18:37.000Z',
              Username: email,
            },
          ];
        }
      },
    });
    listUserResults.Users.push({ User: {} });

    await expect(
      createUserCognitoInteractor(applicationContext, {
        user,
      }),
    ).rejects.toThrow();

    expect(applicationContext.getCognito().signUp).not.toHaveBeenCalled();
  });
});
