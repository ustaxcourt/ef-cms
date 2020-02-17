import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setupPropsForPrintablePendingReportAction } from './setupPropsForPrintablePendingReportAction';

describe('setupPropsForPrintablePendingReportAction', () => {
  it('should update the props with caseId if caseIdFilter is true', async () => {
    const result = await runAction(setupPropsForPrintablePendingReportAction, {
      modules: {
        presenter,
      },
      props: { caseDetail: { caseId: '123' }, caseIdFilter: true },
      state: {},
    });

    expect(result.output.caseIdFilter).toEqual('123');
  });
});
