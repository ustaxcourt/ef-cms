import {
  CONTACT_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  MAX_SEARCH_RESULTS,
  PARTY_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { casePublicSearchInteractor } from './casePublicSearchInteractor';
import { getContactPrimary } from '../../entities/cases/Case';

describe('casePublicSearchInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockReturnValue([]);
  });

  it('returns empty array if no search params are passed in', async () => {
    const results = await casePublicSearchInteractor(
      applicationContext,
      {} as any,
    );

    expect(results).toEqual([]);
  });

  it('strips out all non public data', async () => {
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockReturnValue([
        {
          caseCaption: 'Test Case Caption One',
          docketNumber: '123-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          hasIrsPractitioner: false,
          internalFieldA: 'should be filtered out',
          internalFieldB: 'should be filtered out',
          internalFieldC: 'should be filtered out',
          partyType: PARTY_TYPES.petitioner,
          petitioners: [getContactPrimary(MOCK_CASE)],
          receivedAt: '2019-03-01T21:40:46.415Z',
        },
      ]);

    const results = await casePublicSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    } as any);

    expect(results).toEqual([
      {
        canAllowDocumentService: undefined,
        canAllowPrintableDocketRecord: undefined,
        caseCaption: 'Test Case Caption One',
        createdAt: undefined,
        docketEntries: [],
        docketNumber: '123-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        docketNumberWithSuffix: '123-19S',
        entityName: 'PublicCase',
        hasIrsPractitioner: false,
        isPaper: undefined,
        isSealed: false,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            contactId: getContactPrimary(MOCK_CASE).contactId,
            contactType: CONTACT_TYPES.primary,
            entityName: 'PublicContact',
            name: getContactPrimary(MOCK_CASE).name,
            serviceIndicator: 'Electronic',
            state: getContactPrimary(MOCK_CASE).state,
          },
        ],
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
    ]);
  });

  it('returns no more than MAX_SEARCH_RESULTS', async () => {
    const maxPlusOneResults = new Array(MAX_SEARCH_RESULTS + 1).fill({
      caseCaption: 'Test Case Caption One',
      docketNumber: '123-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      hasIrsPractitioner: false,
      internalFieldA: 'should be filtered out',
      internalFieldB: 'should be filtered out',
      internalFieldC: 'should be filtered out',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [getContactPrimary(MOCK_CASE)],
      receivedAt: '2019-03-01T21:40:46.415Z',
    });
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockResolvedValue(maxPlusOneResults);

    const results = await casePublicSearchInteractor(
      applicationContext,
      {} as any,
    );

    expect(results.length).toBe(MAX_SEARCH_RESULTS);
  });

  it('strips out all sealed cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ sealedDate: 'some date' });
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockReturnValue([
        {
          caseCaption: 'Test Case Caption One',
          contactPrimary: MOCK_CASE.contactPrimary,
          docketNumber: '123-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          hasIrsPractitioner: false,
          partyType: PARTY_TYPES.petitioner,
          receivedAt: '2019-03-01T21:40:46.415Z',
        },
      ]);

    const results = await casePublicSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    } as any);

    expect(results.length).toEqual(0);
  });
});
