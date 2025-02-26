import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { getCaseExistsInteractor } from './getCaseExistsInteractor';
import { getCaseMetadataByDocketNumber as getCaseMetadataByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';

describe('getCaseExistsInteractor', () => {
  const getCaseMetadataByDocketNumber =
    getCaseMetadataByDocketNumberMock as jest.Mock;
  const updateCase = updateCaseMock as jest.Mock;
  updateCase.mockImplementation(c => c.caseToUpdate);

  it('should format the given docket number before querying persistence, removing leading zeroes and suffix', async () => {
    getCaseMetadataByDocketNumber.mockResolvedValue(MOCK_CASE);

    await getCaseExistsInteractor({
      docketNumber: '000123-19S',
    });

    expect(getCaseMetadataByDocketNumber.mock.calls[0][0]).toEqual({
      docketNumber: '123-19',
    });
  });

  it('should throw an error when a case with the provided docketNumber is not found', async () => {
    getCaseMetadataByDocketNumber.mockResolvedValue(undefined);

    await expect(
      getCaseExistsInteractor({
        docketNumber: '123-19',
      }),
    ).rejects.toThrow('Case 123-19 was not found.');
    expect(getCaseMetadataByDocketNumber.mock.calls.length).toBe(1);
  });

  it('should return true a case with the provided docketNumber is found', async () => {
    getCaseMetadataByDocketNumber.mockResolvedValue(MOCK_CASE);

    await expect(
      getCaseExistsInteractor({
        docketNumber: '1000-01',
      }),
    ).resolves.toEqual(true);
    expect(getCaseMetadataByDocketNumber).toHaveBeenCalled();
  });
});
