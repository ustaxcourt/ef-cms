jest.mock('@web-api/persistence/postgres/cases/updateCaseNote');
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockJudgeUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { saveCaseNoteInteractor } from './saveCaseNoteInteractor';
import { updateCaseNote as updateCaseNoteMock } from '@web-api/persistence/postgres/cases/updateCaseNote';

describe('saveCaseNoteInteractor', () => {
  const updateCaseNote = jest.mocked(updateCaseNoteMock);

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

    expect(updateCaseNote).toHaveBeenCalledWith({
      caseNote: 'This is my case note',
      docketNumber: MOCK_CASE.docketNumber,
    });
  });
});
