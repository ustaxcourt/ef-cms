jest.mock(
  '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords',
);
jest.mock(
  '@web-api/persistence/dynamo/cases/createCaseTrialSortMappingRecords',
);
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
import {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE, MOCK_CASE_WITHOUT_PENDING } from '@shared/test/mockCase';
import { PENDING_DOCKET_ENTRY } from '@shared/test/mockDocketEntry';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseAutomaticBlock } from './updateCaseAutomaticBlock';
import { deleteCaseTrialSortMappingRecords as deleteCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { createCaseTrialSortMappingRecords as createCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/createCaseTrialSortMappingRecords';

describe('updateCaseAutomaticBlock', () => {
  let mockCase;
  const deleteCaseTrialSortMappingRecords = jest.mocked(
    deleteCaseTrialSortMappingRecordsMock,
  );
  const createCaseTrialSortMappingRecords = jest.mocked(
    createCaseTrialSortMappingRecordsMock,
  );
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);
    applicationContext.getUniqueId.mockReturnValue('unique-id-1');
  });

  it('sets the case to automaticBlocked and calls deleteCaseTrialSortMappingRecords if it has pending documents', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);
    mockCase.docketEntries = [PENDING_DOCKET_ENTRY];

    const caseEntity = new Case(mockCase, {
      authorizedUser: mockDocketClerkUser,
    });
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
    });
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
  });

  it('sets the case to automaticBlocked and calls deleteCaseTrialSortMappingRecords if it has deadlines', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { deadline: 'something' } as any,
    ]);

    const caseEntity = new Case(MOCK_CASE_WITHOUT_PENDING, {
      authorizedUser: mockDocketClerkUser,
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
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
  });

  it('does not set the case to automaticBlocked or call deleteCaseTrialSortMappingRecords if it already has a trial date', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { deadline: 'something' } as any,
    ]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        highPriority: false,
        trialDate: '2021-03-01T21:40:46.415Z',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase.automaticBlocked).toBeFalsy();
    expect(deleteCaseTrialSortMappingRecords).not.toHaveBeenCalled();
  });

  it('does not set the case to automaticBlocked or call deleteCaseTrialSortMappingRecords when the case is marked as high priority', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { deadline: 'something' } as any,
    ]);
    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        highPriority: true,
        trialDate: undefined,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    const updatedCase = await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(updatedCase.automaticBlocked).toBeFalsy();
    expect(deleteCaseTrialSortMappingRecords).not.toHaveBeenCalled();
  });

  it('sets the case to not automaticBlocked but does not call createCaseTrialSortMappingRecords if the case does not have deadlines or pending items and the case is not generalDocketReadyForTrial status', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const caseEntity = new Case(MOCK_CASE_WITHOUT_PENDING, {
      authorizedUser: mockDocketClerkUser,
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
    expect(createCaseTrialSortMappingRecords).not.toHaveBeenCalled();
  });

  it('sets the case to not automaticBlocked and calls createCaseTrialSortMappingRecords if the case does not have deadlines or pending items and the case is generalDocketReadyForTrial status', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
      {
        authorizedUser: mockDocketClerkUser,
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
    expect(createCaseTrialSortMappingRecords).toHaveBeenCalled();
  });

  it('does not call createCaseTrialSortMappingRecords if the case has no trial city', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        preferredTrialCity: null,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

    expect(createCaseTrialSortMappingRecords).not.toHaveBeenCalled();
  });

  it('should not fetch deadlines from persistence when hasCaseDeadline is true', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        preferredTrialCity: null,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    await updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
      hasCaseDeadline: true,
    });

    expect(getCaseDeadlinesByDocketNumber).not.toHaveBeenCalled();
  });
});
