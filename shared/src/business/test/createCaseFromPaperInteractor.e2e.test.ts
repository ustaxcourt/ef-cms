import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  INITIAL_DOCUMENT_TYPES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';

import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { createCaseFromPaperInteractor } from '../useCases/createCaseFromPaperInteractor';
import { getCaseInteractor } from '../useCases/getCaseInteractor';

// mock out ONLY the 'createISODateString' function while allowing original implementations
import { createISODateString } from '../utilities/DateHandler';

jest.mock('../utilities/DateHandler', () => {
  const originalModule = jest.requireActual('../utilities/DateHandler');
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn(),
  };
});

describe('createCaseFromPaperInteractor integration test', () => {
  const RECEIVED_DATE = '2019-02-01T22:54:06.000Z';
  const RECEIVED_DATE_START_OF_DAY = '2019-02-01T05:00:00.000Z';
  const mockUserId = 'a805d1ab-18d0-43ec-bafb-654e83405416';

  beforeAll(() => {
    (createISODateString as jest.Mock).mockReturnValue(RECEIVED_DATE);

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Alex Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: mockUserId,
    });
  });

  it('should persist the paper case into the database', async () => {
    const { docketNumber } = await createCaseFromPaperInteractor(
      applicationContext,
      {
        petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
        petitionMetadata: {
          caseCaption: 'Bob Jones2, Petitioner',
          caseType: MOCK_CASE.caseType,
          createdAt: RECEIVED_DATE,
          mailingDate: 'testing',
          partyType: MOCK_CASE.partyType,
          petitionFile: { name: 'something' },
          petitionFileSize: 1,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          petitioners: [
            {
              address1: '123 Abc Ln',
              city: 'something',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              name: 'Bob Jones',
              phone: '1234567890',
              postalCode: '12345',
              state: 'CA',
            },
          ],
          preferredTrialCity: MOCK_CASE.preferredTrialCity,
          procedureType: MOCK_CASE.procedureType,
          receivedAt: RECEIVED_DATE,
          requestForPlaceOfTrialFile: new File(
            [],
            'requestForPlaceOfTrialFile.pdf',
          ),
          requestForPlaceOfTrialFileSize: 1,
          stinFile: { name: 'something else' },
          stinFileSize: 1,
        },
        stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
      },
    );

    const createdCase = await getCaseInteractor(applicationContext, {
      docketNumber,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Bob Jones2, Petitioner',
      createdAt: RECEIVED_DATE,
      docketEntries: [
        {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Petr. Bob Jones',
          receivedAt: RECEIVED_DATE_START_OF_DAY,
          workItem: {
            assigneeId: mockUserId,
            assigneeName: 'Alex Petitionsclerk',
            caseStatus: CASE_STATUS_TYPES.new,
            createdAt: RECEIVED_DATE,
            docketEntry: {
              docketEntryId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
              documentType: 'Petition',
              filedBy: 'Petr. Bob Jones',
            },
            docketNumber: '101-19',
            isInitializeCase: true,
            section: PETITIONS_SECTION,
            sentBy: 'Alex Petitionsclerk',
            sentByUserId: mockUserId,
          },
        },
        {
          createdAt: RECEIVED_DATE,
          documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
          filedBy: 'Petr. Bob Jones',
          receivedAt: RECEIVED_DATE_START_OF_DAY,
        },
      ],
      docketNumber: '101-19',
      docketNumberWithSuffix: '101-19',
      initialCaption: 'Bob Jones2, Petitioner',
      initialDocketNumberSuffix: '_',
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForCds: false,
      orderForFilingFee: false,
      orderForRatification: false,
      orderToShowCause: false,
      petitioners: [
        {
          contactId: expect.not.stringContaining(mockUserId), // should NOT be the petitionsclerk who is logged in
        },
      ],
      receivedAt: RECEIVED_DATE,
      status: CASE_STATUS_TYPES.new,
    });
  });
});
