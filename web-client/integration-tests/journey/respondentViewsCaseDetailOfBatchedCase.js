import { Case } from '../../../shared/src/business/entities/cases/Case';
import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

export default test => {
  return it('Respondent views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.batchedForIRS,
    );
    expect(test.getState('caseDetail.documents').length).toEqual(2);

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showActionRequired).toEqual(false);
  });
};
