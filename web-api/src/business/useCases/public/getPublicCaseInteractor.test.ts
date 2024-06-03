import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  PARTY_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { getContactPrimary } from '../../../../../shared/src/business/entities/cases/Case';
import { getPublicCaseInteractor } from './getPublicCaseInteractor';

describe('getPublicCaseInteractor', () => {
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

  it('should format the given docket number, removing leading zeroes and suffix', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await getPublicCaseInteractor(applicationContext, {
      docketNumber: '0000123-19S',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toEqual({
      applicationContext,
      docketNumber: '123-19',
    });
  });

  it('Should return a Not Found error if the case does not exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ archivedCorrespondences: [] });

    await expect(
      getPublicCaseInteractor(applicationContext, {
        docketNumber: '999',
      }),
    ).rejects.toThrow('Case 999 was not found.');
  });

  it('Should search by docketNumber when docketNumber parameter is a valid docketNumber', async () => {
    const docketNumber = '123-45';

    const result = await getPublicCaseInteractor(applicationContext, {
      docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(result).toMatchObject({
      docketNumber: '123-45',
      petitioners: [
        {
          name: mockCaseContactPrimary.name,
          state: mockCaseContactPrimary.state,
        },
      ],
    });
  });

  it('should return minimal information when the requested case has been sealed', async () => {
    const docketNumber = '102-20';

    const result = await getPublicCaseInteractor(applicationContext, {
      docketNumber,
    });

    expect(result).toMatchObject({
      docketNumber,
      isSealed: true,
    });
  });

  it('should return minimal information when the requested case has a sealed docket entry', async () => {
    const docketNumber = '120-20';

    const result = await getPublicCaseInteractor(applicationContext, {
      docketNumber,
    });

    expect(result).toMatchObject({
      docketNumber,
      isSealed: false,
    });
  });

  it('should return minimal information when the requested case contact address has been sealed', async () => {
    const docketNumber = '188-88';

    const result = await getPublicCaseInteractor(applicationContext, {
      docketNumber,
    });

    expect(result).toMatchObject({
      docketNumber,
    });
    expect(getContactPrimary(result).address1).toBeUndefined();
  });

  it('should return the case to the public user if the case is unsealed but has a sealed document', async () => {
    const docketNumber = '190-92';

    await expect(
      getPublicCaseInteractor(applicationContext, {
        docketNumber,
      }),
    ).resolves.toMatchObject({
      docketNumber,
    });
  });
});
