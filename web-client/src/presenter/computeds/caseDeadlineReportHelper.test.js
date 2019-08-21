import { caseDeadlineReportHelper as caseDeadlineReportHelperComputed } from './caseDeadlineReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseDeadlineReportHelper = withAppContextDecorator(
  caseDeadlineReportHelperComputed,
);

describe('caseDeadlineReportHelper', () => {
  it('should run without state', () => {
    let result = runCompute(caseDeadlineReportHelper, {
      state: {},
    });
    expect(result.caseDeadlineCount).toEqual(0);
    expect(result.caseDeadlines).toEqual([]);
    expect(result.formattedFilterDate).toBeTruthy();
  });
});
