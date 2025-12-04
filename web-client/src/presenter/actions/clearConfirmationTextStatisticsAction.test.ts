import { clearConfirmationTextStatisticsAction } from './clearConfirmationTextStatisticsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearConfirmationTextStatisticsAction', () => {
  it('should clear state.confirmationText.statistics', async () => {
    const result = await Promise.resolve(
      runAction(clearConfirmationTextStatisticsAction, {
        state: { confirmationText: { statistics: { something: 'something' } } },
      }),
    );

    expect(result.state).toHaveProperty(['confirmationText', 'statistics'], {});
  });
});
