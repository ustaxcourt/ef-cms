import { clearIrsNoticeFormAction } from '@web-client/presenter/actions/clearIrsNoticeFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearIrsNoticeFormAction', () => {
  it('should clear irs notice form', async () => {
    const result = await runAction(clearIrsNoticeFormAction, {
      state: {
        form: {
          caseType: 'Deficiency',
          irsNoticesRedactionAcknowledgement: true,
        },
      },
    });

    expect(
      result.state.form.irsNoticesRedactionAcknowledgement,
    ).toBeUndefined();
    expect(result.state.form.caseType).toBeUndefined();
  });
});
