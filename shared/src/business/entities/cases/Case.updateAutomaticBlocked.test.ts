import { AUTOMATIC_BLOCKED_REASONS } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE, MOCK_CASE_WITHOUT_PENDING } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';

describe('updateAutomaticBlocked', () => {
  it('sets the case as automaticBlocked with a valid blocked reason', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        consolidatedCases: [
          new ConsolidatedCaseSummary(MOCK_CASE).toRawObject(),
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.automaticBlocked).toBeFalsy();

    caseToUpdate.updateAutomaticBlocked({ hasCaseDeadline: false });

    expect(caseToUpdate.automaticBlocked).toEqual(true);
    expect(caseToUpdate.consolidatedCases[0].automaticBlocked).toEqual(true);
    expect(caseToUpdate.automaticBlockedReason).toEqual(
      AUTOMATIC_BLOCKED_REASONS.pending,
    );
    expect(caseToUpdate.automaticBlockedDate).toBeDefined();
    expect(caseToUpdate.isValid()).toBeTruthy();
  });

  it('unsets the case as automatic blocked', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        automaticBlocked: true,
        automaticBlockedReason: 'because reasons',
        consolidatedCases: [
          new ConsolidatedCaseSummary(MOCK_CASE_WITHOUT_PENDING).toRawObject(),
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseToUpdate.automaticBlocked).toBeTruthy();

    caseToUpdate.updateAutomaticBlocked({ hasCaseDeadline: false });

    expect(caseToUpdate.consolidatedCases[0].automaticBlocked).toBeFalsy();
    expect(caseToUpdate.automaticBlocked).toBeFalsy();
    expect(caseToUpdate.automaticBlockedReason).toBeUndefined();
    expect(caseToUpdate.automaticBlockedDate).toBeUndefined();
  });

  it('does not automatically block a case that has a trial date, even when it has pending items and a deadline', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        consolidatedCases: [
          new ConsolidatedCaseSummary(MOCK_CASE).toRawObject(),
        ],
        trialDate: '2025-03-01T00:00:00.000Z',
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    caseToUpdate.updateAutomaticBlocked({ hasCaseDeadline: true });

    expect(caseToUpdate.hasPendingItems).toEqual(true);
    expect(caseToUpdate.automaticBlocked).toEqual(false);
    expect(caseToUpdate.automaticBlockedReason).toBeUndefined();
    expect(caseToUpdate.automaticBlockedDate).toBeUndefined();
    expect(caseToUpdate.consolidatedCases[0].automaticBlocked).toEqual(false);
  });

  it('clears a stale automatic block on a case that has since been set for trial', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        automaticBlocked: true,
        automaticBlockedDate: '2019-03-01T21:42:29.073Z',
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
        trialDate: '2025-03-01T00:00:00.000Z',
        trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    caseToUpdate.updateAutomaticBlocked({ hasCaseDeadline: false });

    expect(caseToUpdate.automaticBlocked).toEqual(false);
    expect(caseToUpdate.automaticBlockedReason).toBeUndefined();
    expect(caseToUpdate.automaticBlockedDate).toBeUndefined();
    expect(caseToUpdate.isValid()).toBeTruthy();
  });

  it('automatically blocks for both reasons when the case has pending items and a deadline and no trial date', () => {
    const caseToUpdate = new Case(MOCK_CASE, {
      authorizedUser: mockDocketClerkUser,
    });

    caseToUpdate.updateAutomaticBlocked({ hasCaseDeadline: true });

    expect(caseToUpdate.automaticBlocked).toEqual(true);
    expect(caseToUpdate.automaticBlockedReason).toEqual(
      AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    );
  });

  it('automatically blocks for a due date when the case has a deadline but no pending items', () => {
    const caseToUpdate = new Case(MOCK_CASE_WITHOUT_PENDING, {
      authorizedUser: mockDocketClerkUser,
    });

    caseToUpdate.updateAutomaticBlocked({ hasCaseDeadline: true });

    expect(caseToUpdate.automaticBlocked).toEqual(true);
    expect(caseToUpdate.automaticBlockedReason).toEqual(
      AUTOMATIC_BLOCKED_REASONS.dueDate,
    );
  });
});
