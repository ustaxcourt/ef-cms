import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const practitionerViewsCaseDetailWithPublicOrder = test => {
  return it('Practitioner views case detail with a publically-available order', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const publicallyAvailableOrderDocketEntry = formattedCase.formattedDocketEntries.find(
      d => d.eventCode === 'O',
    );

    expect(publicallyAvailableOrderDocketEntry.showLinkToDocument).toBeTruthy();
  });
};
