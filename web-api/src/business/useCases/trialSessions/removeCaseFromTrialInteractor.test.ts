import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workItem/mocks.jest';
import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { MOCK_TRIAL_INPERSON } from '../../../../../shared/src/test/mockTrial';
import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { removeCaseFromTrialInteractor } from './removeCaseFromTrialInteractor';

describe('removeCaseFromTrialInteractor', () => {
  let mockLock;
  let mockTrialSession: RawTrialSession;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    mockTrialSession = cloneDeep(MOCK_TRIAL_INPERSON);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(mockTrialSession);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: 'someone',
        associatedJudgeId: 'cb8b3a61-9c52-4b1f-b68b-f725656a9a0e',
        trialDate: '2018-03-01T00:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: '9047d1ab-18d0-43ec-bafb-654e83405416',
      });

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(v => v.caseToUpdate);
  });

  it('should throw an error when the user is unauthorized to remove a case from a trial session', async () => {
    await expect(
      removeCaseFromTrialInteractor(
        applicationContext,
        {
          associatedJudge: '123',
          associatedJudgeId: '67f246a0-8803-4aef-bbd2-687ef57e3e3f',
          caseStatus: 'new',
          disposition: 'because',
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByDocketNumber, and updateCase persistence methods with correct parameters for a calendared session', async () => {
    mockTrialSession.isCalendared = true;

    await removeCaseFromTrialInteractor(
      applicationContext,
      {
        associatedJudge: '123',
        associatedJudgeId: '67f246a0-8803-4aef-bbd2-687ef57e3e3f',
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: mockTrialSession.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

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
      associatedJudgeId: undefined,
      docketNumber: MOCK_CASE.docketNumber,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseByDocketNumber, updateCaseAutomaticBlock, and updateCase persistence methods with correct parameters for a not calendared session', async () => {
    mockTrialSession.isCalendared = false;

    await removeCaseFromTrialInteractor(
      applicationContext,
      {
        associatedJudge: '123',
        associatedJudgeId: '67f246a0-8803-4aef-bbd2-687ef57e3e3f',
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

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
      associatedJudgeId: undefined,
      docketNumber: MOCK_CASE.docketNumber,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });

  it('updates work items to be not high priority', async () => {
    mockTrialSession.isCalendared = true;

    await removeCaseFromTrialInteractor(
      applicationContext,
      {
        associatedJudge: '123',
        associatedJudgeId: '67f246a0-8803-4aef-bbd2-687ef57e3e3f',
        caseStatus: 'New',
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

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
        associatedJudgeId: 'cb8b3a61-9c52-4b1f-b68b-f725656a9a0e',
        preferredTrialCity: null,
        trialDate: '2018-03-01T00:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      });

    await removeCaseFromTrialInteractor(
      applicationContext,
      {
        associatedJudge: '123',
        associatedJudgeId: '67f246a0-8803-4aef-bbd2-687ef57e3e3f',
        caseStatus: 'New',
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

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
        associatedJudgeId: 'cb8b3a61-9c52-4b1f-b68b-f725656a9a0e',
        hearings: [mockTrialSession],
        trialDate: '2019-08-25T05:00:00.000Z',
        trialLocation: 'Boise, Idaho',
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      });

    await removeCaseFromTrialInteractor(
      applicationContext,
      {
        associatedJudge: '123',
        associatedJudgeId: '67f246a0-8803-4aef-bbd2-687ef57e3e3f',
        caseStatus: 'New',
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

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

    const result = await removeCaseFromTrialInteractor(
      applicationContext,
      {
        associatedJudge: 'Judge Dredd',
        associatedJudgeId: 'e5eaf0ac-6a1f-4a5d-a44d-d59f199b7ab5',
        caseStatus: CASE_STATUS_TYPES.cav,
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

    expect(result.associatedJudge).toEqual('Judge Dredd');
    expect(result.associatedJudgeId).toEqual(
      'e5eaf0ac-6a1f-4a5d-a44d-d59f199b7ab5',
    );
    expect(result.status).toEqual(CASE_STATUS_TYPES.cav);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      removeCaseFromTrialInteractor(
        applicationContext,
        {
          associatedJudge: 'Judge Dredd',
          associatedJudgeId: 'e5eaf0ac-6a1f-4a5d-a44d-d59f199b7ab5',
          caseStatus: CASE_STATUS_TYPES.cav,
          disposition: 'because',
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await removeCaseFromTrialInteractor(
      applicationContext,
      {
        associatedJudge: 'Judge Dredd',
        associatedJudgeId: 'e5eaf0ac-6a1f-4a5d-a44d-d59f199b7ab5',
        caseStatus: CASE_STATUS_TYPES.cav,
        disposition: 'because',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
      mockPetitionsClerkUser,
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
