jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
import {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  SIGNED_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE, MOCK_CASE_WITHOUT_PENDING } from '@shared/test/mockCase';
import { PENDING_DOCKET_ENTRY } from '@shared/test/mockDocketEntry';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseAutomaticBlock } from './updateCaseAutomaticBlock';

describe('updateCaseAutomaticBlock', () => {
  let mockCase;

  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);
    applicationContext.getUniqueId.mockReturnValue('unique-id-1');
  });

  it('sets the case to automaticBlocked if it has pending documents', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);
    mockCase.docketEntries = [PENDING_DOCKET_ENTRY];

    const caseEntity = new Case(mockCase, {
      authorizedUser: mockDocketClerkUser,
    });
    const updatedCase = await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
    });
  });

  it('sets the case to automaticBlocked and if it has deadlines', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { deadline: 'something' } as any,
    ]);

    const caseEntity = new Case(MOCK_CASE_WITHOUT_PENDING, {
      authorizedUser: mockDocketClerkUser,
    });
    const updatedCase = await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
  });

  it('does not set the case to automaticBlocked if it already has a trial date', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      { deadline: 'something' } as any,
    ]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        trialDate: '2021-03-01T21:40:46.415Z',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const updateAutomaticBlockedSpy = jest.spyOn(
      caseEntity,
      'updateAutomaticBlocked',
    );

    const updatedCase = await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(updatedCase.automaticBlocked).toBeFalsy();
    expect(updateAutomaticBlockedSpy).not.toHaveBeenCalled();
  });

  it('should call updateAutomaticBlocked when the case has a trial date and also has a docketed stipulated decision', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        highPriority: false,
        trialDate: '2021-03-01T21:40:46.415Z',
        docketEntries: [
          {
            docketNumber: MOCK_CASE_WITHOUT_PENDING.docketNumber,
            eventCode: SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
            isOnDocketRecord: true,
          },
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const updateAutomaticBlockedSpy = jest.spyOn(
      caseEntity,
      'updateAutomaticBlocked',
    );

    await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(updateAutomaticBlockedSpy).toHaveBeenCalled();
  });

  it('sets the case to not automaticBlocked if the case does not have deadlines or pending items and the case is not generalDocketReadyForTrial status', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const caseEntity = new Case(MOCK_CASE_WITHOUT_PENDING, {
      authorizedUser: mockDocketClerkUser,
    });
    const updatedCase = await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
  });

  it('sets the case to not automaticBlocked if the case does not have deadlines or pending items and the case is generalDocketReadyForTrial status', async () => {
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
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
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
      caseEntity,
      hasCaseDeadline: true,
    });

    expect(getCaseDeadlinesByDocketNumber).not.toHaveBeenCalled();
  });
});
