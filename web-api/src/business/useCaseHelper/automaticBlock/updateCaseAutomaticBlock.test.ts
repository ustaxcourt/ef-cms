jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
);
import {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  TRACKED_DOCUMENT_TYPES_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE, MOCK_CASE_WITHOUT_PENDING } from '@shared/test/mockCase';
import { MOCK_CASE_DEADLINE } from '@shared/test/mockCaseDeadline';
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

  it('sets the case to automaticBlocked if it has pending items', async () => {
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

  it('sets the case to automaticBlocked when a served tracked entry has no persisted pending flag', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);
    const { pending, ...entryWithoutPendingFlag } = PENDING_DOCKET_ENTRY;
    expect(pending).toBe(true);
    expect(TRACKED_DOCUMENT_TYPES_EVENT_CODES).toContain(
      entryWithoutPendingFlag.eventCode,
    );
    mockCase.docketEntries = [entryWithoutPendingFlag];

    const caseEntity = new Case(mockCase, {
      authorizedUser: mockDocketClerkUser,
    });
    const updatedCase = await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(updatedCase).toMatchObject({
      automaticBlocked: true,
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
      hasPendingItems: true,
    });
  });

  it('sets the case to automaticBlocked if it has deadlines', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      new CaseDeadline(MOCK_CASE_DEADLINE),
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

  it('sets the case to automaticBlock if it has deadlines and pending items', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      new CaseDeadline(MOCK_CASE_DEADLINE),
    ]);
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
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
  });

  it('clears an existing automatic block when the case has a trial date', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        automaticBlocked: true,
        automaticBlockedDate: '2021-01-01T21:40:46.415Z',
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
        docketEntries: [PENDING_DOCKET_ENTRY],
        trialDate: '2021-03-01T21:40:46.415Z',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const updatedCase = await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(updatedCase.automaticBlocked).toBe(false);
    expect(updatedCase.automaticBlockedDate).toBeUndefined();
    expect(updatedCase.automaticBlockedReason).toBeUndefined();
  });

  it('clears the automatic block when the last pending item is removed from a case set for trial', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        automaticBlocked: true,
        automaticBlockedDate: '2021-01-01T21:40:46.415Z',
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
        trialDate: '2021-03-01T21:40:46.415Z',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const updatedCase = await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(updatedCase.automaticBlocked).toBe(false);
    expect(updatedCase.automaticBlockedReason).toBeUndefined();
  });

  it('sets automaticBlocked to false if the case does not have deadlines or pending items and the case is not generalDocketReadyForTrial status', async () => {
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

  it('does not fetch deadlines from persistence when the case has a trial date', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        trialDate: '2021-03-01T21:40:46.415Z',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    await updateCaseAutomaticBlock({
      caseEntity,
    });

    expect(getCaseDeadlinesByDocketNumber).not.toHaveBeenCalled();
  });

  describe('consolidated cases', () => {
    const MEMBER_DOCKET_NUMBER = '102-18';

    it('update its own automaticBlocked to true in consolidated cases if pending items is true', async () => {
      getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          consolidatedCases: [
            { ...MOCK_CASE, automaticBlocked: false },
            {
              ...MOCK_CASE,
              automaticBlocked: false,
              docketNumber: MEMBER_DOCKET_NUMBER,
            },
          ],
          docketEntries: [PENDING_DOCKET_ENTRY],
          leadDocketNumber: MOCK_CASE.docketNumber,
        },
        { authorizedUser: mockDocketClerkUser },
      );

      const updatedCase = await updateCaseAutomaticBlock({ caseEntity });

      expect(updatedCase.automaticBlockedReason).toBe(
        AUTOMATIC_BLOCKED_REASONS.pending,
      );
      expect(
        updatedCase.consolidatedCases.find(
          c => c.docketNumber === MOCK_CASE.docketNumber,
        )?.automaticBlocked,
      ).toBe(true); // changes to true
      expect(
        updatedCase.consolidatedCases.find(
          c => c.docketNumber === MEMBER_DOCKET_NUMBER,
        )?.automaticBlocked,
      ).toBe(false); // stays the same
    });

    it('clears its own automaticBlocked in consolidatedCases when the case has a trial date', async () => {
      getCaseDeadlinesByDocketNumber.mockResolvedValue([]);

      const caseEntity = new Case(
        {
          ...MOCK_CASE,
          automaticBlocked: true,
          automaticBlockedDate: '2021-01-01T21:40:46.415Z',
          automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
          consolidatedCases: [
            { ...MOCK_CASE, automaticBlocked: true },
            {
              ...MOCK_CASE,
              automaticBlocked: false,
              docketNumber: MEMBER_DOCKET_NUMBER,
            },
          ],
          docketEntries: [PENDING_DOCKET_ENTRY],
          leadDocketNumber: MOCK_CASE.docketNumber,
          trialDate: '2021-03-01T21:40:46.415Z',
        },
        { authorizedUser: mockDocketClerkUser },
      );

      const updatedCase = await updateCaseAutomaticBlock({
        caseEntity,
        hasCaseDeadline: true,
      });

      expect(updatedCase.hasPendingItems).toBe(true);
      expect(updatedCase.automaticBlocked).toBe(false);
      expect(updatedCase.automaticBlockedReason).toBeUndefined();
      expect(updatedCase.automaticBlockedDate).toBeUndefined();
      expect(
        updatedCase.consolidatedCases.find(
          c => c.docketNumber === MOCK_CASE.docketNumber,
        )?.automaticBlocked,
      ).toBe(false);
      expect(
        updatedCase.consolidatedCases.find(
          c => c.docketNumber === MEMBER_DOCKET_NUMBER,
        )?.automaticBlocked,
      ).toBe(false);
    });
  });
});
