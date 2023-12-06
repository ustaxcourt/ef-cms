import { runAction } from '@web-client/presenter/test.cerebral';
import { setIrsNoticeFalseAction } from './setIrsNoticeFalseAction';

describe('setIrsNoticeFalseAction', () => {
  it('clears state.form irs date values and sets hasVerifiedIrsNotice to false', async () => {
    const { state } = await runAction(setIrsNoticeFalseAction, {
      state: {
        form: {
          hasVerifiedIrsNotice: true,
          irsDay: '26',
          irsMonth: '3',
          irsYear: '2012',
        },
      },
    });

    expect(state.form).toEqual({
      hasVerifiedIrsNotice: false,
      irsDay: '',
      irsMonth: '',
      irsYear: '',
    });
  });
});
