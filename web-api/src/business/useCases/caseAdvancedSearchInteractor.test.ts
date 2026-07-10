jest.mock('@web-api/persistence/elasticsearch/caseAdvancedSearch');

import '@web-api/persistence/postgres/cases/mocks.jest';
import {
  CASE_TYPES_MAP,
  MAX_CASE_SEARCH_RESULTS,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { caseAdvancedSearchInteractor } from './caseAdvancedSearchInteractor';
import {
  mockIrsPractitionerUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { caseAdvancedSearch as caseAdvancedSearchMock } from '@web-api/persistence/elasticsearch/caseAdvancedSearch';

const caseAdvancedSearch = caseAdvancedSearchMock as jest.Mock;

const MOCK_CASE_SEARCH_RESULT = {
  caseCaption: 'Test Case Caption',
  docketNumber: '101-20',
  docketNumberWithSuffix: '101-20L',
  fakeField: 'Hide this',
  irsPractitioners: [
    {
      address: 'Hide this',
      name: 'TestIRSPractitioner',
      state: 'California',
    },
  ],
  petitioners: [
    {
      address: 'Hide this',
      name: 'Test Petitioner',
      state: 'California',
    },
  ],
  privatePractitioners: [
    { address: 'Hide this', name: 'TestPrivatePractitioner' },
  ],
  receivedAt: '2023-01-24T22:34:48.100Z',
};

describe('caseAdvancedSearchInteractor', () => {
  it('returns an unauthorized error on petitioner user role', async () => {
    await expect(
      caseAdvancedSearchInteractor(
        applicationContext,
        {
          petitionerName: 'Janae Jacobs',
          caseTypes: [CASE_TYPES_MAP.cdp],
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns an empty array when exact and non-exact searches have no matches', async () => {
    caseAdvancedSearch.mockResolvedValue([]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'Paul Billings',
        caseTypes: [CASE_TYPES_MAP.cdp],
      },
      mockPetitionsClerkUser,
    );

    expect(results).toEqual([]);
    expect(caseAdvancedSearch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ useNonExactQuery: false }),
    );
    expect(caseAdvancedSearch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ useNonExactQuery: true }),
    );
  });

  it('returns non-exact matches when the exact search has no matches', async () => {
    caseAdvancedSearch.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        docketNumber: '101-20',
        petitioners: [],
      },
    ]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockPetitionsClerkUser,
    );

    expect(results).toEqual([
      {
        docketNumber: '101-20',
        petitionerNames: [],
        petitionerStateNames: [],
      },
    ]);
    expect(caseAdvancedSearch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ useNonExactQuery: true }),
    );
  });

  it('calls search function with correct params and returns records for an exact match result', async () => {
    caseAdvancedSearch.mockResolvedValue([
      {
        docketNumber: '101-20',
        petitioners: [],
      },
      {
        docketNumber: '201-20',
        petitioners: [],
      },
    ]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockPetitionsClerkUser,
    );

    expect(results).toEqual([
      { docketNumber: '101-20', petitionerNames: [], petitionerStateNames: [] },
      { docketNumber: '201-20', petitionerNames: [], petitionerStateNames: [] },
    ]);
  });

  it('calls search function with correct params, taking startDate and endDate into account, and returns records for an exact match result', async () => {
    caseAdvancedSearch.mockResolvedValue([
      {
        docketNumber: '101-20',
        petitioners: [],
      },
      {
        docketNumber: '201-20',
        petitioners: [],
      },
    ]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        endDate: '07/29/1993',
        petitionerName: 'test person',
        startDate: '05/18/1985',
      },
      mockPetitionsClerkUser,
    );

    expect(results).toEqual([
      { docketNumber: '101-20', petitionerNames: [], petitionerStateNames: [] },
      { docketNumber: '201-20', petitionerNames: [], petitionerStateNames: [] },
    ]);
  });

  it('filters out sealed cases for non associated, non authorized users', async () => {
    caseAdvancedSearch.mockResolvedValue([
      {
        docketNumber: '101-20',
        petitioners: [],
        sealedDate: 'yup',
        userId: '28e908f6-edf0-4289-9372-5b8fe8d2265c',
      },
    ]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockIrsPractitionerUser,
    );

    expect(results).toEqual([]);
  });

  it('filters out sealed cases that do not have a sealedDate for non associated, non authorized users', async () => {
    caseAdvancedSearch.mockResolvedValue([
      {
        docketNumber: '101-20',
        isSealed: true,
        petitioners: [],
        userId: '28e908f6-edf0-4289-9372-5b8fe8d2265c',
      },
    ]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockIrsPractitionerUser,
    );

    expect(results).toEqual([]);
  });

  it('returns no more than MAX_CASE_SEARCH_RESULTS', async () => {
    const maxPlusOneResults = new Array(MAX_CASE_SEARCH_RESULTS + 1).fill({
      docketNumber: '101-20',
      petitioners: [],
      userId: '28e908f6-edf0-4289-9372-5b8fe8d2265c',
    });

    caseAdvancedSearch.mockResolvedValue(maxPlusOneResults);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockIrsPractitionerUser,
    );

    expect(results.length).toBe(MAX_CASE_SEARCH_RESULTS);
  });

  it('continues searching until it collects MAX_CASE_SEARCH_RESULTS accessible cases', async () => {
    const inaccessibleCase = {
      docketNumber: '100-20',
      isSealed: true,
      petitioners: [],
      sort: [10, '100-20'],
    };
    const firstBatchAccessibleCases = Array.from(
      { length: MAX_CASE_SEARCH_RESULTS - 1 },
      (_, index) => ({
        docketNumber: `${index + 101}-20`,
        petitioners: [],
        sort: [10, `${index + 101}-20`],
      }),
    );
    const finalAccessibleCase = {
      docketNumber: '99999-20',
      petitioners: [],
      sort: [9, '99999-20'],
    };

    caseAdvancedSearch
      .mockResolvedValueOnce([inaccessibleCase, ...firstBatchAccessibleCases])
      .mockResolvedValueOnce([finalAccessibleCase]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockIrsPractitionerUser,
    );

    expect(results).toHaveLength(MAX_CASE_SEARCH_RESULTS);
    expect(results.at(-1)?.docketNumber).toBe(finalAccessibleCase.docketNumber);
    expect(caseAdvancedSearch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        resultSize: 1,
        searchAfter: firstBatchAccessibleCases.at(-1)?.sort,
        useNonExactQuery: false,
      }),
    );
  });

  it('returns results if practitioner is associated', async () => {
    caseAdvancedSearch.mockResolvedValue([
      {
        docketNumber: '101-20',
        irsPractitioners: [
          {
            userId: mockIrsPractitionerUser.userId,
          },
        ],
        petitioners: [],
        sealedDate: 'yup',
      },
    ]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockIrsPractitionerUser,
    );

    expect(results).toEqual([
      {
        docketNumber: '101-20',
        petitionerNames: [],
        petitionerStateNames: [],
      },
    ]);
  });

  it('returns results for petitionsclerk or internal user always', async () => {
    caseAdvancedSearch.mockResolvedValue([
      {
        docketNumber: '101-20',
        petitioners: [],
        sealedDate: 'yup',
      },
    ]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockPetitionsClerkUser,
    );

    expect(results).toEqual([
      {
        docketNumber: '101-20',
        petitionerNames: [],
        petitionerStateNames: [],
      },
    ]);
  });

  it('BUG: should return only necessary advanced search case data', async () => {
    caseAdvancedSearch.mockResolvedValue([MOCK_CASE_SEARCH_RESULT]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockPetitionsClerkUser,
    );

    expect(Object.keys(results[0])).toHaveLength(6);
    expect(results).toMatchObject([
      {
        caseCaption: MOCK_CASE_SEARCH_RESULT.caseCaption,
        docketNumber: MOCK_CASE_SEARCH_RESULT.docketNumber,
        docketNumberWithSuffix: MOCK_CASE_SEARCH_RESULT.docketNumberWithSuffix,
        petitionerNames: MOCK_CASE_SEARCH_RESULT.petitioners.map(p => p.name),
        petitionerStateNames: MOCK_CASE_SEARCH_RESULT.petitioners.map(
          p => p.state,
        ),
        receivedAt: MOCK_CASE_SEARCH_RESULT.receivedAt,
      },
    ]);
  });

  it('converts state and territory abbreviations and preserves unmapped state values', async () => {
    caseAdvancedSearch.mockResolvedValue([
      {
        docketNumber: '101-20',
        petitioners: [
          { name: 'State Petitioner', state: 'TN' },
          { name: 'Territory Petitioner', state: 'GU' },
          { name: 'International Petitioner', state: 'Ontario' },
          { name: 'Petitioner Without State' },
        ],
      },
    ]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockPetitionsClerkUser,
    );

    expect(results[0].petitionerStateNames).toEqual([
      'Tennessee',
      'Guam',
      'Ontario',
    ]);
  });
});
