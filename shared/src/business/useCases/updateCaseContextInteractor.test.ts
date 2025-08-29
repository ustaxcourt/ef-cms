import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { CASE_STATUS_TYPES, CHIEF_JUDGE } from '../entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_CASE_WITH_TRIAL_SESSION,
  MOCK_CASE_WITHOUT_PENDING,
} from '../../test/mockCase';
import { MOCK_TRIAL_REMOTE } from '../../test/mockTrial';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { updateCaseContextInteractor } from './updateCaseContextInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { deleteCaseDeadline as deleteCaseDeadlineMock } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { upsertCaseDeadlines as upsertCaseDeadlinesMock } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { getCaseDeadlinesByConsolidatedCaseDeadlineIds as getCaseDeadlinesByConsolidatedCaseDeadlineIdsMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineIds';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

describe('updateCaseContextInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const deleteCaseDeadline = jest.mocked(deleteCaseDeadlineMock);
  const upsertCaseDeadlines = jest.mocked(upsertCaseDeadlinesMock);
  const getCaseDeadlinesByConsolidatedCaseDeadlineIds = jest.mocked(
    getCaseDeadlinesByConsolidatedCaseDeadlineIdsMock,
  );
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
    upsertCaseDeadlines.mockImplementation(deadlines => deadlines as any);
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue([]);
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    await expect(
      updateCaseContextInteractor(
        applicationContext,
        {
          caseStatus: CASE_STATUS_TYPES.cav,
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should call updateCase with the updated case status and return the updated case', async () => {
    getCaseByDocketNumber.mockResolvedValue(Promise.resolve(MOCK_CASE));

    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.cav,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );
    expect(result.status).toEqual(CASE_STATUS_TYPES.cav);
  });

  it('should not remove the case from trial if the old and new case status match', async () => {
    const rachaelId = 'dabbad00-18d0-43ec-bafb-654e83405416';
    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.new,
        docketNumber: MOCK_CASE.docketNumber,
        judgeData: {
          associatedJudge: 'Judge Rachael',
          associatedJudgeId: rachaelId,
        },
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.new);
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).not.toHaveBeenCalled();
  });

  it('should call updateCase and remove the case from trial if the old case status was calendared and the new case status is CAV', async () => {
    const rachaelId = 'dabbad00-18d0-43ec-bafb-654e83405416';

    getCaseByDocketNumber.mockResolvedValue(
      Promise.resolve(MOCK_CASE_WITH_TRIAL_SESSION),
    );

    getTrialSessionById.mockResolvedValue(MOCK_TRIAL_REMOTE);

    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.cav,
        docketNumber: MOCK_CASE_WITH_TRIAL_SESSION.docketNumber,
        judgeData: {
          associatedJudge: 'Judge Rachael',
          associatedJudgeId: rachaelId,
        },
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.cav);
    expect(result.associatedJudge).toEqual('Judge Rachael');
    expect(result.associatedJudgeId).toEqual(rachaelId);
    expect(result.trialSessionId).toBeUndefined();
  });

  it('should call updateCase and remove the case from trial if the old case status was calendared and the new case status is General Docket - Not At Issue', async () => {
    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.generalDocket,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    expect(result.associatedJudge).toEqual(CHIEF_JUDGE);
    expect(result.associatedJudgeId).toEqual(undefined);
    expect(result.trialSessionId).toBeUndefined();
  });

  it('should call updateCase if the old case status was Ready for Trial and the new status is different', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.generalDocket,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.generalDocket);
  });

  it('should remove case deadlines if case is status is closed', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { caseDeadlineId: '123' } as any,
    ]);
    deleteCaseDeadline.mockResolvedValue({} as any);

    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.closed,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.closed);
    expect(deleteCaseDeadline).toHaveBeenCalledWith({
      caseDeadlineId: '123',
    });
  });

  it('should unlink children case deadlines from the lead case deadlines if case is status is closed', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        leadDocketNumber: MOCK_CASE.docketNumber,
      }),
    );

    const LEAD_CASE_DEADLINE_ID = 'LEAD_CASE_DEADLINE_ID';
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { caseDeadlineId: LEAD_CASE_DEADLINE_ID } as any,
    ]);

    const CHILD_CASE_DEADLINE_ID = 'CHILD_CASE_DEADLINE_ID';
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue([
      {
        caseDeadlineId: CHILD_CASE_DEADLINE_ID,
        consolidatedCaseDeadlineId: 'TEST_CONSOLIDATED_CASE_DEADLINE_ID',
      } as any,
    ]);

    deleteCaseDeadline.mockResolvedValue({} as any);

    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.closed,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.closed);

    const deleteCaseDeadlineCalls = deleteCaseDeadline.mock.calls;
    expect(deleteCaseDeadlineCalls.length).toEqual(1);
    expect(deleteCaseDeadlineCalls[0][0]).toEqual({
      caseDeadlineId: LEAD_CASE_DEADLINE_ID,
    });

    const upsertCaseDeadlinesCalls = upsertCaseDeadlines.mock.calls;
    expect(upsertCaseDeadlinesCalls.length).toEqual(1);
    expect(upsertCaseDeadlinesCalls[0][0]).toEqual([
      {
        caseDeadlineId: CHILD_CASE_DEADLINE_ID,
        consolidatedCaseDeadlineId: undefined,
      },
    ]);
  });

  it('should not call "getCaseDeadlinesByConsolidatedCaseDeadlineIds" if there are no lead deadlines', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        leadDocketNumber: MOCK_CASE.docketNumber,
      }),
    );

    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const CHILD_CASE_DEADLINE_ID = 'CHILD_CASE_DEADLINE_ID';
    getCaseDeadlinesByConsolidatedCaseDeadlineIds.mockResolvedValue([
      {
        caseDeadlineId: CHILD_CASE_DEADLINE_ID,
        consolidatedCaseDeadlineId: 'TEST_CONSOLIDATED_CASE_DEADLINE_ID',
      } as any,
    ]);

    await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.closed,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    const getCaseDeadlinesByConsolidatedCaseDeadlineIdsCalls =
      getCaseDeadlinesByConsolidatedCaseDeadlineIds.mock.calls;
    expect(getCaseDeadlinesByConsolidatedCaseDeadlineIdsCalls.length).toEqual(
      0,
    );
  });

  it('should remove automatic block information if case status is closed', async () => {
    getCaseByDocketNumber.mockReturnValue({
      ...MOCK_CASE_WITHOUT_PENDING,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.closed,
        docketNumber: MOCK_CASE_WITHOUT_PENDING.docketNumber,
      },
      mockDocketClerkUser,
    );
    expect(result.automaticBlocked).toEqual(false);
    expect(result.automaticBlockedReason).toBeUndefined();
    expect(result.automaticBlockedDate).toBeUndefined();
  });

  it('should call updateCase if the case status is being updated to Ready for Trial and is not assigned to a trial session', async () => {
    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();

    expect(result.status).toEqual(CASE_STATUS_TYPES.generalDocketReadyForTrial);
  });

  it('should call updateCase if the case status is being updated to Ready for Trial and is already assigned to a trial session', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      trialDate: '2019-03-01T21:40:46.415Z',
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) => {
      return caseToUpdate;
    });

    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.generalDocketReadyForTrial);
    expect(updateCaseAndAssociations).toHaveBeenCalled();
  });

  it('should only update the associated judge without changing the status if only the associated judge is passed in', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      associatedJudge: 'Judge Buch',
      associatedJudgeId: 'buch-id',
      status: CASE_STATUS_TYPES.submitted,
    });

    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        judgeData: {
          associatedJudge: 'Judge Carluzzo',
          associatedJudgeId: 'carluzzo-id',
        },
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.submitted);
    expect(result.associatedJudge).toEqual('Judge Carluzzo');
    expect(result.associatedJudgeId).toEqual('carluzzo-id');
  });

  it('should only update the associated judge without changing the status if the associated judge and the same case status are passed in', async () => {
    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseStatus: CASE_STATUS_TYPES.submitted,
        docketNumber: MOCK_CASE.docketNumber,
        judgeData: {
          associatedJudge: 'Judge Carluzzo',
          associatedJudgeId: 'carluzzo-id',
        },
      },
      mockDocketClerkUser,
    );

    expect(result.status).toEqual(CASE_STATUS_TYPES.submitted);
    expect(result.associatedJudge).toEqual('Judge Carluzzo');
    expect(result.associatedJudgeId).toEqual('carluzzo-id');
  });

  it('should call updateCase with the updated case caption and return the updated case', async () => {
    const result = await updateCaseContextInteractor(
      applicationContext,
      {
        caseCaption: 'The new case caption',
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result.caseCaption).toEqual('The new case caption');
  });
});
