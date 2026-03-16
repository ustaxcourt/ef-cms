import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { MOCK_CASE } from '@shared/test/mockCase';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deleteCaseNoteInteractor } from './deleteCaseNoteInteractor';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';

describe('deleteCaseNoteInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const upsertCases = jest.mocked(upsertCasesMock);

  let mockUser: AuthUser;

  beforeEach(() => {
    mockUser = mockJudgeUser;
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      caseNote: 'existing note',
    });
  });

  it('should throw an error when the user is not valid or authorized', async () => {
    mockUser = {} as AuthUser;
    let error;
    try {
      await deleteCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockUser,
      );
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(upsertCases).not.toHaveBeenCalled();
  });

  it('should delete a case note', async () => {
    await deleteCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockUser,
    );

    expect(upsertCases).toHaveBeenCalled();
    const casePassedToUpsert = upsertCases.mock.calls[0][0][0];
    expect(casePassedToUpsert.caseNote).toBeUndefined();
  });
});
