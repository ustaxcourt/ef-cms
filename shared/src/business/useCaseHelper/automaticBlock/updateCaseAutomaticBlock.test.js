const {
  MOCK_CASE,
  MOCK_CASE_WITHOUT_PENDING,
} = require('../../../test/mockCase');
const { Case } = require('../../entities/cases/Case');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { updateCaseAutomaticBlock } = require('./updateCaseAutomaticBlock');

describe('updateCaseAutomaticBlock', () => {
  let applicationContext;
  const createCaseTrialSortMappingRecordsMock = jest.fn();
  const deleteCaseTrialSortMappingRecordsMock = jest.fn();
  let getCaseDeadlinesByCaseIdMock;

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext = {
      getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      getPersistenceGateway: () => ({
        createCaseTrialSortMappingRecords: createCaseTrialSortMappingRecordsMock,
        deleteCaseTrialSortMappingRecords: deleteCaseTrialSortMappingRecordsMock,
        getCaseDeadlinesByCaseId: getCaseDeadlinesByCaseIdMock,
      }),
    };
  });

  it('sets the case to automaticBlocked and calls deleteCaseTrialSortMappingRecords if it has pending documents', async () => {
    getCaseDeadlinesByCaseIdMock = jest.fn().mockReturnValue([]);

    const caseEntity = new Case(MOCK_CASE, { applicationContext });
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.pending,
    });
    expect(deleteCaseTrialSortMappingRecordsMock).toBeCalled();
  });

  it('sets the case to automaticBlocked and calls deleteCaseTrialSortMappingRecords if it has deadlines', async () => {
    getCaseDeadlinesByCaseIdMock = jest
      .fn()
      .mockReturnValue([{ deadline: 'something' }]);

    const caseEntity = new Case(MOCK_CASE_WITHOUT_PENDING, {
      applicationContext,
    });
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
    expect(deleteCaseTrialSortMappingRecordsMock).toBeCalled();
  });

  it('does not set the case to automaticBlocked or call deleteCaseTrialSortMappingRecords if it already has a trial date', async () => {
    getCaseDeadlinesByCaseIdMock = jest
      .fn()
      .mockReturnValue([{ deadline: 'something' }]);

    const caseEntity = new Case(
      { ...MOCK_CASE_WITHOUT_PENDING, trialDate: '2021-03-01T21:40:46.415Z' },
      {
        applicationContext,
      },
    );
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase.automaticBlocked).toBeFalsy();
    expect(deleteCaseTrialSortMappingRecordsMock).not.toBeCalled();
  });

  it('sets the case to not automaticBlocked but does not call createCaseTrialSortMappingRecords if the case does not have deadlines or pending items and the case is not generalDocketReadyForTrial status', async () => {
    getCaseDeadlinesByCaseIdMock = jest.fn().mockReturnValue([]);

    const caseEntity = new Case(MOCK_CASE_WITHOUT_PENDING, {
      applicationContext,
    });
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
    expect(createCaseTrialSortMappingRecordsMock).not.toBeCalled();
  });

  it('sets the case to not automaticBlocked and calls createCaseTrialSortMappingRecords if the case does not have deadlines or pending items and the case is generalDocketReadyForTrial status', async () => {
    getCaseDeadlinesByCaseIdMock = jest.fn().mockReturnValue([]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      },
      {
        applicationContext,
      },
    );
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
    expect(createCaseTrialSortMappingRecordsMock).toBeCalled();
  });
});
