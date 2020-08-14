const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
} = require('../../entities/EntityConstants');
const {
  MOCK_CASE,
  MOCK_CASE_WITHOUT_PENDING,
} = require('../../../test/mockCase');
const { Case } = require('../../entities/cases/Case');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { updateCaseAutomaticBlock } = require('./updateCaseAutomaticBlock');

describe('updateCaseAutomaticBlock', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext.getUniqueId.mockReturnValue('unique-id-1');
  });

  it('sets the case to automaticBlocked and calls deleteCaseTrialSortMappingRecords if it has pending documents', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([]);

    const caseEntity = new Case(MOCK_CASE, { applicationContext });
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('sets the case to automaticBlocked and calls deleteCaseTrialSortMappingRecords if it has deadlines', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        { deadline: 'something' },
      ]);

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
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('does not set the case to automaticBlocked or call deleteCaseTrialSortMappingRecords if it already has a trial date', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        { deadline: 'something' },
      ]);

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
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('sets the case to not automaticBlocked but does not call createCaseTrialSortMappingRecords if the case does not have deadlines or pending items and the case is not generalDocketReadyForTrial status', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([]);

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
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('sets the case to not automaticBlocked and calls createCaseTrialSortMappingRecords if the case does not have deadlines or pending items and the case is generalDocketReadyForTrial status', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
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
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });
});
