jest.mock('uuid');
const uuid = require('uuid');
const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
  ROLES,
} = require('../entities/EntityConstants');
const {
  createCaseFromPaperInteractor,
} = require('./createCaseFromPaperInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

describe('createCaseFromPaperInteractor', () => {
  const MOCK_CASE_ID = '413f62ce-d7c8-446e-aeda-14a2a625a626';
  const DATE = '2018-11-21T20:49:28.192Z';

  beforeEach(() => {
    uuid.v4 = jest.fn().mockReturnValue(MOCK_CASE_ID);
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(DATE);

    applicationContext.docketNumberGenerator.createDocketNumber.mockResolvedValue(
      '00101-00',
    );
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    applicationContext
      .getUseCaseHelpers()
      .createCaseAndAssociations.mockResolvedValue(null);

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      section: PETITIONS_SECTION,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext
      .getPersistenceGateway()
      .saveWorkItem.mockResolvedValue(null);

    applicationContext.getUniqueId.mockReturnValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );

    applicationContext.getUseCases().getUserInteractor.mockReturnValue({
      name: 'john doe',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      createCaseFromPaperInteractor(applicationContext, {}),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('creates a case from paper', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        archivedDocketEntries: [],
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'testing',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
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
              state: 'AR',
            },
          ],
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      },
    );

    expect(caseFromPaper).toBeDefined();
  });

  it('adds a STIN docket entry to the case with index 0', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        archivedDocketEntries: [],
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'testing',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
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
              state: 'AR',
            },
          ],
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      },
    );

    const stinDocketEntry = caseFromPaper.docketEntries.find(
      d => d.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode,
    );
    expect(stinDocketEntry.index).toEqual(0);
  });

  it('creates a case from paper with a secondary contact', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        archivedDocketEntries: [],
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner1@example.com',
            name: 'Bob Prince',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'test',
          partyType: PARTY_TYPES.petitionerSpouse,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
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
              state: 'AR',
            },
          ],
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      },
    );

    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with a request for place of trial and preferred trial city', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        archivedDocketEntries: [],
        ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'testing',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
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
              state: 'AR',
            },
          ],
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        requestForPlaceOfTrialFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      },
    );

    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with Application for Waiver of Filing Fee', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        applicationForWaiverOfFilingFeeFileId:
          '413f62ce-7c8d-446e-aeda-14a2a625a611',
        archivedDocketEntries: [],
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
          mailingDate: 'testing',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: new File([], 'petitionFile.pdf'),
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
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
              state: 'AR',
            },
          ],
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
          receivedAt: applicationContext.getUtilities().createISODateString(),
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: new File([], 'stinFile.pdf'),
          stinFileSize: 1,
        },
        stinFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
      },
    );

    expect(caseFromPaper).toBeDefined();
  });
});
