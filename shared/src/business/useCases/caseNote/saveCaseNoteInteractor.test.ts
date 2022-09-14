import { applicationContext } from '../../test/createTestApplicationContext';
import { MOCK_CASE } from '../../../test/mockCase';
import { ROLES } from '../../entities/EntityConstants';
import { saveCaseNoteInteractor } from './saveCaseNoteInteractor';
import { User } from '../../entities/User';

describe('saveCaseNoteInteractor', () => {
  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      saveCaseNoteInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        caseNote: 'testing',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('saves a case note', async () => {
    const mockJudge = new User({
      name: 'Judge Colvin',
      role: ROLES.judge,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockReturnValue(mockJudge);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);

    const result = await saveCaseNoteInteractor(applicationContext, {
      caseNote: 'This is my case note',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.caseNote).toEqual('This is my case note');
  });
});
