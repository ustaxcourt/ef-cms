import { attorneyListHelper } from './attorneyListHelper';
import { runCompute } from 'cerebral/test';

describe('attorneyListHelper', () => {
  it('combines practitionerUsers, respondentUsers, inactivePractitionerUsers, and inactiveRespondentUsers into a single array attorneyUsers', () => {
    const result = runCompute(attorneyListHelper, {
      state: {
        inactivePractitionerUsers: [{ userId: '5' }],
        inactiveRespondentUsers: [],
        practitionerUsers: [{ userId: '1' }, { userId: '2' }],
        respondentUsers: [{ userId: '3' }, { userId: '4' }],
      },
    });

    expect(result.attorneyUsers).toEqual([
      { userId: '1' },
      { userId: '2' },
      { userId: '3' },
      { userId: '4' },
      { userId: '5' },
    ]);
  });
});
