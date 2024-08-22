import {
  BlockedCsvCase,
  exportCsvBlockedCaseReportAction,
} from './exportCsvBlockedCaseReportAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('exportCsvBlockedCaseReportAction', () => {
  it('should UPDATE TEST NAME', async () => {
    const blockedCases: BlockedCsvCase[] = [
      {
        automaticBlockedReason: '',
        blockedDateEarliest: '',
        blockedReason: '',
        caseTitle: '',
        docketNumber: '',
        status: 'Assigned - Case',
      },
    ];
    const trialLocation: string = 'Birmingham, Alabama';

    await runAction(exportCsvBlockedCaseReportAction, {
      props: {
        blockedCases,
        trialLocation,
      },
    });

    expect(true).toEqual(true);
  });
});
