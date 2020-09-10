import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const irsSuperuserSearchForUnservedCase = test => {
  return it('irsSuperuser searches for an unserved case by docket number from dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    test.setState('header.searchTerm', test.docketNumber);
    await test.runSequence('submitCaseSearchSequence');

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const petitionDocketEntry = formattedCase.formattedDocketEntries.find(
      entry => entry.documentTitle === 'Petition',
    );
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    // irsSuperuser should NOT see a link to a petition
    // document that has not been served
    expect(petitionDocketEntry.showLinkToDocument).toBeFalsy();
  });
};
