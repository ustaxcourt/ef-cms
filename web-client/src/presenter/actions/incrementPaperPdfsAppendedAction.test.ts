import { incrementPaperPdfsAppendedAction } from './incrementPaperPdfsAppendedAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('incrementPaperPdfsAppendedAction', () => {
  it('returns the yes path when form.contact.updatedEmail is defined', async () => {
    const result = await runAction(incrementPaperPdfsAppendedAction, {
      modules: { presenter },
      state: {
        paperServiceStatusState: {
          pdfsAppended: 0,
        },
      },
    });

    expect(result.state.paperServiceStatusState.pdfsAppended).toEqual(1);
  });
});
