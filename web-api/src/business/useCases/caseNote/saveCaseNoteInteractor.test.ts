import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockJudgeUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { saveCaseNoteInteractor } from './saveCaseNoteInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';

describe('saveCaseNoteInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const upsertCases = jest.mocked(upsertCasesMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should throw an error when the user is not valid or authorized', async () => {
    await expect(
      saveCaseNoteInteractor(
        applicationContext,
        {
          caseNote: 'testing',
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should save a case note', async () => {
    await saveCaseNoteInteractor(
      applicationContext,
      {
        caseNote: 'This is my case note',
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockJudgeUser,
    );

    expect(upsertCases).toHaveBeenCalled();
    const casePassedToUpsert = upsertCases.mock.calls[0][0][0];
    expect(casePassedToUpsert.caseNote).toBe('This is my case note');
  });
});
