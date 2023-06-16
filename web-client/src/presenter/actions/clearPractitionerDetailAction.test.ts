import { clearPractitionerDetailAction } from './clearPractitionerDetailAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPractitionerDetailAction', () => {
  it('should set state.practitionerDetail to an empty object', async () => {
    const result = await runAction(clearPractitionerDetailAction, {
      state: { practitionerDetail: { barNumber: 'BN1234' } },
    });

    expect(result.state.practitionerDetail).toEqual({});
  });
});
