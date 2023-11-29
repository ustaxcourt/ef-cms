import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';

import { applicationContext } from '../test/createTestApplicationContext';
import { createCaseInteractor } from '../useCases/createCaseInteractor';
import { getCaseInteractor } from '../useCases/getCaseInteractor';

// mock out ONLY the 'createISODateString' function while allowing original implementations
import { createISODateString, formatNow } from '../utilities/DateHandler';

jest.mock('../utilities/DateHandler', () => {
  const originalModule = jest.requireActual('../utilities/DateHandler');
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn(),
    formatNow: jest.fn().mockReturnValue('1999'), // must return a value for require stack
  };
});

describe('createCase integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';
  const CREATED_YEAR = '2019';
  const PETITIONER_USER_ID = '7805d1ab-18d0-43ec-bafb-654e83405416';

  const petitionerUser = {
    name: 'Test Petitioner',
    role: ROLES.petitioner,
    userId: PETITIONER_USER_ID,
  };

  beforeAll(() => {
    createISODateString.mockReturnValue(CREATED_DATE);
    formatNow.mockReturnValue(CREATED_YEAR);

    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(petitionerUser);
  });

  it('should create the expected case into the database', async () => {
    const { docketNumber } = await createCaseInteractor(applicationContext, {
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: CASE_TYPES_MAP.innocentSpouse,
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        petitionFile: {},
        petitionFileSize: 1,
        petitioners: [
          {
            address1: '19 First Freeway',
            address2: 'Ad cumque quidem lau',
            address3: 'Anim est dolor animi',
            city: 'Rerum eaque cupidata',
            contactType: CONTACT_TYPES.primary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner@example.com',
            name: 'Rick Petitioner',
            phone: '+1 (599) 681-5435',
            postalCode: '89614',
            state: 'AL',
          },
        ],
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
        stinFile: {},
        stinFileSize: 1,
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    const createdCase = await getCaseInteractor(applicationContext, {
      docketNumber,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Rick Petitioner, Petitioner',
      docketEntries: [
        {
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Petr. Rick Petitioner',
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              documentType: 'Petition',
              filedBy: 'Petr. Rick Petitioner',
            },
            docketNumber: '101-19',
            docketNumberWithSuffix: '101-19S',
            isInitializeCase: true,
            section: PETITIONS_SECTION,
            sentBy: 'Test Petitioner',
            sentByUserId: PETITIONER_USER_ID,
          },
        },
        {
          documentTitle: 'Request for Place of Trial at Aberdeen, South Dakota',
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: 'RQT',
        },
        {
          documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
          filedBy: 'Petr. Rick Petitioner',
          userId: PETITIONER_USER_ID,
        },
      ],
      docketNumber: '101-19',
      docketNumberWithSuffix: '101-19S',
      initialCaption: 'Rick Petitioner, Petitioner',
      initialDocketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForCds: false,
      orderForFilingFee: true,
      orderForRatification: false,
      orderToShowCause: false,
      petitioners: [
        {
          contactId: PETITIONER_USER_ID,
          contactType: CONTACT_TYPES.primary,
        },
      ],
      status: CASE_STATUS_TYPES.new,
    });
  });
});
