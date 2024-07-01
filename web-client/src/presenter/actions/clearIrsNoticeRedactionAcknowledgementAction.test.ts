import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearIrsNoticeRedactionAcknowledgementAction } from '@web-client/presenter/actions/clearIrsNoticeRedactionAcknowledgementAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearIrsNoticeRedactionAcknowledgementAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should clear out irsNoticesRedactionAcknowledgement when there are no IRS notice files uploaded', async () => {
    const result = await runAction(
      clearIrsNoticeRedactionAcknowledgementAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: { irsNoticesRedactionAcknowledgement: true },
          irsNoticeUploadFormInfo: [],
        },
      },
    );

    expect(
      result.state.form.irsNoticesRedactionAcknowledgement,
    ).toBeUndefined();
  });

  it('should not clear out irsNoticesRedactionAcknowledgement when there are IRS notice files uploaded', async () => {
    const result = await runAction(
      clearIrsNoticeRedactionAcknowledgementAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: { irsNoticesRedactionAcknowledgement: true },
          irsNoticeUploadFormInfo: [{ file: 'file' }],
        },
      },
    );

    expect(result.state.form.irsNoticesRedactionAcknowledgement).toBeTruthy();
  });
});
