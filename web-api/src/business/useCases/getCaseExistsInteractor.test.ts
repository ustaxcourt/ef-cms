import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { getCaseExistsInteractor } from './getCaseExistsInteractor';
import { getCaseExists as getCaseExistsMock } from '@web-api/persistence/postgres/cases/getCaseExists';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('getCaseExistsInteractor', () => {
  const getCaseExists = jest.mocked(getCaseExistsMock);
  jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));

  it('should format the given docket number before querying persistence, removing leading zeroes and suffix', async () => {
    getCaseExists.mockResolvedValue(true);

    await getCaseExistsInteractor({
      docketNumber: '000123-19S',
    });

    expect(getCaseExists.mock.calls[0][0]).toEqual({
      docketNumber: '123-19',
    });
  });

  it('should throw an error when a case with the provided docketNumber is not found', async () => {
    getCaseExists.mockResolvedValue(false);

    await expect(
      getCaseExistsInteractor({
        docketNumber: '123-19',
      }),
    ).rejects.toThrow('Case 123-19 was not found.');
    expect(getCaseExists.mock.calls.length).toBe(1);
  });

  it('should return true a case with the provided docketNumber is found', async () => {
    getCaseExists.mockResolvedValue(true);

    await expect(
      getCaseExistsInteractor({
        docketNumber: '1000-01',
      }),
    ).resolves.toEqual(true);
    expect(getCaseExists).toHaveBeenCalled();
  });
});
