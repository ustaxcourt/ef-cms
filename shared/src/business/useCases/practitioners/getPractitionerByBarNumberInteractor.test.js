const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getPractitionerByBarNumberInteractor,
} = require('./getPractitionerByBarNumberInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

describe('getPractitionerByBarNumberInteractor', () => {
  it('throws an unauthorized error if the request user does not have the MANAGE_PRACTITIONER_USERS permissions', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitioner',
        role: ROLES.petitioner,
        userId: '1005d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await expect(
      getPractitionerByBarNumberInteractor({
        applicationContext,
        barNumber: 'BN0000',
      }),
    ).rejects.toThrow('Unauthorized for getting attorney user');
  });

  it('calls the persistence method to get a private practitioner with the given bar number', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockReturnValue({
        admissionsDate: '2019-03-01T21:42:29.073Z',
        admissionsStatus: 'Active',
        barNumber: 'PP1234',
        birthYear: '1983',
        employer: 'Private',
        firmName: 'GW Law Offices',
        firstName: 'Private',
        lastName: 'Practitioner',
        name: 'Private Practitioner',
        originalBarState: 'Oklahoma',
        practitionerType: 'Attorney',
        role: ROLES.privatePractitioner,
        section: ROLES.privatePractitioner,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

    const practitioner = await getPractitionerByBarNumberInteractor({
      applicationContext,
      barNumber: 'PP1234',
    });

    expect(practitioner).toEqual({
      additionalPhone: undefined,
      admissionsDate: '2019-03-01T21:42:29.073Z',
      admissionsStatus: 'Active',
      alternateEmail: undefined,
      barNumber: 'PP1234',
      birthYear: '1983',
      email: undefined,
      employer: 'Private',
      entityName: 'Practitioner', // we return all practitioner search results as a Practitioner user.
      firmName: 'GW Law Offices',
      firstName: 'Private',
      lastName: 'Practitioner',
      middleName: undefined,
      name: 'Private Practitioner',
      originalBarState: 'Oklahoma',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      section: ROLES.privatePractitioner,
      suffix: undefined,
      token: undefined,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('calls the persistence method to get an IRS practitioner with the given bar number', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockReturnValue({
        admissionsDate: '2019-03-01T21:42:29.073Z',
        admissionsStatus: 'Active',
        barNumber: 'PI5678',
        birthYear: '1983',
        employer: 'Private',
        firmName: 'GW Law Offices',
        firstName: 'IRS',
        lastName: 'Practitioner',
        name: 'IRS Practitioner',
        originalBarState: 'Oklahoma',
        practitionerType: 'Attorney',
        role: ROLES.irsPractitioner,
        section: ROLES.privatePractitioner,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

    const practitioner = await getPractitionerByBarNumberInteractor({
      applicationContext,
      barNumber: 'PI5678',
    });

    expect(practitioner).toEqual({
      additionalPhone: undefined,
      admissionsDate: '2019-03-01T21:42:29.073Z',
      admissionsStatus: 'Active',
      alternateEmail: undefined,
      barNumber: 'PI5678',
      birthYear: '1983',
      email: undefined,
      employer: 'Private',
      entityName: 'Practitioner',
      firmName: 'GW Law Offices',
      firstName: 'IRS',
      lastName: 'Practitioner',
      middleName: undefined,
      name: 'IRS Practitioner',
      originalBarState: 'Oklahoma',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      section: 'privatePractitioner',
      suffix: undefined,
      token: undefined,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('throws a not found error if no practitioner is found with the given bar number', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockReturnValue(undefined);

    const practitioner = await getPractitionerByBarNumberInteractor({
      applicationContext,
      barNumber: 'BN0000',
    });

    expect(practitioner).toBeUndefined();
  });
});
