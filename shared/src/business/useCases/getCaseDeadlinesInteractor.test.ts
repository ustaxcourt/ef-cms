import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import {
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseDeadlinesByDateRange as getCaseDeadlinesByDateRangeMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDateRange';

import { getCaseDeadlinesInteractor } from './getCaseDeadlinesInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getCasesMetadataByDocketNumbers as getCasesMetadataByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesMetadataByDocketNumbers';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';

const getCaseDeadlinesByDateRange = jest.mocked(
  getCaseDeadlinesByDateRangeMock,
);

const getCasesMetadataByDocketNumbers =
  getCasesMetadataByDocketNumbersMock as jest.Mock;
const updateCase = jest.mocked(updateCaseMock);
updateCase.mockImplementation(({ caseToUpdate }) =>
  Promise.resolve(caseToUpdate),
);

describe('getCaseDeadlinesInteractor', () => {
  const mockDeadlines = [
    {
      associatedJudge: 'Judge Buch',
      associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
      caseDeadlineId: '22c0736f-c4c5-4ab5-97c3-e41fb06bbc2f',
      createdAt: '2019-01-01T21:40:46.415Z',
      deadlineDate: '2019-03-01T21:40:46.415Z',
      description: 'A deadline!',
      docketNumber: '101-19',
    },
    {
      associatedJudge: 'Judge Carluzzo',
      associatedJudgeId: 'dabbad03-18d0-43ec-bafb-654e83405416',
      caseDeadlineId: 'c63d6904-5314-4372-8259-9f8f65824bb7',
      createdAt: '2019-02-01T21:40:46.415Z',
      deadlineDate: '2019-04-01T21:40:46.415Z',
      description: 'A different deadline!',
      docketNumber: '102-19',
    },
  ];

  const mockCases = [
    {
      associatedJudge: 'Judge A',
      associatedJudgeId: 'a36a8e68-4f9a-499d-8a8c-703e21799b19',
      caseCaption: 'A caption, Petitioner',
      caseType: CASE_TYPES_MAP.cdp,
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-19',
      docketNumberSuffix: 'L',
      docketNumberWithSuffix: '101-19L',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Roslindis Angelino',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
      ],
      procedureType: 'Regular',
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    },
    {
      associatedJudge: 'Judge A',
      associatedJudgeId: 'a36a8e68-4f9a-499d-8a8c-703e21799b19',
      caseCaption: 'Another caption, Petitioner',
      caseType: CASE_TYPES_MAP.cdp,
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Gal Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '102-19',
      docketNumberSuffix: 'L',
      docketNumberWithSuffix: '102-19L',
      partyType: PARTY_TYPES.petitioner,
      procedureType: 'Regular',
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    },
  ];

  const START_DATE = '2019-08-25T05:00:00.000Z';
  const END_DATE = '2020-08-25T05:00:00.000Z';

  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    getCaseDeadlinesByDateRange.mockResolvedValue({
      foundDeadlines: mockDeadlines as CaseDeadline[],
      totalCount: 2,
    });
    getCasesMetadataByDocketNumbers.mockResolvedValue(mockCases);
  });

  it('throws an error when the user is not valid or authorized', async () => {
    await expect(
      getCaseDeadlinesInteractor({} as any, mockPetitionerUser),
    ).rejects.toThrow('Unauthorized');
  });

  it('gets all the case deadlines and combines them with case data', async () => {
    const result = await getCaseDeadlinesInteractor(
      {} as any,
      mockPetitionsClerkUser,
    );

    expect(result).toEqual({
      deadlines: [
        {
          associatedJudge: 'Judge Buch',
          associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
          caseCaption: 'A caption, Petitioner',
          caseDeadlineId: '22c0736f-c4c5-4ab5-97c3-e41fb06bbc2f',
          createdAt: '2019-01-01T21:40:46.415Z',
          deadlineDate: '2019-03-01T21:40:46.415Z',
          description: 'A deadline!',
          docketNumber: '101-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
          docketNumberWithSuffix: '101-19L',
          entityName: 'CaseDeadline',
          sortableDocketNumber: 2019000101,
        },
        {
          associatedJudge: 'Judge Carluzzo',
          associatedJudgeId: 'dabbad03-18d0-43ec-bafb-654e83405416',
          caseCaption: 'Another caption, Petitioner',
          caseDeadlineId: 'c63d6904-5314-4372-8259-9f8f65824bb7',
          createdAt: '2019-02-01T21:40:46.415Z',
          deadlineDate: '2019-04-01T21:40:46.415Z',
          description: 'A different deadline!',
          docketNumber: '102-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
          docketNumberWithSuffix: '102-19L',
          entityName: 'CaseDeadline',
          sortableDocketNumber: 2019000102,
        },
      ],
      totalCount: 2,
    });
  });

  it('passes date and filtering params to getCaseDeadlinesByDateRange persistence call', async () => {
    const judgeId = '123456';
    await getCaseDeadlinesInteractor(
      {
        endDate: END_DATE,
        from: 0,
        judgeId,
        startDate: START_DATE,
      },
      mockPetitionsClerkUser,
    );

    expect(getCaseDeadlinesByDateRange.mock.calls[0][0]).toMatchObject({
      endDate: END_DATE,
      from: 0,
      judgeId,
      startDate: START_DATE,
    });
  });

  it('passes null for judgeId to getCaseDeadlinesByDateRange persistence call when chief judge is requested', async () => {
    await getCaseDeadlinesInteractor(
      applicationContext,
      {
        endDate: END_DATE,
        from: 0,
        judgeId: CHIEF_JUDGE,
        startDate: START_DATE,
      },
      mockPetitionsClerkUser,
    );

    expect(getCaseDeadlinesByDateRange.mock.calls[0][0]).toMatchObject({
      endDate: END_DATE,
      from: 0,
      judgeId: null,
      startDate: START_DATE,
    });
  });
});
