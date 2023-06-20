import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

export const petitionerSearchesForUnassociatedSealedCase = cerebralTest => {
  return it('petitioner searches for unassociated sealed case', async () => {
    const sealedSeedCaseDocketNumber = '105-20';

    await cerebralTest.runSequence('gotoDashboardSequence');

    await cerebralTest.runSequence('updateSearchTermSequence', {
      searchTerm: sealedSeedCaseDocketNumber,
    });

    await cerebralTest.runSequence('submitCaseSearchSequence', {});

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const helper = runCompute(caseDetailHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showSealedCaseView).toBeTruthy();
    expect(cerebralTest.getState('caseDetail.isSealed')).toEqual(true);
    expect(cerebralTest.getState('caseDetail.docketNumber')).toBeDefined();

    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.caseCaption')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.docketEntries')).toEqual([]);
  });
};
