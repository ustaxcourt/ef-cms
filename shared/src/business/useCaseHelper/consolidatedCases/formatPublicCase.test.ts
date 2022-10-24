import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  PARTY_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { formatPublicCase } from './formatPublicCase';
import { getContactPrimary } from '../../entities/cases/Case';

describe('getPublicCaseInteractor', () => {
  const mockCaseContactPrimary = getContactPrimary(MOCK_CASE);

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

  const mockCase = {
    ...cloneDeep(MOCK_CASE),
    docketEntries: nonLegacySealedDocketEntries,
    irsPractitioners: [],
    petitioners: [mockCaseContactPrimary],
  };

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
      ...cloneDeep(MOCK_CASE),
      docketEntries: nonLegacySealedDocketEntries,
    },
  };

  it('should return a public contact entity when the requested case has been sealed', async () => {
    const expectedSealedCaseInfo = {
      docketNumber: '101-18',
      isSealed: true,
    };

    let sealedCase = {
      ...mockCase,
      isSealed: true,
      sealedDate: '2020-04-29T15:53:09.650Z',
    };

    let result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: sealedCase,
    });

    expect(result).toMatchObject(expectedSealedCaseInfo);
    delete sealedCase.isSealed;

    result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: sealedCase,
    });

    expect(result).toMatchObject(expectedSealedCaseInfo);
    expect(result.petitioners).toBeUndefined();
  });

  it('should return minimal information when the requested case has a sealed docket entry', async () => {
    const expectedSealedCaseInfo = {
      docketNumber: '101-18',
      isSealed: false,
    };

    let result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: mockCase,
    });

    result.petitioners.forEach(petitioner => {
      expect(petitioner.entityName).toEqual('PublicContact');
      expect(petitioner).not.toMatchObject({
        address1: 'address 1',
        email: 'email 1',
      });

      expect(petitioner.entityName).toEqual('PublicContact');
    });

    expect(result).toMatchObject(expectedSealedCaseInfo);
  });

  it.skip('should return minimal information when the requested case contact address has been sealed', async () => {
    const expectedSealedCaseInfo = {
      docketNumber: '101-18',
      isSealed: false,
    };

    let result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: mockCase,
    });

    expect(result).toMatchObject({
      docketNumber,
    });
    expect(getContactPrimary(result).address1).toBeUndefined();
  });

  it.skip('should return the case to the public user if the case is unsealed but has a sealed document', async () => {
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
