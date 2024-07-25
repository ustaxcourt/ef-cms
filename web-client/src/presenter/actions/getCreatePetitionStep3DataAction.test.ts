import { getCreatePetitionStep3DataAction } from '@web-client/presenter/actions/getCreatePetitionStep3DataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCreatePetitionStep3DataAction', () => {
  it('should fetch step 3 related data from state.form when user has IRS notice', async () => {
    const results = await runAction(getCreatePetitionStep3DataAction, {
      state: {
        form: {
          caseType: 'ROOT_LEVEL_CASE_TYPE',
          hasIrsNotice: 'TEST_hasIrsNotice',
          irsNoticesRedactionAcknowledgement:
            'TEST_irsNoticesRedactionAcknowledgement',
          testProps: 'testProps',
        },
        irsNoticeUploadFormInfo: [
          {
            caseType: 'IRS_NOTICE_CASE_TYPE',
            file: {},
            noticeIssuedDate: '2024-06-04T00:00:00.000-04:00',
          },
          {},
          {},
        ],
      },
    });

    const { createPetitionStep3Data } = results.output;
    expect(createPetitionStep3Data).toEqual({
      caseType: 'IRS_NOTICE_CASE_TYPE',
      hasIrsNotice: 'TEST_hasIrsNotice',
      hasUploadedIrsNotice: true,
      irsNotices: [
        {
          caseType: 'IRS_NOTICE_CASE_TYPE',
          file: {},
          noticeIssuedDate: '2024-06-04T00:00:00.000-04:00',
          noticeIssuedDateFormatted: '06/04/24',
        },
        {},
        {},
      ],
      irsNoticesRedactionAcknowledgement:
        'TEST_irsNoticesRedactionAcknowledgement',
    });
  });

  it('should fetch step 3 related data from state.form when user does not have IRS notice', async () => {
    const results = await runAction(getCreatePetitionStep3DataAction, {
      state: {
        form: {
          caseType: 'ROOT_LEVEL_CASE_TYPE',
          hasIrsNotice: false,
          irsNoticesRedactionAcknowledgement:
            'TEST_irsNoticesRedactionAcknowledgement',
          testProps: 'testProps',
        },
        irsNoticeUploadFormInfo: [{ caseType: 'IRS_NOTICE_CASE_TYPE' }, {}, {}],
      },
    });

    const { createPetitionStep3Data } = results.output;
    expect(createPetitionStep3Data).toEqual({
      caseType: 'ROOT_LEVEL_CASE_TYPE',
      hasIrsNotice: false,
      hasUploadedIrsNotice: false,
      irsNotices: [{ caseType: 'IRS_NOTICE_CASE_TYPE' }, {}, {}],
      irsNoticesRedactionAcknowledgement:
        'TEST_irsNoticesRedactionAcknowledgement',
    });
  });
});
