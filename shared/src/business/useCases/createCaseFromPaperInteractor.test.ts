import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../entities/User';
import { applicationContext } from '../test/createTestApplicationContext';
import { createCaseFromPaperInteractor } from './createCaseFromPaperInteractor';
import { createISODateString } from '../utilities/DateHandler';

jest.mock('../utilities/DateHandler', () => {
  const originalModule = jest.requireActual('../utilities/DateHandler');
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn(),
  };
});

describe('createCaseFromPaperInteractor', () => {
  const date = '2018-11-21T20:49:28.192Z';
  let user = new User({
    name: 'Test Petitionsclerk',
    role: ROLES.petitionsClerk,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  });
  const mockCreateIsoDateString = createISODateString as jest.Mock;
  mockCreateIsoDateString.mockReturnValue(date);
  beforeEach(() => {
    applicationContext.docketNumberGenerator.createDocketNumber.mockResolvedValue(
      '00101-00',
    );
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockReturnValue(user);

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
      createCaseFromPaperInteractor(applicationContext, {} as any),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('creates a new case from paper and returns a case with a history of case statuses', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        archivedDocketEntries: [],
        corporateDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: date,
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
      } as any,
    );

    const expectedCaseStatus = {
      changedBy: user.name,
      date: createISODateString(),
      updatedCaseStatus: CASE_STATUS_TYPES.new,
    };

    expect(caseFromPaper).toMatchObject({
      caseStatusHistory: [expectedCaseStatus],
    });
  });

  it('adds a applicationForWaiverOfFilingFee docket entry to the case', async () => {
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
          irsNoticeDate: date,
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
      } as any,
    );

    const applicationForWaiverOfFilingFeeDocketEntry =
      caseFromPaper.docketEntries.find(
        d =>
          d.eventCode ===
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
      );
    expect(applicationForWaiverOfFilingFeeDocketEntry).toBeDefined();
  });

  it('adds a STIN docket entry to the case with index 0', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        archivedDocketEntries: [],
        corporateDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: date,
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
      } as any,
    );

    const stinDocketEntry = caseFromPaper.docketEntries.find(
      d => d.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode,
    );
    expect(stinDocketEntry.index).toEqual(0);
  });

  it('adds an RQT docket entry to the case when an RQT file is attached', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        archivedDocketEntries: [],
        corporateDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: date,
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
      } as any,
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
        corporateDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
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
          irsNoticeDate: date,
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
      } as any,
    );

    expect(caseFromPaper).toBeDefined();
  });

  it('creates a case from paper with a request for place of trial and preferred trial city', async () => {
    const caseFromPaper = await createCaseFromPaperInteractor(
      applicationContext,
      {
        archivedDocketEntries: [],
        corporateDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a611',
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: date,
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
      } as any,
    );

    const reqForPlaceOfTrialDocketEntry = caseFromPaper.docketEntries.find(
      d =>
        d.eventCode === INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
    );

    expect(reqForPlaceOfTrialDocketEntry).toBeDefined();

    expect(caseFromPaper).toBeDefined();
  });
});
