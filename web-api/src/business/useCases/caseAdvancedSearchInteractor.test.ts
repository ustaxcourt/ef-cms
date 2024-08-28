import { MAX_SEARCH_RESULTS } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseAdvancedSearchInteractor } from './caseAdvancedSearchInteractor';
import {
  mockIrsPractitionerUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('caseAdvancedSearchInteractor', () => {
  it('returns an unauthorized error on petitioner user role', async () => {
    await expect(
      caseAdvancedSearchInteractor(
        applicationContext,
        { petitionerName: 'Janae Jacobs' },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns empty array if no search params are passed in', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([]);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'Paul Billings',
      },
      mockPetitionsClerkUser,
    );

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records for an exact match result', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
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
      { docketNumber: '101-20', petitioners: [] },
      { docketNumber: '201-20', petitioners: [] },
    ]);
  });

  it('calls search function with correct params, taking startDate and endDate into account, and returns records for an exact match result', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
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
      { docketNumber: '101-20', petitioners: [] },
      { docketNumber: '201-20', petitioners: [] },
    ]);
  });

  it('filters out sealed cases for non associated, non authorized users', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
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
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
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

  it('returns no more than MAX_SEARCH_RESULTS', async () => {
    const maxPlusOneResults = new Array(MAX_SEARCH_RESULTS + 1).fill({
      docketNumber: '101-20',
      petitioners: [],
      userId: '28e908f6-edf0-4289-9372-5b8fe8d2265c',
    });

    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue(maxPlusOneResults);

    const results = await caseAdvancedSearchInteractor(
      applicationContext,
      {
        petitionerName: 'test person',
      },
      mockIrsPractitionerUser,
    );

    expect(results.length).toBe(MAX_SEARCH_RESULTS);
  });

  it('returns results if practitioner is associated', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
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
        irsPractitioners: [
          {
            userId: mockIrsPractitionerUser.userId,
          },
        ],
        petitioners: [],
        sealedDate: 'yup',
      },
    ]);
  });

  it('returns results for petitionsclerk or internal user always', async () => {
    applicationContext
      .getPersistenceGateway()
      .caseAdvancedSearch.mockResolvedValue([
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
        petitioners: [],
        sealedDate: 'yup',
      },
    ]);
  });
});
