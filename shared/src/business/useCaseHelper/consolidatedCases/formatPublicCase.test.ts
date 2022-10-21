import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  PARTY_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { formatPublicCase } from './formatPublicCase';
import { getConsolidatedCasesForLeadCase } from '../getConsolidatedCasesForLeadCase';
import { getContactPrimary } from '../../entities/cases/Case';

describe('formatPublicCase', () => {
  const mockCaseContactPrimary = getContactPrimary(MOCK_CASE);

  const mockCase = {
    docketNumber: '123-45',
    irsPractitioners: [],
    partyType: PARTY_TYPES.petitioner,
    petitioners: [mockCaseContactPrimary],
  };

  const legacySealedDocketEntries = cloneDeep(MOCK_CASE.docketEntries);
  legacySealedDocketEntries[0].isLegacySealed = true;
  legacySealedDocketEntries[0].isSealed = true;
  legacySealedDocketEntries[0].sealedTo = DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC;

  const nonLegacySealedDocketEntries = cloneDeep(MOCK_CASE.docketEntries);
  nonLegacySealedDocketEntries[0].isSealed = true;
  nonLegacySealedDocketEntries[0].sealedTo =
    DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC;

  const sealedContactPrimary = cloneDeep({
    ...mockCaseContactPrimary,
    isSealed: true,
  });

  const mockCases = {
    '102-20': {
      docketNumber: '102-20',
      irsPractitioners: [],
      partyType: PARTY_TYPES.petitioner,
      petitioners: [mockCaseContactPrimary],
      sealedDate: '2020-01-02T03:04:05.007Z',
    },
    '120-20': {
      ...cloneDeep(mockCase),
      docketEntries: legacySealedDocketEntries,
      docketNumber: '120-20',
    },
    '123-45': cloneDeep(mockCase),
    '188-88': {
      docketNumber: '188-88',
      irsPractitioners: [],
      partyType: PARTY_TYPES.petitioner,
      petitioners: [sealedContactPrimary],
    },
    '190-92': {
      ...cloneDeep(mockCase),
      docketEntries: nonLegacySealedDocketEntries,
      docketNumber: '190-92',
    },
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        return mockCases[docketNumber];
      });
  });

  //   it('should format the given docket number, removing leading zeroes and suffix', () => {
  //     applicationContext
  //       .getPersistenceGateway()
  //       .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

  //     getPublicCaseInteractor(applicationContext, {
  //       docketNumber: '0000123-19S',
  //     });

  //     expect(
  //       applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
  //         .calls[0][0],
  //     ).toEqual({
  //       applicationContext,
  //       docketNumber: '123-19',
  //     });
  //   });

  it.skip('Should return a Not Found error if the case does not exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ archivedCorrespondences: [] });

    await expect(
      formatPublicCase({
        applicationContext,
        docketNumber: '999',
        rawCaseRecord: {},
      }),
    ).rejects.toThrow('Case 999 was not found.');
  });
});
