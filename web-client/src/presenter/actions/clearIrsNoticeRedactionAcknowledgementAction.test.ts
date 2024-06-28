import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearIrsNoticeRedactionAcknowledgementAction } from '@web-client/presenter/actions/clearIrsNoticeRedactionAcknowledgementAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearIrsNoticeRedactionAcknowledgementAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should clear out irsNoticesRedactionAcknowledgement', async () => {
    const result = await runAction(
      clearIrsNoticeRedactionAcknowledgementAction,
      {
        modules: {
          presenter,
        },
        state: {
          irsNoticesRedactionAcknowledgement: true,
        },
      },
    );

    expect(
      result.state.form.irsNoticesRedactionAcknowledgement,
    ).toBeUndefined();
  });
});
