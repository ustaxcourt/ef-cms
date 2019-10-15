import { blockedCasesReportHelper as blockedCasesReportHelperComputed } from './blockedCasesReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const blockedCasesReportHelper = withAppContextDecorator(
  blockedCasesReportHelperComputed,
);

describe('blockedCasesReportHelper', () => {
  it('returns blockedCasesCount as undefined if blockedCases is not on the state', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {},
    });
    expect(result).toEqual({ blockedCasesCount: undefined });
  });

  it('returns blockedCasesCount as 0 if the blockedCases array is empty', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [],
      },
    });
    expect(result).toEqual({ blockedCasesCount: 0 });
  });

  it('returns blockedCasesCount as the length of the blockedCases array', () => {
    const result = runCompute(blockedCasesReportHelper, {
      state: {
        blockedCases: [{ caseId: '1' }, { caseId: '2' }, { caseId: '3' }],
      },
    });
    expect(result).toEqual({ blockedCasesCount: 3 });
  });
});
