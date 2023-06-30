import { incrementProcessedCasesAction } from './incrementProcessedCasesAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('incrementProcessedCasesAction', () => {
  it('returns the yes path when form.contact.updatedEmail is defined', async () => {
    const result = await runAction(incrementProcessedCasesAction, {
      modules: { presenter },
      state: {
        noticeStatusState: {
          casesProcessed: 0,
        },
      },
    });

    expect(result.state.noticeStatusState.casesProcessed).toEqual(1);
  });
});
