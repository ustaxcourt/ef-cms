import {
  CustomCaseReportState,
  initialCustomCaseReportState,
} from '../customCaseReportState';
import { resetCustomCaseReportStateAction } from './resetCustomCaseReportStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetCustomCaseReportStateAction', () => {
  it('resets the customCaseReport back to its default state', async () => {
    const modifiedcustomCaseReport: CustomCaseReportState = {
      ...initialCustomCaseReportState,
      totalCases: 124,
    };

    const { state } = await runAction(resetCustomCaseReportStateAction, {
      state: {
        customCaseReport: modifiedcustomCaseReport,
      },
    });

    expect(state.customCaseReport).toEqual(initialCustomCaseReportState);
  });
});
