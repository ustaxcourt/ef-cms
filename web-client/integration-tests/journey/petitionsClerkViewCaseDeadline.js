import { caseDetailHelper } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';

export default test => {
  return it('Petitions clerk views case deadlines', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.caseDeadlines.length).toEqual(1);
  });
};
