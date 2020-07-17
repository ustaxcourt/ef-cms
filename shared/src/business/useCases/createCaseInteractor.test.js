const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { createCaseInteractor } = require('./createCaseInteractor');
const { User } = require('../entities/User');

describe('createCaseInteractor', () => {
  let user;

  beforeEach(() => {
    user = new User({
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext.docketNumberGenerator.createDocketNumber.mockResolvedValue(
      '00101-00',
    );
    applicationContext.environment.stage = 'local';

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => user);

    applicationContext
      .getUseCases()
      .getUserInteractor.mockImplementation(() => user);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    user = {};

    await expect(
      createCaseInteractor({
        applicationContext,
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseType: 'Other',
          filingType: 'Myself',
          hasIrsNotice: true,
          partyType: PARTY_TYPES.petitioner,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      }),
    ).rejects.toThrow('Unauthorized');
    expect(
      applicationContext.getPersistenceGateway().createCase,
    ).not.toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).not.toBeCalled();
  });

  it('should create a case successfully as a petitioner', async () => {
    const result = await createCaseInteractor({
      applicationContext,
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: 'Other',
        contactPrimary: {
          address1: '99 South Oak Lane',
          address2: 'Culpa numquam saepe ',
          address3: 'Eaque voluptates com',
          city: 'Dignissimos voluptat',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner1@example.com',
          name: 'Diana Prince',
          phone: '+1 (215) 128-6587',
          postalCode: '69580',
          state: 'AR',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.petitioner,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Small',
        signature: true,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
      },
      stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
    });

    expect(result).toBeDefined();
    expect(applicationContext.getPersistenceGateway().createCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
  });

  it('should create a case successfully as a practitioner', async () => {
    user = new User({
      name: 'Mister Peanutbutter',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const result = await createCaseInteractor({
      applicationContext,
      ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: 'Other',
        contactPrimary: {
          address1: '99 South Oak Lane',
          address2: 'Culpa numquam saepe ',
          address3: 'Eaque voluptates com',
          city: 'Dignissimos voluptat',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner1@example.com',
          name: 'Diana Prince',
          phone: '+1 (215) 128-6587',
          postalCode: '69580',
          state: 'AR',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.petitioner,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Small',
        signature: true,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
      },
      stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
    });

    expect(result).toBeDefined();
    expect(result.privatePractitioners[0].representingPrimary).toEqual(true);
    expect(
      result.privatePractitioners[0].representingSecondary,
    ).toBeUndefined();
    expect(applicationContext.getPersistenceGateway().createCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
  });

  it('should create a case with contact primary and secondary successfully as a practitioner', async () => {
    user = new User({
      name: 'Carole Baskin',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const result = await createCaseInteractor({
      applicationContext,
      ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: 'Other',
        contactPrimary: {
          address1: '99 South Oak Lane',
          address2: 'Culpa numquam saepe ',
          address3: 'Eaque voluptates com',
          city: 'Dignissimos voluptat',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner1@example.com',
          name: 'Diana Prince',
          phone: '+1 (215) 128-6587',
          postalCode: '69580',
          state: 'AR',
        },
        contactSecondary: {
          address1: '99 South Oak Lane',
          address2: 'Culpa numquam saepe ',
          address3: 'Eaque voluptates com',
          city: 'Dignissimos voluptat',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Bob Prince',
          phone: '+1 (215) 128-6587',
          postalCode: '69580',
          state: 'AR',
        },
        filingType: 'Myself and my spouse',
        hasIrsNotice: true,
        isSpouseDeceased: 'No',
        partyType: PARTY_TYPES.petitionerSpouse,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Small',
        signature: true,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
      },
      stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
    });

    expect(result).toBeDefined();
    expect(result.privatePractitioners[0].representingPrimary).toEqual(true);
    expect(result.privatePractitioners[0].representingSecondary).toEqual(true);
    expect(applicationContext.getPersistenceGateway().createCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
  });
});
