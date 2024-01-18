import { DOCKET_ENTRY_SEALED_TO_TYPES } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { formatPublicCase } from './formatPublicCase';
import { getContactPrimary } from '../../entities/cases/Case';

describe('getPublicCaseInteractor', () => {
  const mockCaseContactPrimary = getContactPrimary(MOCK_CASE);

  const sealedDocketEntries = cloneDeep(MOCK_CASE.docketEntries);
  sealedDocketEntries[0].isSealed = true;
  sealedDocketEntries[0].sealedTo = DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC;

  const sealedContactPrimary = cloneDeep({
    ...mockCaseContactPrimary,
    isSealed: true,
  });

  const mockCase = {
    ...cloneDeep(MOCK_CASE),
    irsPractitioners: [],
    petitioners: [mockCaseContactPrimary],
  };

  it('should return a PublicCase entity with no petitioners array when the requested case has been sealed', async () => {
    const expectedSealedCaseInfo = {
      docketNumber: '101-18',
      isSealed: true,
    };

    const sealedCase = {
      ...mockCase,
      isSealed: true,
      sealedDate: '2020-04-29T15:53:09.650Z',
    };

    let result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: sealedCase,
    });

    expect(result).toMatchObject(expectedSealedCaseInfo);
    expect(result.petitioners).toBeUndefined();

    delete sealedCase.isSealed;

    result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: sealedCase,
    });

    expect(result).toMatchObject(expectedSealedCaseInfo);
    expect(result.petitioners).toBeUndefined();
  });

  it('should return a PublicCase entity with PublicContact entities for petitioners when the requested case has a sealed docket entry', async () => {
    const expectedSealedCaseInfo = {
      docketNumber: '101-18',
      isSealed: false,
    };

    let result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: {
        ...mockCase,
        docketEntries: sealedDocketEntries,
      },
    });

    expect(result.petitioners).toBeDefined();
    result.petitioners!.forEach(petitioner => {
      expect(petitioner.entityName).toEqual('PublicContact');
      expect(petitioner).not.toMatchObject({
        address1: 'address 1',
        email: 'email 1',
      });
    });

    expect(result).toMatchObject(expectedSealedCaseInfo);
  });

  it('should return a PublicCase entity with PublicContact entities for petitioners when the requested case contact address has been sealed', async () => {
    const expectedSealedCaseInfo = {
      docketNumber: '101-18',
      isSealed: false,
    };

    let result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: { ...mockCase, petitioners: [sealedContactPrimary] },
    });

    expect(result.petitioners).toBeDefined();
    result.petitioners!.forEach(petitioner => {
      expect(petitioner.entityName).toEqual('PublicContact');
      expect(petitioner).not.toMatchObject({
        address1: 'address 1',
        email: 'email 1',
      });
    });

    expect(result).toMatchObject(expectedSealedCaseInfo);
  });

  it('should return a PublicCase entity with PublicContact entities for petitioners when nothing has been sealed', async () => {
    const expectedSealedCaseInfo = {
      docketNumber: '101-18',
      isSealed: false,
    };

    let result = await formatPublicCase({
      applicationContext,
      rawCaseRecord: mockCase,
    });

    expect(result.petitioners).toBeDefined();
    result.petitioners!.forEach(petitioner => {
      expect(petitioner.entityName).toEqual('PublicContact');
      expect(petitioner).not.toMatchObject({
        address1: 'address 1',
        email: 'email 1',
      });
    });

    expect(result).toMatchObject(expectedSealedCaseInfo);
  });
});
