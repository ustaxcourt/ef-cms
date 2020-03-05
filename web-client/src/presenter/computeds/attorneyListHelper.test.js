import { attorneyListHelper } from './attorneyListHelper';
import { runCompute } from 'cerebral/test';

describe('attorneyListHelper', () => {
  it('combines state.practitionerUsers and state.respondentUsers into a single array attorneyUsers', () => {
    const result = runCompute(attorneyListHelper, {
      state: {
        practitionerUsers: [{ userId: '1' }, { userId: '2' }],
        respondentUsers: [{ userId: '3' }, { userId: '4' }],
      },
    });

    expect(result.attorneyUsers).toEqual([
      { userId: '1' },
      { userId: '2' },
      { userId: '3' },
      { userId: '4' },
    ]);
  });
});
