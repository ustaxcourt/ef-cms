import { getPaperServiceSuccessMessageAction } from './getPaperServiceSuccessMessageAction';
import { runAction } from 'cerebral/test';

describe('getPaperServiceSuccessMessageAction', () => {
  it('returns the paper service success alert', async () => {
    const results = await runAction(getPaperServiceSuccessMessageAction, {
      state: {},
    });

    expect(results.output.alertSuccess).toEqual({
      message: 'Your entry has been added to the docket record.',
    });
  });
});
