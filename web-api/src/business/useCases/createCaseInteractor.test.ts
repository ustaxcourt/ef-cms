import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { PrivatePractitioner } from '../../../../shared/src/business/entities/PrivatePractitioner';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createCaseInteractor } from './createCaseInteractor';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import {
  getContactPrimary,
  getContactSecondary,
} from '../../../../shared/src/business/entities/cases/Case';

jest.mock('@shared/business/utilities/DateHandler', () => {
  const originalModule = jest.requireActual(
    '@shared/business/utilities/DateHandler',
  );
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn(),
  };
});

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
    irsNoticesRedactionAcknowledgement: true,
    partyType: PARTY_TYPES.petitioner,
    petitionFile: new File([], 'test.pdf'),
    petitionFileSize: 1,
    petitionRedactionAcknowledgement: true,
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Small',
    signature: true,
    stinFile: new File([], 'test.pdf'),
    stinFileSize: 1,
  };
  const date = '2020-11-21T20:49:28.192Z';
  const mockCreateIsoDateString = createISODateString as jest.Mock;
  mockCreateIsoDateString.mockReturnValue(date);

  beforeEach(() => {
    user = new User({
      email: 'tom.petitioner@example.com',
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.docketNumberGenerator.createDocketNumber.mockResolvedValue(
      '00101-00',
    );

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
      createCaseInteractor(
        applicationContext,
        {
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
        } as any,
        user,
      ),
    ).rejects.toThrow('Unauthorized');
    expect(
      applicationContext.getUseCaseHelpers().createCaseAndAssociations,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
  });

  it('should create a case (with a case status history) successfully as a petitioner', async () => {
    const result = await createCaseInteractor(
      applicationContext,
      {
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: mockPetitionMetadata,
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      } as any,
      user,
    );

    expect(result).toBeDefined();
    const petitionDocketEntry = result.docketEntries.find(
      d => d.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
    );
    expect(petitionDocketEntry).toBeDefined();
    expect(petitionDocketEntry.redactionAcknowledgement).toEqual(true);
    expect(
      applicationContext.getUseCaseHelpers().createCaseAndAssociations.mock
        .calls[0][0].caseToCreate,
    ).toMatchObject({
      caseStatusHistory: [
        {
          changedBy: 'Petitioner',
          date: createISODateString(),
          updatedCaseStatus: CASE_STATUS_TYPES.new,
        },
      ],
    });
    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should create a case (with a case status history) successfully as a private practitioner', async () => {
    user = {
      barNumber: 'BN1234',
      email: 'privateprac@example.com',
      name: 'Attorney One',
      role: ROLES.privatePractitioner,
      userId: '330d4b65-620a-489d-8414-6623653ebc4f',
    };

    const result = await createCaseInteractor(
      applicationContext,
      {
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: mockPetitionMetadata,
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      } as any,
      user,
    );

    expect(result).toBeDefined();
    expect(
      applicationContext.getUseCaseHelpers().createCaseAndAssociations.mock
        .calls[0][0].caseToCreate,
    ).toMatchObject({
      caseStatusHistory: [
        {
          changedBy: 'Private Practitioner',
          date: createISODateString(),
          updatedCaseStatus: CASE_STATUS_TYPES.new,
        },
      ],
    });
    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should match the current user id to the contactId when the user is petitioner', async () => {
    const result = await createCaseInteractor(
      applicationContext,
      {
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: mockPetitionMetadata,
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      } as any,
      user,
    );

    expect(result.petitioners[0].contactId).toEqual(user.userId);
    expect(result.petitioners[0].address1).toEqual('99 South Oak Lane');
  });

  it('should create a STIN docket entry on the case with index 0', async () => {
    const result = await createCaseInteractor(
      applicationContext,
      {
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
      } as any,
      user,
    );

    const stinDocketEntry = result.docketEntries.find(
      d => d.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode,
    );
    expect(stinDocketEntry.index).toEqual(0);
  });

  it('should create a case successfully as a practitioner', async () => {
    user = new PrivatePractitioner({
      barNumber: 'BN1234',
      email: 'pbventures@example.com',
      name: 'Mister Peanutbutter',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const result = await createCaseInteractor(
      applicationContext,
      {
        corporateDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
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
          irsNoticesRedactionAcknowledgement: true,
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          petitionRedactionAcknowledgement: true,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          signature: true,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      },
      user,
    );

    expect(result).toBeDefined();
    expect(result.privatePractitioners).toBeDefined();
    expect(result.privatePractitioners![0].representing).toEqual([
      getContactPrimary(result).contactId,
    ]);
    const petitionDocketEntry = result.docketEntries.find(
      d => d.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
    );

    expect(petitionDocketEntry).toBeDefined();
    expect(petitionDocketEntry.redactionAcknowledgement).toEqual(true);
    expect(
      applicationContext.getUseCaseHelpers().createCaseAndAssociations,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should create a case successfully with an "Attachment to Petition" document', async () => {
    const result = await createCaseInteractor(
      applicationContext,
      {
        attachmentToPetitionFileIds: ['f09116b1-6a8c-4198-b661-0f06e9c6cbdc'],
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
          irsNoticesRedactionAcknowledgement: true,
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          petitionRedactionAcknowledgement: true,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          signature: true,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      },
      user,
    );

    const atpDocketEntry = result.docketEntries.find(
      d =>
        d.eventCode === INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
    );

    expect(atpDocketEntry).toBeDefined();
    expect(atpDocketEntry.redactionAcknowledgement).toEqual(true);
  });

  it('should create a case successfully with multiple "Attachment to Petition" documents', async () => {
    const result = await createCaseInteractor(
      applicationContext,
      {
        attachmentToPetitionFileIds: [
          'f09116b1-6a8c-4198-b661-0f06e9c6cbdc',
          '550e8400-e29b-41d4-a716-446655440000',
        ],
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
          irsNoticesRedactionAcknowledgement: true,
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          petitionRedactionAcknowledgement: true,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          signature: true,
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 1,
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      },
      user,
    );

    const atpDocketEntries = result.docketEntries.filter(
      d =>
        d.eventCode === INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
    );
    expect(atpDocketEntries).toHaveLength(2);
    expect(atpDocketEntries[0].redactionAcknowledgement).toEqual(true);
    expect(atpDocketEntries[1].redactionAcknowledgement).toEqual(true);
  });

  it('should create a case with contact primary and secondary successfully as a practitioner', async () => {
    user = new PrivatePractitioner({
      barNumber: 'BN1234',
      email: 'kb@example.com',
      name: 'Karen Baskinostan',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const result = await createCaseInteractor(
      applicationContext,
      {
        corporateDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
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
      },
      user,
    );

    expect(result).toBeDefined();
    expect(result.privatePractitioners).toBeDefined();
    expect(result.privatePractitioners![0].representing).toEqual([
      getContactPrimary(result).contactId,
      getContactSecondary(result).contactId,
    ]);
    expect(
      applicationContext.getUseCaseHelpers().createCaseAndAssociations,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should set serviceIndicators for each petitioner on the case', async () => {
    user = new PrivatePractitioner({
      barNumber: 'BN1234',
      email: 'kb@example.com',
      name: 'Karen Baskinostan',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const result = await createCaseInteractor(
      applicationContext,
      {
        corporateDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseType: CASE_TYPES_MAP.other,
          contactPrimary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            contactType: CONTACT_TYPES.primary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner1@example.com',
            name: 'Diana Prince',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            serviceIndicator: undefined,
            state: 'AR',
          },
          contactSecondary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            contactType: CONTACT_TYPES.secondary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Bob Prince',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            serviceIndicator: undefined,
            state: 'AR',
          },
          filedBy: 'Resp.',
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
      },
      user,
    );

    result.petitioners.forEach(p => {
      expect(p.serviceIndicator).not.toBeUndefined();
    });
  });

  it('should remove email and serviceIndicator for petitioner when case is created by a private petitioner', async () => {
    user = new PrivatePractitioner({
      barNumber: 'BN1234',
      email: 'kb@example.com',
      name: 'Karen Baskinostan',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const result = await createCaseInteractor(
      applicationContext,
      {
        petitionFileId: '6722d660-d241-45ad-b7b2-0326cbfee40d',
        petitionMetadata: {
          caseType: 'Deficiency',
          contactPrimary: {
            address1: '25 Second Lane',
            address2: 'Adipisci qui et est ',
            address3: 'Cumque reprehenderit',
            city: 'Consequatur Iusto e',
            countryType: 'domestic',
            email: 'privatePractitioner@example.com',
            name: 'Inez Martinez',
            phone: '+1 (756) 271-3574',
            postalCode: '68964',
            state: 'VA',
          },
          contactSecondary: {},
          filingType: 'Individual petitioner',
          hasIrsNotice: true,
          partyType: 'Petitioner',
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 13264,
          preferredTrialCity: 'Birmingham, Alabama',
          procedureType: 'Regular',
          stinFile: new File([], 'test.pdf'),
          stinFileSize: 13264,
          wizardStep: '5',
        },
        stinFileId: 'e8bd0522-84ec-41fb-b490-0f4b8aa8a430',
      } as any,
      user,
    );

    result.petitioners.forEach(p => {
      expect(p.serviceIndicator).toBe(SERVICE_INDICATOR_TYPES.SI_NONE);
      expect(p.email).toBeUndefined();
    });
  });
});
