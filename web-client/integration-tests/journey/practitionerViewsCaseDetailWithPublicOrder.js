import { formattedDocketEntries as formattedDocketEntriesComputed } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedDocketEntries = withAppContextDecorator(
  formattedDocketEntriesComputed,
);

export const practitionerViewsCaseDetailWithPublicOrder = test => {
  return it('Practitioner views case detail with a publically-available order', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const helper = runCompute(formattedDocketEntries, {
      state: test.getState(),
    });

    const publicallyAvailableOrderDocketEntry =
      helper.formattedDocketEntriesOnDocketRecord.find(
        d => d.eventCode === 'O',
      );

    expect(publicallyAvailableOrderDocketEntry.showLinkToDocument).toBeTruthy();
  });
};
