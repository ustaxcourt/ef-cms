import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getStep3DataAction', () => {
  it('should fetch step 3 related data from state.form', async () => {
    const results = await runAction(getStep3DataAction, {
      state: {
        form: {
          caseType: 'TEST_caseType',
          hasIrsNotice: 'TEST_hasIrsNotice',
          irsNoticesRedactionAcknowledgement:
            'TEST_irsNoticesRedactionAcknowledgement',
          testProps: 'testProps',
        },
        irsNoticeUploadFormInfo: [1, 2, 3],
      },
    });

    const { step3Data } = results.output;
    expect(step3Data).toEqual({
      caseType: 'TEST_caseType',
      hasIrsNotice: 'TEST_hasIrsNotice',
      irsNotices: [1, 2, 3],
      irsNoticesRedactionAcknowledgement:
        'TEST_irsNoticesRedactionAcknowledgement',
    });
  });
});
