import { CASE_STATUS_TYPES, CHIEF_JUDGE } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { petitionerUser, petitionsClerkUser } from '../../../test/mockUsers';
import { removeCaseFromTrialInteractor } from './removeCaseFromTrialInteractor';

describe('removeCaseFromTrialInteractor', () => {
  let mockLock;
  let mockUser;
  let mockTrialSession: RawTrialSession;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    mockUser = petitionsClerkUser;
    mockTrialSession = cloneDeep(MOCK_TRIAL_INPERSON);

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(mockTrialSession);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'someone',
        trialDate: '2018-03-01T00:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: '9047d1ab-18d0-43ec-bafb-654e83405416',
      });

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(v => v.caseToUpdate);
  });

  it('should throw an error when the user is unauthorized to remove a case from a trial session', async () => {
    mockUser = petitionerUser;

    await expect(
      removeCaseFromTrialInteractor(applicationContext, {
        associatedJudge: '123',
        caseStatus: 'new',
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByDocketNumber, and updateCase persistence methods with correct parameters for a calendared session', async () => {
    mockTrialSession.isCalendared = true;

    await removeCaseFromTrialInteractor(applicationContext, {
      associatedJudge: '123',
      caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: mockTrialSession.trialSessionId!,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0].trialSessionId,
    ).toEqual(mockTrialSession.trialSessionId);
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...mockTrialSession,
      caseOrder: [
        {
          disposition: 'because',
          docketNumber: MOCK_CASE.docketNumber,
          removedFromTrial: true,
        },
        { docketNumber: '123-45' },
      ],
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      docketNumber: MOCK_CASE.docketNumber,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByDocketNumber, updateCaseAutomaticBlock, and updateCase persistence methods with correct parameters for a not calendared session', async () => {
    mockTrialSession.isCalendared = false;

    await removeCaseFromTrialInteractor(applicationContext, {
      associatedJudge: '123',
      caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0].trialSessionId,
    ).toEqual(MOCK_TRIAL_INPERSON.trialSessionId);
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_INPERSON,
      caseOrder: [{ docketNumber: '123-45' }],
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock.mock
        .calls[0][0].caseEntity,
    ).toMatchObject({ docketNumber: '101-18' });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      docketNumber: MOCK_CASE.docketNumber,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('updates work items to be not high priority', async () => {
    mockTrialSession.isCalendared = true;

    await removeCaseFromTrialInteractor(applicationContext, {
      associatedJudge: '123',
      caseStatus: 'New',
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
    });

    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems.mock
        .calls[0][0],
    ).toMatchObject({
      highPriority: false,
    });
  });

  it('should not call createCaseTrialSortMappingRecords if case is missing trial city', async () => {
    mockTrialSession.isCalendared = true;

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'someone',
        preferredTrialCity: null,
        trialDate: '2018-03-01T00:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      });

    await removeCaseFromTrialInteractor(applicationContext, {
      associatedJudge: '123',
      caseStatus: 'New',
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByDocketNumber, and updateCase persistence methods with correct parameters for a non-calendared hearing', async () => {
    mockTrialSession.isCalendared = false;
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'someone',
        hearings: [mockTrialSession],
        trialDate: '2019-08-25T05:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      });

    await removeCaseFromTrialInteractor(applicationContext, {
      associatedJudge: '123',
      caseStatus: 'New',
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock
        .calls[0][0].trialSessionId,
    ).toEqual(MOCK_TRIAL_INPERSON.trialSessionId);
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_INPERSON,
      caseOrder: [{ docketNumber: '123-45' }],
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      hearings: [],
    });
  });

  it('sets the associatedJudge and caseStatus when provided', async () => {
    mockTrialSession.isCalendared = true;

    const result = await removeCaseFromTrialInteractor(applicationContext, {
      associatedJudge: 'Judge Dredd',
      caseStatus: CASE_STATUS_TYPES.cav,
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
    });

    expect(result.associatedJudge).toEqual('Judge Dredd');
    expect(result.status).toEqual(CASE_STATUS_TYPES.cav);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      removeCaseFromTrialInteractor(applicationContext, {
        associatedJudge: 'Judge Dredd',
        caseStatus: CASE_STATUS_TYPES.cav,
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await removeCaseFromTrialInteractor(applicationContext, {
      associatedJudge: 'Judge Dredd',
      caseStatus: CASE_STATUS_TYPES.cav,
      disposition: 'because',
      docketNumber: MOCK_CASE.docketNumber,
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
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
