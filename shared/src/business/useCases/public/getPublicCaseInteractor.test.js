const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { cloneDeep } = require('lodash');
const { getContactPrimary } = require('../../entities/cases/Case');
const { getPublicCaseInteractor } = require('./getPublicCaseInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { PARTY_TYPES } = require('../../entities/EntityConstants');

const mockCaseContactPrimary = getContactPrimary(MOCK_CASE);

const mockCase = {
  docketNumber: '123-45',
  hasSealedDocuments: false,
  irsPractitioners: [],
  partyType: PARTY_TYPES.petitioner,
  petitioners: [mockCaseContactPrimary],
};

const sealedDocketEntries = cloneDeep(MOCK_CASE.docketEntries);
sealedDocketEntries[0].isLegacySealed = true;

const normalSealedDocketEntries = cloneDeep(MOCK_CASE.docketEntries);
normalSealedDocketEntries[0].isSealed = true;

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
    docketEntries: sealedDocketEntries,
    docketNumber: '120-20',
    hasSealedDocuments: true,
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
    docketEntries: normalSealedDocketEntries,
  },
};

describe('getPublicCaseInteractor', () => {
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
      isSealed: true,
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

  it.only('should return the case to the public user if the case is unsealed but has a sealed document', async () => {
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
