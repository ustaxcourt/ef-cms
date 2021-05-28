const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../entities/cases/Case');
const { applicationContext } = require('../test/createTestApplicationContext');
const { createCaseInteractor } = require('./createCaseInteractor');
const { PrivatePractitioner } = require('../entities/PrivatePractitioner');
const { User } = require('../entities/User');

describe('createCaseInteractor', () => {
  let user;
  const mockPetitionMetadata = {
    caseType: CASE_TYPES_MAP.other,
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
  };

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
      createCaseInteractor(applicationContext, {
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseType: CASE_TYPES_MAP.other,
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
      applicationContext.getUseCaseHelpers().createCaseAndAssociations,
    ).not.toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toBeCalled();
  });

  it('should create a case successfully as a petitioner', async () => {
    const result = await createCaseInteractor(applicationContext, {
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: mockPetitionMetadata,
      stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
    });

    expect(result).toBeDefined();
    expect(
      applicationContext.getUseCaseHelpers().createCaseAndAssociations,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toBeCalled();
  });

  it('should match the current user id to the contactId when the user is petitioner', async () => {
    const result = await createCaseInteractor(applicationContext, {
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: mockPetitionMetadata,
      stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
    });

    expect(result.petitioners[0].contactId).toEqual(user.userId);
    expect(result.petitioners[0].address1).toEqual('99 South Oak Lane');
  });

  it('should create a STIN docket entry on the case with index 0', async () => {
    const result = await createCaseInteractor(applicationContext, {
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: CASE_TYPES_MAP.other,
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

    const stinDocketEntry = result.docketEntries.find(
      d => d.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode,
    );
    expect(stinDocketEntry.index).toEqual(0);
  });

  it('should create a case successfully as a practitioner', async () => {
    user = new PrivatePractitioner({
      barNumber: 'BN1234',
      name: 'Mister Peanutbutter',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const result = await createCaseInteractor(applicationContext, {
      ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: CASE_TYPES_MAP.other,
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
    expect(result.privatePractitioners[0].representing).toEqual([
      getContactPrimary(result).contactId,
    ]);
    expect(
      applicationContext.getUseCaseHelpers().createCaseAndAssociations,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toBeCalled();
  });

  it('should create a case with contact primary and secondary successfully as a practitioner', async () => {
    user = new PrivatePractitioner({
      barNumber: 'BN1234',
      name: 'Carole Baskin',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const result = await createCaseInteractor(applicationContext, {
      ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: CASE_TYPES_MAP.other,
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
    expect(result.privatePractitioners[0].representing).toEqual([
      getContactPrimary(result).contactId,
      getContactSecondary(result).contactId,
    ]);
    expect(
      applicationContext.getUseCaseHelpers().createCaseAndAssociations,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toBeCalled();
  });
});
