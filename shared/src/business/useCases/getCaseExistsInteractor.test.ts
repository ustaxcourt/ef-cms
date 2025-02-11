import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseExistsInteractor } from './getCaseExistsInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';

describe('getCaseExistsInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCase = updateCaseMock as jest.Mock;
  updateCase.mockImplementation(c => c.caseToUpdate);

  it('should format the given docket number before querying persistence, removing leading zeroes and suffix', async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    await getCaseExistsInteractor(applicationContext, {
      docketNumber: '000123-19S',
    });

    expect(getCaseByDocketNumber.mock.calls[0][0]).toEqual({
      applicationContext,
      docketNumber: '123-19',
    });
  });

  it('should throw an error when a case with the provided docketNumber is not found', async () => {
    getCaseByDocketNumber.mockResolvedValue({});

    await expect(
      getCaseExistsInteractor(applicationContext, {
        docketNumber: '123-19',
      }),
    ).rejects.toThrow('Case 123-19 was not found.');
    expect(getCaseByDocketNumber.mock.calls.length).toBe(1);
  });

  it('should return true a case with the provided docketNumber is found', async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    await expect(
      getCaseExistsInteractor(applicationContext, {
        docketNumber: '1000-01',
      }),
    ).resolves.toEqual(true);
    expect(getCaseByDocketNumber).toHaveBeenCalled();
  });
});
