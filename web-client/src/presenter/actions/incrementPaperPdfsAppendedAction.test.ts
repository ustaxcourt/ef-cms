import { incrementPaperPdfsAppendedAction } from './incrementPaperPdfsAppendedAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('incrementPaperPdfsAppendedAction', () => {
  it('returns the yes path when form.contact.updatedEmail is defined', async () => {
    const result = await runAction(incrementPaperPdfsAppendedAction, {
      modules: { presenter },
      props: {
        pdfsAppended: 10,
      },
      state: {
        paperServiceStatusState: {
          pdfsAppended: 0,
        },
      },
    });

    expect(result.state.paperServiceStatusState.pdfsAppended).toEqual(10);
  });
});
