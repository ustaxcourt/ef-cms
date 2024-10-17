import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockJudgeUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { saveCaseNoteInteractor } from './saveCaseNoteInteractor';

describe('saveCaseNoteInteractor', () => {
  let mockLock;
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);
  });
  it('throws an error if the user is not valid or authorized', async () => {
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

  it('saves a case note', async () => {
    const result = await saveCaseNoteInteractor(
      applicationContext,
      {
        caseNote: 'This is my case note',
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockJudgeUser,
    );

    expect(result).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.caseNote).toEqual('This is my case note');
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      saveCaseNoteInteractor(
        applicationContext,
        {
          caseNote: 'This is my case note',
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await saveCaseNoteInteractor(
      applicationContext,
      {
        caseNote: 'This is my case note',
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockJudgeUser,
    );

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
