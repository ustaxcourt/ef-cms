import {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
} from '../../entities/EntityConstants';
import { Case } from '../../entities/cases/Case';
import { MOCK_CASE, MOCK_CASE_WITHOUT_PENDING } from '../../../test/mockCase';
import { MOCK_USERS } from '../../../test/mockUsers';
import { PENDING_DOCKET_ENTRY } from '../../../test/mockDocketEntry';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { updateCaseAutomaticBlock } from './updateCaseAutomaticBlock';

describe('updateCaseAutomaticBlock', () => {
  let mockCase;
  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext.getUniqueId.mockReturnValue('unique-id-1');
  });

  it('sets the case to automaticBlocked and calls deleteCaseTrialSortMappingRecords if it has pending documents', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([]);
    mockCase.docketEntries = [PENDING_DOCKET_ENTRY];

    const caseEntity = new Case(mockCase, { applicationContext });
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
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        highPriority: false,
        trialDate: '2021-03-01T21:40:46.415Z',
      },
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

  it('does not set the case to automaticBlocked or call deleteCaseTrialSortMappingRecords when the case is marked as high priority', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        { deadline: 'something' },
      ]);
    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        highPriority: true,
        trialDate: undefined,
      },
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

  it('does not call createCaseTrialSortMappingRecords if the case has no trial city', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        preferredTrialCity: null,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
      {
        applicationContext,
      },
    );

    await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });
});
