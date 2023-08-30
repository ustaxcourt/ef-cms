import { runAction } from '@web-client/presenter/test.cerebral';
import { setUpdatedCaseInStateAction } from './setUpdatedCaseInStateAction';

describe('setUpdatedCaseInStateAction', () => {
  it('should update case in state correctly', async () => {
    const TEST_DOCKET_NUMBER = 'TEST_NUMBER';

    const { state } = await runAction(setUpdatedCaseInStateAction, {
      props: {
        updatedCase: { docketNumber: TEST_DOCKET_NUMBER, testProp: 'test' },
      },
      state: {
        judgeActivityReportData: {
          submittedAndCavCasesByJudge: [{ docketNumber: TEST_DOCKET_NUMBER }],
        },
      },
    });

    expect(
      state.judgeActivityReportData.submittedAndCavCasesByJudge[0].testProp,
    ).toBeDefined();
  });
});
