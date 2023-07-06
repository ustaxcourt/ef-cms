import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('unsetAsHighPriority', () => {
  it('unsets the case as high priority', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        highPriority: true,
        highPriorityReason: 'because reasons',
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.highPriority).toBeTruthy();

    caseToUpdate.unsetAsHighPriority();

    expect(caseToUpdate.highPriority).toBeFalsy();
    expect(caseToUpdate.highPriorityReason).toBeUndefined();
  });
});
