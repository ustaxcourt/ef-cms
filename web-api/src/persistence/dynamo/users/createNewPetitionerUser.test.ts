import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createNewPetitionerUser } from './createNewPetitionerUser';

const originalEnvironment = process.env;

describe('createNewPetitionerUser', () => {
  const mockEmail = 'petitioner@example.com';
  const mockName = 'Bob Ross';
  const mockUserId = 'e6df170d-bc7d-428b-b0f2-decb3f9b83a8';
  const mockUser = {
    name: 'Bob Ross',
    pendingEmail: 'petitioner@example.com',
    role: ROLES.petitioner,
    section: 'petitioner',
    userId: mockUserId,
  };

  afterEach(() => {
    process.env = originalEnvironment;
  });

  it('should call adminCreateUser with the user email, name, and userId', async () => {
    await createNewPetitionerUser({
      applicationContext,
      user: {
        name: mockName,
        pendingEmail: mockEmail,
        role: ROLES.petitioner,
        section: 'petitioner',
        userId: mockUserId,
      } as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0],
    ).toMatchObject({
      UserAttributes: expect.arrayContaining([
        {
          Name: 'email',
          Value: mockEmail,
        },
        {
          Name: 'name',
          Value: mockName,
        },
        {
          Name: 'custom:userId',
          Value: mockUserId,
        },
      ]),
      Username: mockEmail,
    });
  });

  it('should call client.put with the petitioner user record', async () => {
    await createNewPetitionerUser({
      applicationContext,
      user: mockUser as any,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
    ).toMatchObject({
      ...mockUser,
      pk: `user|${mockUserId}`,
      sk: `user|${mockUserId}`,
      userId: mockUserId,
    });
  });

  it('should NOT add TemporaryPassword attribute if environment is prod', async () => {
    process.env.STAGE = 'prod';
    await createNewPetitionerUser({
      applicationContext,
      user: mockUser as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0]
        .TemporaryPassword,
    ).toBe(undefined);
  });

  it('should add TemporaryPassword attribute if environment is not prod', async () => {
    process.env.STAGE = 'not prod';
    await createNewPetitionerUser({
      applicationContext,
      user: mockUser as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0]
        .TemporaryPassword,
    ).toBe(process.env.DEFAULT_ACCOUNT_PASS);
  });
});
