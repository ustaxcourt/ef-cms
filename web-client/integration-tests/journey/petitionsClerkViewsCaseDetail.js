import { runCompute } from 'cerebral/test';

import { caseDetailHelper } from '../../src/presenter/computeds/caseDetailHelper';

export default test => {
  return it('Petitions clerk views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual('New');
    expect(test.getState('caseDetail.documents').length).toEqual(2);

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showDocumentStatus).toEqual(true);
    expect(helper.showIrsServedDate).toEqual(false);
    expect(helper.showPayGovIdInput).toEqual(false);
    expect(helper.showPaymentOptions).toEqual(true);
  });
};
