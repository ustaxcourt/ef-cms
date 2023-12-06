import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ROLES } from '../../entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
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
  });
  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      saveCaseNoteInteractor(applicationContext, {
        caseNote: 'testing',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('saves a case note', async () => {
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

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      saveCaseNoteInteractor(applicationContext, {
        caseNote: 'This is my case note',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await saveCaseNoteInteractor(applicationContext, {
      caseNote: 'This is my case note',
      docketNumber: MOCK_CASE.docketNumber,
    });

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
