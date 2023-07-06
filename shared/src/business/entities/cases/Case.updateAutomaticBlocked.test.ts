import { AUTOMATIC_BLOCKED_REASONS } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE, MOCK_CASE_WITHOUT_PENDING } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('updateAutomaticBlocked', () => {
  it('sets the case as automaticBlocked with a valid blocked reason', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.automaticBlocked).toBeFalsy();

    caseToUpdate.updateAutomaticBlocked({});

    expect(caseToUpdate.automaticBlocked).toEqual(true);
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
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.automaticBlocked).toBeTruthy();

    caseToUpdate.updateAutomaticBlocked({});

    expect(caseToUpdate.automaticBlocked).toBeFalsy();
    expect(caseToUpdate.automaticBlockedReason).toBeUndefined();
    expect(caseToUpdate.automaticBlockedDate).toBeUndefined();
  });
});
