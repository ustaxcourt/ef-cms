import { clearConfirmationTextStatisticsAction } from './clearConfirmationTextStatisticsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearConfirmationTextStatisticsAction', () => {
  it('should clear state.confirmationText.statistics', async () => {
    const { state } = await runAction(clearConfirmationTextStatisticsAction, {
      state: { confirmationText: { statistics: { something: 'something' } } },
    });

    expect(state.confirmationText.statistics).toEqual({});
  });
});
