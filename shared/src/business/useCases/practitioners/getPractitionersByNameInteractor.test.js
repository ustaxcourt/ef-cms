const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getPractitionersByNameInteractor,
} = require('./getPractitionersByNameInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('getPractitionersByNameInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      getPractitionersByNameInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized for searching practitioners');
  });

  it('throws an error if name is not passed in', async () => {
    await expect(
      getPractitionersByNameInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Name must be provided to search');
  });

  it('calls search function with correct params and returns records for a name search', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionersByName.mockReturnValue([
        {
          barNumber: 'PT1234',
          name: 'Test Practitioner1',
          role: ROLES.irsPractitioner,
          userId: '8190d648-e643-4964-988e-141e4e0db861',
        },
        {
          barNumber: 'PT5432',
          name: 'Test Practitioner2',
          role: ROLES.privatePractitioner,
          userId: '12d5bb3a-e867-4066-bda5-2f178a76191f',
        },
      ]);

    const results = await getPractitionersByNameInteractor({
      applicationContext,
      name: 'Test Practitioner',
    });

    expect(results).toMatchObject([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner1',
        role: ROLES.irsPractitioner,
        userId: '8190d648-e643-4964-988e-141e4e0db861',
      },
      {
        barNumber: 'PT5432',
        name: 'Test Practitioner2',
        role: ROLES.privatePractitioner,
        userId: '12d5bb3a-e867-4066-bda5-2f178a76191f',
      },
    ]);
  });
});
